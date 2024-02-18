import { serve } from "./deps.js";
import { grade } from "./services/gradingService.js";
import { createClient } from "npm:redis@4.6.4";

// Redis Configuration
const redisURL = "redis://redis:6379";
const taskStreamKey = "grading-tasks-stream";
const resultStreamKey = "grading-results-stream";
const groupName = "grading-task-group";
const consumerKey = `grader-api-${Math.random().toString(16)}`;

// Create a Redis client
const publisher = createClient({
  url: redisURL,
  pingInterval: 1000,
});

const subscriber = createClient({
  url: redisURL,
  pingInterval: 1000,
});

// Connect to redis
await publisher.connect();
await subscriber.connect();

// Setup consumer group for Redis Stream
try {
  await subscriber.xGroupCreate(taskStreamKey, groupName, '$', {
    MKSTREAM: true
  });
} catch (error) {
  if(!error.message.includes("BUSYGROUP")) {
    console.error(error.message);
    throw error;
  }
}

// Subscribe to a channel for grading tasks (OLD VERSION)
// await subscriber.subscribe("grading-tasks", async (message) => {
//   const { submissionId, code, testCode } = JSON.parse(message);
//
//   const graderFeedback = await grade(code, testCode);
//
//   await publisher.publish("grading-results", JSON.stringify({
//     submissionId,
//     graderFeedback
//   }));
// });

/**
 * Listens for grading tasks from a stream and processes them.
 * @async
 * @returns {Promise<void>}
 */
const listenForGradingTasksFromStream = async () => {
  console.log(`Consumer '${consumerKey}' started.`);
  while(true) {
    // Read data from the stream
    const tasks = await subscriber.xReadGroup(groupName, consumerKey, [
          {
            key: taskStreamKey,
            id: '>'
          }],
        {
          COUNT: 1,
          BLOCK: 1000
        }
    );

    // If there is a grading tasks, process it
    if(tasks) {
      const [{ messages }] = tasks;
      const [{ id, message }] = messages;
      const { submissionId, code, testCode } = message;

      console.log(`Processing submission: ${submissionId}`);

      const graderFeedback = await grade(code, testCode);

      await publisher.xAdd(resultStreamKey, "*", {
        submissionId: submissionId,
        graderFeedback: graderFeedback
      });

      await subscriber.xAck(taskStreamKey, groupName, id);

      console.log(`Submission ${submissionId} processed.`);
    }
  }
}

listenForGradingTasksFromStream();

let state = -1;

/**
 * Returns a code snippet based on the internal state.
 *
 * @returns {string} The code snippet.
 */
const getCode = () => {
  state = (state + 1) % 5;

  if (state == 0) {
    return `
def hello():
  return "Hello world!"
`;
  } else if (state == 1) {
    return `
def hello():
  return "hello world!"
    `;
  } else if (state == 2) {
    return `
def ohnoes():
  return "Hello world!"
    `;
  } else if (state == 3) {
    return `
:D
      `;
  } else {
    return `
while True:
  print("Hmmhmm...")
    `;
  }
};

/**
 * Evaluates the code and returns the grading result.
 * The code is evaluated against a test code using the "grade" function.
 *
 * @returns {Promise<object>} - The grading result as an object.
 */
const gradingDemo = async () => {
  let code = getCode();

  const testCode = `
import socket
def guard(*args, **kwargs):
  raise Exception("Internet is bad for you :|")
socket.socket = guard

import unittest
from code import *

class TestHello(unittest.TestCase):

  def test_hello(self):
    self.assertEqual(hello(), "Hello world!", "Function should return 'Hello world!'")

if __name__ == '__main__':
  unittest.main()  
`;

  return await grade(code, testCode);
};

/**
 * Handles a request to the grader API.
 *
 * @param {Request} request - The request object containing the code to grade.
 * @returns {Response} - The response object containing the grader feedback or an empty response if an error occurred.
 *
 * @throws {Error} - If an error occurs while processing the request.
 */
const handleRequest = async (request) => {
  // // the starting point for the grading api grades code following the
  // // gradingDemo function, but does not e.g. use code from the user
  //
  // // in practice, you would either send the code to grade to the grader-api
  // // or use e.g. a message queue that the grader api would read and process
  //
  // try {
  //   const requestData = await request.json();
  //
  //   const code = requestData.code;
  //   const testCode = requestData.testCode;
  //
  //   const graderFeedback = await grade(code, testCode);
  //   return new Response(JSON.stringify({ graderFeedback: graderFeedback }));
  //
  // } catch (e) {
  //   console.log('Error: ', e)
  //   return new Response();
  // }
  return new Response("Grader API");
};

const portConfig = { port: 7000, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);
