const Category = require('../models/Category');
const Task = require('../models/Task');

// Get all categories for the current user
const getAllCategories = async (req, res) => {
    try {
        const userId = req.user.id;

        const categories = await Category.findAllByUser(userId);

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error('Get all categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const userId = req.user.id;

        const category = await Category.findByIdAndUser(categoryId, userId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Count tasks in this category
        const taskCount = await Category.countTasks(categoryId, userId);

        res.status(200).json({
            success: true,
            data: {
                ...category,
                taskCount
            }
        });
    } catch (error) {
        console.error('Get category by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Create a new category
const createCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description } = req.body;

        // Basic validation
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        const category = await Category.create({ name, description }, userId);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        console.error('Create category error:', error);

        // Check for duplicate category name
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'A category with this name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update an existing category
const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const userId = req.user.id;
        const { name, description } = req.body;

        // Check if category exists and belongs to user
        const existingCategory = await Category.findByIdAndUser(categoryId, userId);

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found or you do not have permission to update it'
            });
        }

        // If no fields to update were provided
        if (!name && description === undefined) {
            return res.status(400).json({
                success: false,
                message: 'No fields provided for update'
            });
        }

        const updatedCategory = await Category.update(categoryId, { name, description }, userId);

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory
        });
    } catch (error) {
        console.error('Update category error:', error);

        // Check for duplicate category name
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'A category with this name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const userId = req.user.id;

        // Check if category exists and belongs to user
        const existingCategory = await Category.findByIdAndUser(categoryId, userId);

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found or you do not have permission to delete it'
            });
        }

        // Check if there are tasks in this category
        const taskCount = await Category.countTasks(categoryId, userId);

        if (taskCount > 0) {
            // We'll allow deletion but will set category_id to null for associated tasks
            // This behavior could be changed based on requirements
            await Task.update(null, { category_id: null }, userId);
        }

        await Category.delete(categoryId, userId);

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};