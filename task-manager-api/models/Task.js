const { query } = require('../config/db');

class Task {
    // Get all tasks for a user with optional filters
    static async findAllByUser(userId, filters = {}) {
        try {
            let sql = `
            SELECT t.*, c.name as category_name 
            FROM tasks t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ?
            `;

            const params = [userId];

            // Add filters if provided
            const { status, priority, category_id } = filters;

            if (status) {
                sql += ' AND t.status = ?';
                params.push(status);
            }

            if (priority) {
                sql += ' AND t.priority = ?';
                params.push(priority);
            }

            if (category_id) {
                sql += ' AND t.category_id = ?';
                params.push(category_id);
            }

            // Order by creation date (newest first)
            sql += ' ORDER BY t.created_at DESC';

            const tasks = await query(sql, params);

            return tasks;
        } catch (error) {
            console.error('Error finding tasks:', error);
            throw error;
        }
    }

    // Find task by ID for a specific user
    static async findByIdAndUser(id, userId) {
        try {
            const tasks = await query(
                `SELECT t.*, c.name as category_name 
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.id = ? AND t.user_id = ?`,
                [id, userId]
            );

            return tasks.length > 0 ? tasks[0] : null;
        } catch (error) {
            console.error('Error finding task by ID:', error);
            throw error;
        }
    }

    // Create a new task
    static async create(taskData, userId) {
        try {
            const {
                title,
                description,
                status,
                priority,
                due_date,
                category_id
            } = taskData;

            const result = await query(
                `INSERT INTO tasks 
                (title, description, status, priority, due_date, user_id, category_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    title,
                    description || null,
                    status || 'pending',
                    priority || 'medium',
                    due_date || null,
                    userId,
                    category_id || null
                ]
            );

            // Get the created task
            const createdTask = await query(
                `SELECT t.*, c.name as category_name 
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.id = ?`,
                [result.insertId]
            );

            return createdTask.length > 0 ? createdTask[0] : null;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    // Update task
    static async update(id, taskData, userId) {
        try {
            const {
                title,
                description,
                status,
                priority,
                due_date,
                category_id
            } = taskData;

            // Build update query dynamically based on provided fields
            const updates = [];
            const params = [];

            if (title !== undefined) {
                updates.push('title = ?');
                params.push(title);
            }

            if (description !== undefined) {
                updates.push('description = ?');
                params.push(description);
            }

            if (status !== undefined) {
                updates.push('status = ?');
                params.push(status);
            }

            if (priority !== undefined) {
                updates.push('priority = ?');
                params.push(priority);
            }

            if (due_date !== undefined) {
                updates.push('due_date = ?');
                params.push(due_date);
            }

            if (category_id !== undefined) {
                updates.push('category_id = ?');
                params.push(category_id);
            }

            // If no fields to update
            if (updates.length === 0) return null;

            // Add task ID and user ID to params
            params.push(id);
            params.push(userId);

            // Execute update
            await query(
                `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
                params
            );

            // Get updated task
            return await this.findByIdAndUser(id, userId);
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    // Delete task
    static async delete(id, userId) {
        try {
            const result = await query(
                'DELETE FROM tasks WHERE id = ? AND user_id = ?',
                [id, userId]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }

    // Find tasks by category
    static async findByCategoryAndUser(categoryId, userId) {
        try {
            const tasks = await query(
                `SELECT t.*, c.name as category_name 
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.category_id = ? AND t.user_id = ?
                ORDER BY t.created_at DESC`,
                [categoryId, userId]
            );

            return tasks;
        } catch (error) {
            console.error('Error finding tasks by category:', error);
            throw error;
        }
    }

    // Get task statistics for user
    static async getStatistics(userId) {
        try {
            const stats = {
                total: 0,
                completed: 0,
                pending: 0,
                in_progress: 0,
                cancelled: 0,
                high_priority: 0,
                due_soon: 0 // Tasks due in the next 48 hours
            };

            // Get total counts by status
            const statusCounts = await query(
                'SELECT status, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY status',
                [userId]
            );

            statusCounts.forEach(item => {
                stats.total += item.count;
                if (item.status === 'completed') stats.completed = item.count;
                if (item.status === 'pending') stats.pending = item.count;
                if (item.status === 'in_progress') stats.in_progress = item.count;
                if (item.status === 'cancelled') stats.cancelled = item.count;
            });

            // Get high priority tasks
            const highPriorityResult = await query(
                "SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND priority IN ('high', 'urgent')",
                [userId]
            );
            stats.high_priority = highPriorityResult[0].count;

            // Get tasks due in next 48 hours
            const twoDaysFromNow = new Date();
            twoDaysFromNow.setHours(twoDaysFromNow.getHours() + 48);

            const dueSoonResult = await query(
                "SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND due_date <= ? AND status != 'completed'",
                [userId, twoDaysFromNow]
            );
            stats.due_soon = dueSoonResult[0].count;

            return stats;
        } catch (error) {
            console.error('Error getting task statistics:', error);
            throw error;
        }
    }
}

module.exports = Task;