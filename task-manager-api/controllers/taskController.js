
const Task = require('../models/Task');
const Category = require('../models/Category');

// Get all tasks for the current user
const getAllTasks = async (req, res) => {
    try {
        const userId = req.user.id;

        const tasks = await Task.findAllByUser(userId);

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error('Get all tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;

        const tasks = await Task.findByIdAndUser(taskId, userId);
        res.status(200).json({
            success: true,
            data: tasks[0]
        });
    } catch (error) {
        console.error('Get task by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Create a new task
const createTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            title,
            description,
            status,
            priority,
            due_date,
            category_id
        } = req.body;

        // Basic validation
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        // If category_id is provided, check if it exists and belongs to the user
        if (category_id) {
            const categories = await Category.findByIdAndUser(category_id, userId);

            if (categories.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Category not found or does not belong to you'
                });
            }
        }

        // Insert task
        const result = await Task.create({
            title,
            description,
            status: status || 'pending',
            priority: priority || 'medium',
            due_date: due_date || null,
            user_id: userId,
            category_id: category_id || null
        }, userId);

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: result
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update an existing task
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        const {
            title,
            description,
            status,
            priority,
            due_date,
            category_id
        } = req.body;

        // Check if task exists and belongs to user
        const existingTasks = await Task.findByIdAndUser(taskId, userId);

        if (existingTasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or you do not have permission to update it'
            });
        }

        // If category_id is provided, check if it exists and belongs to the user
        if (category_id) {
            const categories = await Category.findByIdAndUser(category_id, userId);

            if (categories.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Category not found or does not belong to you'
                });
            }
        }

        const updatedTask = await Task.update(
            taskId,
            {
                title,
                description,
                status,
                priority,
                due_date,
                category_id
            },
            userId
        );

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;

        // Check if task exists and belongs to user
        const existingTasks = await Task.findByIdAndUser(taskId, userId);

        if (existingTasks.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Task not found or you do not have permission to delete it'
        });
        }

        // Delete task
        await Task.delete(taskId, userId);

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get tasks by category
const getTasksByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const userId = req.user.id;

        // Check if category exists and belongs to user
        const categories = await Category.findByIdAndUser(categoryId, userId);

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found or does not belong to you'
            });
        }

        // Get tasks
        const tasks = await Task.findByCategoryAndUser(categoryId, userId);

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error('Get tasks by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const getTasksStatistics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get task statistics
        const statistics = await Task.getStatistics(userId);

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (error) {
        console.error('Get task statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Export all functions

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByCategory,
    getTasksStatistics
};