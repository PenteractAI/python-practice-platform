import { sql } from "../database/database.js";
import { toCamelCase, toSnakeCase } from "../utils/objectKeyTransforms.js";

/**
 * Finds a programming assignment submission by assignment ID and code.
 *
 * @param {number} assignmentId - The ID of the programming assignment.
 * @param {string} code - The code submitted for the assignment.
 * @returns {Promise<object|null>} - The found programming assignment submission, converted to camelCase, or null if not found.
 */
const findByAssignmentIdAndCode = async(assignmentId, code) => {
  const results = await sql`
    SELECT 
      id, code, status, grader_feedback, correct, last_updated
    FROM 
      programming_assignment_submissions
    WHERE 
      programming_assignment_id = ${assignmentId} 
      AND code = ${code}
    LIMIT 1;
  `;

  return toCamelCase(results[0]) || null;
}

/**
 * Finds a programming assignment submission by its ID.
 *
 * @async
 * @param {number} submissionId - The ID of the submission to find.
 * @return {Object | null} - The found submission or null if no submission is found.
 */
const findById = async (submissionId) => {
  const results = await sql`
    SELECT 
      id, code, status, grader_feedback, correct, last_updated
    FROM 
      programming_assignment_submissions
    WHERE 
      id = ${submissionId};
  `;

  return toCamelCase(results[0]) || null;

}

/**
 * Saves a submission for a programming assignment.
 *
 * @param {number} assignmentId - The ID of the programming assignment.
 * @param {string} code - The code submitted by the user.
 * @param {string} userUuid - The UUID of the user who submitted the assignment.
 * @param {string} status - The status of the submission.
 * @param {string} graderFeedback - Feedback provided by the grader.
 * @param {boolean} correct - Indicates whether the submission is correct or not.
 * @returns {object} - The saved submission, converted to camel case.
 */
const saveSubmission = async(assignmentId, code, userUuid, status, graderFeedback, correct) => {
  const results = await sql`
    INSERT INTO programming_assignment_submissions (programming_assignment_id, code, user_uuid, status, grader_feedback, correct)
    VALUES (${assignmentId}, ${code}, ${userUuid}, ${status}, ${graderFeedback}, ${correct})
    RETURNING id;
  `;

  return toCamelCase(results[0]);
}

/**
 * Updates a programming assignment submission in the database.
 *
 * @async
 * @param {number} submissionId - The ID of the submission to update.
 * @param {string} status - The new status of the submission.
 * @param {string} graderFeedback - The feedback given by the grader.
 * @param {boolean} correct - Whether or not the submission is correct.
 * @returns {Promise<any>} - A promise that resolves when the submission is updated successfully.
 */
const updateSubmission = async(submissionId, status, graderFeedback, correct) => {
  const results = await sql`
    UPDATE programming_assignment_submissions
    SET 
      status = ${status}, 
      grader_feedback = ${graderFeedback}, 
      correct = ${correct}
    WHERE 
      id = ${submissionId}
  `;

  return toCamelCase(results);
}

/**
 * Finds programming assignment submissions by user UUID and orders them by last updated date in descending order.
 *
 * @param {string} userUuid - The UUID of the user.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of programming assignment submissions.
 */
const findByUserOrderedByLastUpdated = async(userUuid) => {
  const results = await sql`
    SELECT 
        pas.id, pa.id AS assignment_id, code, status, correct, grader_feedback, last_updated, assignment_order
    FROM
        programming_assignment_submissions As pas
    INNER JOIN
        programming_assignments AS pa
    ON
        pas.programming_assignment_id = pa.id
    WHERE
        user_uuid = ${userUuid}
    ORDER BY
        last_updated DESC;
  `;

  return toCamelCase(results);
}

/**
 * Computes the score by user based on their correct programming assignment submissions.
 *
 * @async
 * @param {string} userUuid - The UUID of the user.
 * @returns {Promise<{score: number}>} - Object containing the computed score.
 */
const computeScoreByUser = async(userUuid) => {
  const results = await sql`
    SELECT
        COUNT(DISTINCT pas.programming_assignment_id) * 100 AS score
    FROM
        programming_assignment_submissions As pas
    WHERE
        pas.user_uuid = ${userUuid}
        AND pas.correct = TRUE;
  `;

  return {score: parseInt(results[0].score)};
}

export { findById, findByAssignmentIdAndCode, saveSubmission, updateSubmission, findByUserOrderedByLastUpdated, computeScoreByUser };
