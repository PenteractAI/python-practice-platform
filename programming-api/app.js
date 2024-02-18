import * as assignmentService from "./services/assignmentService.js";
import * as submissionService from "./services/submissionService.js";
import * as gradingService from "./services/gradingService.js";
import { cacheMethodCalls } from "./utils/cacheUtil.js";
import { serve } from "./deps.js";


console.log("Initializing the programming-api service...");

const cachedAssignmentService = cacheMethodCalls(assignmentService, ["addAssignment"])

/**
 * Retrieves the current assignment for a user
 * @async
 * @param {Request} request - The request object containing the userUuid
 * @returns {Response} The response object containing the current assignment
 */
const handleGetCurrentAssignment = async (request) => {

  const requestData = await request.json();
  const userUuid = requestData.userUuid;

  // Retrieve the submissions for the corresponding user from the database
  const submissions = await submissionService.findByUserOrderedByLastUpdated(userUuid);

  // If the user has no submission, then get the first assignment by its order
  if(submissions.length === 0) {
    console.log('No submission retrieved from the user.');
    console.log('Retrieve the first assignment from the database.');

    // Retrieves the first assignment from the database
    // and add an empty submissions array for consistency
    let firstAssignment = await cachedAssignmentService.findByOrder(1);
    firstAssignment.submissions = [];

    return Response.json(firstAssignment);
  }

  // If the user's last submission is correct, then get the next assignment
  const latestSubmission = submissions[0];
  if(latestSubmission.correct) {
    console.log('The user has finished its current assignment.');
    console.log('Retrieve the next assignment from the database.');

    // Retrieves the next assignment from the database
    // and do not add an empty submissions array if the current assignment was the last one
    let nextAssignment = await cachedAssignmentService.findByOrder(latestSubmission.assignmentOrder + 1);
    if(nextAssignment != undefined) {
      nextAssignment.submissions = [];
    }

    return Response.json(nextAssignment);
  }

  // Otherwise, the user has a non-finished assignment, then get this assignment
  console.log('The user has not finished its current assignment.');
  console.log('Retrieve the current assignment from the database.');

  // Retrieve the current assignment from the database
  let currentAssignment = await cachedAssignmentService.findById(submissions[0].assignmentId);
  delete currentAssignment.testCode;

  // Filters the submission by their assignment ID
  // Then, removes the useless "assignment ID" field from their object
  currentAssignment.submissions = submissions
      .filter((submission) => { return submission.assignmentId == currentAssignment.id; })
      .map(({ assignmentId, ...rest }) => rest);

  return Response.json(currentAssignment);
}

/**
 * Handles a post grading request.
 *
 * @param {Object} request - The request to be handled.
 * @returns {Object} The response object.
 */
const handlePostGradingRequest = async (request) => {

  const jsonData = await request.json();
  const { assignmentId, userUuid, code } = jsonData;


  console.log(`Post grading request from user ${userUuid}`);

  // Check and reject if the user already has a submission request
  if(await gradingService.checkSubmission(userUuid)) {
      return new Response("User already has a submission request", { status: 400 });
  }

  // Add the user UUID to the redis cache
  await gradingService.setSubmission(userUuid);

  /**
   * Step 1: Save the submission and get its ID
   */

  // Look for submissions with the same code for the same assignment in the database
  console.log("Looking for a submission with the same code...");
  let submission = await submissionService.findByAssignmentIdAndCode(assignmentId, code);

  const requiresGrading = submission == null;
  let status, graderFeedback, correct;

  // If a submission with the same code is found, copy the status, graderFeedback and correct
  // Otherwise, assigns default values
  if(!requiresGrading) {
    console.log("Submission with the same code found in the database.")

    status = submission.status;
    graderFeedback = submission.graderFeedback;
    correct = submission.correct;

  } else {
    console.log("No submission with the same code found in the database.")

    status = 'pending';
    graderFeedback = '';
    correct = false;
  }

  // Submission is stored into the database and get the submission ID
  const submissionIdObject = await submissionService.saveSubmission(
      assignmentId,
      code,
      userUuid,
      status,
      graderFeedback,
      correct
  );

  console.log(`Submission ${submissionIdObject.id} stored in the database.`);

  let response = Response.json(submissionIdObject);

  /**
   * Step 2: Send a request for grading if necessary
   */

  if(requiresGrading) {
    // Retrieve the testCode to test the submission.
    // This is done at the latest to avoid testCode modifications during the process
    const assignment = await assignmentService.findById(assignmentId);
    const testCode = assignment.testCode;

    gradingService.publishGradingTaskToStream(submissionIdObject.id, code, testCode);
  }

  return response;
};

/**
 * Handles getting the submission status through a WebSocket connection.
 *
 * @param {Request} request - The request object containing the WebSocket connection information.
 * @returns {Response} - The response object.
 */
const handleGetSubmissionStatus = async(request) => {
  const { socket, response } = Deno.upgradeWebSocket(request);

  socket.onopen = () => {
    console.log("WebsSocket connection opened.");
  }

  socket.onmessage = async (event) => {
    const jsonData = JSON.parse(event.data);
    console.log("WebSocket message received: ", jsonData)

    const { lastSubmissionId, userUuid } = jsonData;
    let checkInterval = setInterval(async () => {
      const result = await submissionService.findById(lastSubmissionId);
      if(socket.readyState === WebSocket.OPEN) {
        if (result.status == 'processed') {
          await gradingService.removeSubmission(userUuid);
          socket.send(JSON.stringify(result));
          clearInterval(checkInterval);
        }
      } else {
        // Once the grading task has been processed, remove the user UUID from the Redis cache
        clearInterval(checkInterval);
        console.log("WebSocket has been closed. Stopping checks for submission status.");
      }

    }, 3000)
  }

  socket.onerror = (error) => {
    console.log("WebSocket error: ", error);
  }

  socket.onclose = (event) => {
    console.log("WebSocket connection closed: ", event.code, event.reason);
  }

  return response;
}

/**
 * Handles the GET request to compute and return the score for a user.
 *
 * @async
 * @param {Request} request - The request object.
 * @returns {Response} The response object containing the computed score.
 */
const handleGetScore = async (request) => {
  const jsonData = await request.json();
  const userUuid = jsonData.userUuid;

  const score = await submissionService.computeScoreByUser(userUuid);
  return Response.json(score);
}

const urlMapping = [
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/score" }),
    fn: handleGetScore,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/assignment" }),
    fn: handleGetCurrentAssignment,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/grade" }),
    fn: handlePostGradingRequest,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/submission"}),
    fn: handleGetSubmissionStatus
  }
];

/**
 * Handles the incoming request and routes it to the appropriate function based on the URL mapping.
 *
 * @param {Object} request - The incoming request object.
 * @returns {Promise<Object>} - A promise that resolves with the response object.
 */
const handleRequest = async (request) => {
  const mapping = urlMapping.find(
      (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response(`Not found`, { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 })
  }
};

const portConfig = { port: 7777, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);
