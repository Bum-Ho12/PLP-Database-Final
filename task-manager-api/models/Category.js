const { query } = require('../config/db');

class Category {
    // Get all categories for a user
    static async findAllByUser(userId) {
        try {
            const categories = await query(
                'SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC',
                [userId]
            );

            return categories;
        } catch (error) {
            console.error('Error finding categories:', error);
            throw error;
        }
    }

    // Find category by ID for a specific user
    static async findByIdAndUser(id, userId) {
        try {
            const categories = await query(
                'SELECT * FROM categories WHERE id = ? AND user_id = ?',
                [id, userId]
            );

            return categories.length > 0 ? categories[0] : null;
        } catch (error) {
            console.error('Error finding category by ID:', error);
            throw error;
        }
    }

    // Create a new category
    static async create(categoryData, userId) {
        try {
            const { name, description } = categoryData;

            const result = await query(
                'INSERT INTO categories (name, description, user_id) VALUES (?, ?, ?)',
                [name, description || null, userId]
            );

            return {
                id: result.insertId,
                name,
                description,
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date()
            };
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    // Update category
    static async update(id, categoryData, userId) {
        try {
            const { name, description } = categoryData;

            const updates = [];
            const params = [];

            if (name !== undefined) {
                updates.push('name = ?');
                params.push(name);
            }

            if (description !== undefined) {
                updates.push('description = ?');
                params.push(description);
            }

            if (updates.length === 0) return null;

            params.push(id);
            params.push(userId);

            await query(
                `UPDATE categories SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
                params
            );

            return await this.findByIdAndUser(id, userId);
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }

    // Delete category
    static async delete(id, userId) {
        try {
            const result = await query(
                'DELETE FROM categories WHERE id = ? AND user_id = ?',
                [id, userId]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }

    // Count tasks in category
    static async countTasks(id, userId) {
        try {
            const result = await query(
                'SELECT COUNT(*) as count FROM tasks WHERE category_id = ? AND user_id = ?',
                [id, userId]
            );

            return result[0].count;
        } catch (error) {
            console.error('Error counting tasks in category:', error);
            throw error;
        }
    }
}

module.exports = Category;