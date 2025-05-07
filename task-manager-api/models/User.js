const { query } = require('../config/db');

class User {
    // Find user by ID
    static async findById(id) {
        try {
            const users = await query(
                'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?',
                [id]
            );

            return users.length > 0 ? users[0] : null;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        try {
            const users = await query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            return users.length > 0 ? users[0] : null;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    // Find user by username
    static async findByUsername(username) {
        try {
            const users = await query(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );

            return users.length > 0 ? users[0] : null;
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw error;
        }
    }

    // Create a new user
    static async create(userData) {
        try {
            const { username, email, password } = userData;

            const result = await query(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, password]
            );

            return {
                id: result.insertId,
                username,
                email
            };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Update user
    static async update(id, userData) {
        try {
            const { username, email } = userData;

            const updates = [];
            const params = [];

            if (username) {
                updates.push('username = ?');
                params.push(username);
            }

            if (email) {
                updates.push('email = ?');
                params.push(email);
            }

            if (updates.length === 0) return null;

            params.push(id);

            await query(
                `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            return await this.findById(id);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Delete user
    static async delete(id) {
        try {
            const result = await query(
                'DELETE FROM users WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}

module.exports = User;