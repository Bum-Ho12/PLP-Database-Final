const express = require('express');
const router = express.Router();
const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByCategory,
    getTasksStatistics
} = require('../controllers/taskController');
const { authenticateUser } = require('../middleware/auth');

// Apply authentication middleware to all task routes
router.use(authenticateUser);

// Get all tasks
router.get('/', getAllTasks);

// Get task by ID
router.get('/:id', getTaskById);

// Create new Task
router.post('/', createTask);

// Update Task
router.put('/:id', updateTask);

// Delete task
router.delete('/:id', deleteTask);

// Get tasks by category
router.get('/category/:id', getTasksByCategory);

// Get tasks statistics
router.get('/statistics', getTasksStatistics);

module.exports = router;