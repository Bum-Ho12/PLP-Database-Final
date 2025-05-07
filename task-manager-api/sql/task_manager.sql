/*
    Task Manager Database
    A database for managing tasks with user authentication and categories

    Tables:
    - users: User account information and authentication
    - categories: Task categories or groups
    - tasks: Individual tasks with relationships to users and categories
*/

-- Drop database if it exists and create a new one
DROP DATABASE IF EXISTS task_manager;
CREATE DATABASE task_manager;
USE task_manager;

-- Create tables

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_category_per_user (name, user_id)
);

-- Tasks table
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    due_date DATETIME,
    user_id INT NOT NULL,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Insert sample data

-- Sample users (password is hashed 'password123')
INSERT INTO users (username, email, password) VALUES
('john_doe', 'john@example.com', '$2a$10$1JmPL.dV7dTuhJoEGxbmzu4IXEv4QRKaKYMlk9xWGz7G9K3MgV5O2'),
('jane_smith', 'jane@example.com', '$2a$10$1JmPL.dV7dTuhJoEGxbmzu4IXEv4QRKaKYMlk9xWGz7G9K3MgV5O2');

-- Sample categories
INSERT INTO categories (name, description, user_id) VALUES
('Work', 'Work-related tasks', 1),
('Personal', 'Personal tasks and errands', 1),
('Health', 'Health and fitness tasks', 1),
('Shopping', 'Shopping list', 2),
('Study', 'Educational tasks', 2);

-- Sample tasks
INSERT INTO tasks (title, description, status, priority, due_date, user_id, category_id) VALUES
('Complete project proposal', 'Finish the Q2 project proposal document', 'in_progress', 'high', '2025-05-15 17:00:00', 1, 1),
('Gym session', 'Cardio and upper body workout', 'pending', 'medium', '2025-05-07 07:00:00', 1, 3),
('Buy groceries', 'Milk, eggs, bread, vegetables', 'pending', 'low', '2025-05-08 18:00:00', 1, 2),
('Study for exam', 'Review chapters 5-8 for the upcoming test', 'pending', 'high', '2025-05-10 20:00:00', 2, 5),
('Buy new laptop', 'Research and purchase new work laptop', 'in_progress', 'medium', '2025-05-20 12:00:00', 2, 4);

-- Create indexes for performance optimization
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_category ON tasks(category_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);