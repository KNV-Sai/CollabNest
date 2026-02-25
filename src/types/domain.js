// Domain type definitions (as JSDoc comments for reference)
/**
 * @typedef {'admin' | 'student'} UserRole
 * 
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * 
 * @typedef {'todo' | 'in_progress' | 'completed'} TaskStatus
 * 
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {TaskStatus} status
 * @property {string} assigneeId
 * @property {string} [milestoneId]
 * 
 * @typedef {Object} Milestone
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {string} dueDate
 * 
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} name
 * @property {string} course
 * @property {string} description
 * @property {string} mentorId
 * @property {string[]} studentIds
 * @property {Milestone[]} milestones
 * @property {Task[]} tasks
 * @property {string} [submissionUrl]
 */

export {}
