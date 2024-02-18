import { sql } from "../database/database.js";
import { toCamelCase, toSnakeCase } from "../utils/objectKeyTransforms.js";

/**
 * Finds a programming assignment by its order.
 *
 * @param {number} order - The order of the assignment.
 * @returns {Promise<Object>} - The programming assignment object found, or null if not found.
 */
const findByOrder = async(order) => {
  const results = await sql`
    SELECT 
        id, title, assignment_order, handout
    FROM 
        programming_assignments
    WHERE
        assignment_order = ${order}
  `;

  return toCamelCase(results[0]) || null;
}

/**
 * Find a programming assignment by its ID.
 *
 * @param {number} id - The ID of the programming assignment.
 * @return {Object|null} - The programming assignment with the specified ID, or null if not found.
 */
const findById = async(id) => {
  const results = await sql`
    SELECT 
        id, title, assignment_order, handout, test_code
    FROM 
        programming_assignments
    WHERE
        id = ${id}
  `;

  return toCamelCase(results[0]) || null;
}

/**
 * Adds a programming assignment to the database.
 *
 * @param {string} title - The title of the assignment.
 * @param {number} assignmentOrder - The order of the assignment in the course.
 * @param {string} handout - The handout for the assignment.
 * @param {string} testCode - The test code for the assignment.
 * @returns {Promise<number>} - The ID of the newly created assignment.
 */
const addAssignment = async(title, assignmentOrder, handout, testCode) => {
  const results = await sql`
    INSERT INTO programming_assignments (title, assignment_order, handout, test_code)
    VALUES (${title}, ${assignmentOrder}, ${handout}, ${testCode})
    RETURNING id;
  `;

  return toCamelCase(results[0]);
}

export { findByOrder, findById, addAssignment };
