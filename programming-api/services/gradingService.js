import * as submissionService from "./submissionService.js";
import { createClient } from "npm:redis@4.6.4";

// Redis configuration
const redisURL = "redis://redis:6379";
const taskStreamKey = "grading-tasks-stream";
const resultStreamKey = "grading-results-stream";
const groupName = "grading-results-group";
// const consumerKey = `programming-api-${Math.random().toString(16)}`;
const consumerKey = `programming-api-${Math.random().toString(16)}`;

// Create a Redis client
const publisher = createClient({
    url: redisURL,
    pingInterval: 500,
});

const subscriber = createClient({
    url: redisURL,
    pingInterval: 500,
});

// Connect to redis
await publisher.connect();
await subscriber.connect();

// Setup consumer group for Redis Stream
try {
    await subscriber.xGroupCreate(resultStreamKey, groupName, '$', {
        MKSTREAM: true
    });
} catch (error) {
    if(!error.message.includes("BUSYGROUP")) {
        console.error(error.message);
        throw error;
    }
}

/**
 * Publishes a grading task for a submission.
 *
 * @async
 * @param {string} submissionId - The identifier of the submission.
 * @param {string} code - The code to be graded.
 * @param {string} testCode - The test code for grading the code.
 * @returns {Promise} A promise that resolves when the grading task is published.
 */
const publishGradingTask = async (submissionId, code, testCode) => {
    publisher.publish("grading-tasks", JSON.stringify({
        submissionId,
        code,
        testCode
    }));
}

/**
 * Publishes a grading task to a stream.
 *
 * @param {string} submissionId - The ID of the submission.
 * @param {string} code - The code to be graded.
 * @param {string} testCode - The test code to be run against the submitted code.
 * @returns {Promise} - A promise that resolves when the grading task has been published.
 */
const publishGradingTaskToStream = async (submissionId, code, testCode) => {
    console.log(`Publishing submission ${submissionId} on Redis Stream for grading.`);

    await publisher.xAdd(taskStreamKey, '*', {
        submissionId: submissionId.toString(),
        code: code,
        testCode: testCode
    });

    console.log(`Submission ${submissionId} published on Redis Stream for grading.`)
}

/**
 * Listens for grading results and updates the submission in the database.
 *
 * @async
 * @function listenGradingResults
 * @returns {Promise<void>}
 */
const listenGradingResults = async () => {
    await subscriber.subscribe("grading-results", async (message) => {
        const { submissionId, graderFeedback } = JSON.parse(message);
        const status = "processed";

        // The correctness of a submission depends on the presence or not of certain keywords
        const keywords = ["FAILED", "Traceback"];
        const correct = !keywords.some(word => graderFeedback.includes(word))

        // Update the submission in the database
        await submissionService.updateSubmission(
            submissionId,
            status,
            graderFeedback,
            correct
        );
    });
}

/**
 * Listens for grading results from a stream and processes them.
 *
 * @async
 * @returns {void}
 */
const listenGradingResultsFromStream = async () => {
    while(true) {
        const results = await subscriber.xReadGroup(groupName, consumerKey, [{
            key: resultStreamKey,
            id: '>'
        }],
        {
            COUNT: 1,
            BLOCK: 1000
        });

        // If there is a grading result, process it
        if(results) {
            const [{ messages }] = results;
            const [{ id, message }] = messages;
            const { submissionId, graderFeedback } = message;

            console.log(`Feedback received from Redis Stream for submission ${submissionId}`);

            // The correctness of a submission depends on the presence or not of certain keywords
            const keywords = ["FAILED", "Traceback"];
            const correct = !keywords.some(word => graderFeedback.includes(word));
            const status = "processed";

            // Update the submission in the database
            await submissionService.updateSubmission(
                submissionId,
                status,
                graderFeedback,
                correct
            );

            await subscriber.xAck(taskStreamKey, groupName, id);
        }
    }
}

/**
 * Builds a submission key for grading based on the user UUID.
 *
 * @param {string} userUuid - The UUID of the user.
 * @returns {string} The submission key for grading.
 */
const buildSubmissionKey = (userUuid) => {
    return `submission:grading:${userUuid}`;
}

/**
 * Checks if a submission exists for a given user UUID.
 *
 * @param {string} userUuid - The UUID of the user.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the submission exists or not.
 */
const checkSubmission = async (userUuid) => {
    const key = buildSubmissionKey(userUuid);
    return await publisher.exists(key);
}

/**
 * Sets the submission status to 'in-progress' for the specified user.
 *
 * @param {string} userUuid - The UUID of the user.
 * @returns {Promise<void>} - A Promise that resolves when the submission status is set.
 */
const setSubmission = async (userUuid) => {
    const key = buildSubmissionKey(userUuid);
    await publisher.set(key, 'in-progress');
}

/**
 * Removes a submission associated with a user.
 *
 * @param {string} userUuid - The UUID of the user.
 * @returns {Promise<void>} - A promise that resolves when the submission is successfully removed.
 */
const removeSubmission = async (userUuid) => {
    const key = buildSubmissionKey(userUuid);
    await publisher.del(key);
}

export { publishGradingTaskToStream, checkSubmission, setSubmission, removeSubmission };

listenGradingResultsFromStream();