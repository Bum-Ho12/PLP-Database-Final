/*
    Library Management System Database
    A comprehensive database design for managing a public library system.

    Designed tables:
    - members: Library patrons information
    - books: Information about books in the library
    - authors: Information about book authors
    - book_authors: Many-to-many relationship between books and authors
    - categories: Book categories/genres
    - book_categories: Many-to-many relationship between books and categories
    - loans: Track book borrowing transactions
    - reservations: Handle book reservation requests
    - library_branches: Different physical locations of the library
    - staff: Library employees information
    - fines: Track overdue fines
*/

-- Drop database if it exists and create a new one
DROP DATABASE IF EXISTS library_management;
CREATE DATABASE library_management;
USE library_management;

-- Create tables

-- Library branches table
CREATE TABLE library_branches (
    branch_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    opening_hours VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Members table
CREATE TABLE members (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    date_of_birth DATE,
    membership_date DATE NOT NULL,
    membership_expiry DATE,
    membership_status ENUM('active', 'expired', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Authors table
CREATE TABLE authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    death_date DATE,
    biography TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    publication_year YEAR,
    publisher VARCHAR(100),
    total_copies INT NOT NULL DEFAULT 0,
    available_copies INT NOT NULL DEFAULT 0,
    branch_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES library_branches(branch_id) ON DELETE SET NULL
);

-- Many-to-many relationship between books and authors
CREATE TABLE book_authors (
    book_id INT,
    author_id INT,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
);

-- Many-to-many relationship between books and categories
CREATE TABLE book_categories (
    book_id INT,
    category_id INT,
    PRIMARY KEY (book_id, category_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Staff table
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    branch_id INT,
    hire_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES library_branches(branch_id) ON DELETE SET NULL
);

-- Loans table
CREATE TABLE loans (
    loan_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    member_id INT NOT NULL,
    staff_id INT,
    loan_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status ENUM('borrowed', 'returned', 'overdue') DEFAULT 'borrowed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL
);

-- Reservations table
CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    member_id INT NOT NULL,
    reservation_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('pending', 'fulfilled', 'cancelled', 'expired') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE
);

-- Fines table
CREATE TABLE fines (
    fine_id INT AUTO_INCREMENT PRIMARY KEY,
    loan_id INT NOT NULL,
    member_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE,
    status ENUM('pending', 'paid', 'waived') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES loans(loan_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE
);

-- Insert sample data

-- Insert library branches
INSERT INTO library_branches (branch_name, address, phone, email, opening_hours) VALUES
('Main Branch', '123 Library St, Booktown, BT 12345', '555-123-4567', 'main@library.org', 'Mon-Fri: 9am-8pm, Sat-Sun: 10am-5pm'),
('North Branch', '456 Reader Ave, Booktown, BT 12346', '555-123-4568', 'north@library.org', 'Mon-Fri: 10am-7pm, Sat: 10am-5pm, Sun: Closed'),
('South Branch', '789 Book Blvd, Booktown, BT 12347', '555-123-4569', 'south@library.org', 'Mon-Thu: 10am-6pm, Fri-Sat: 10am-5pm, Sun: Closed');

-- Insert members
INSERT INTO members (first_name, last_name, email, phone, address, date_of_birth, membership_date, membership_expiry, membership_status) VALUES
('John', 'Doe', 'john.doe@email.com', '555-111-2222', '123 Main St, Booktown', '1985-04-12', '2022-01-15', '2023-01-15', 'active'),
('Jane', 'Smith', 'jane.smith@email.com', '555-222-3333', '456 Oak Ave, Booktown', '1990-07-23', '2021-11-05', '2022-11-05', 'expired'),
('Michael', 'Johnson', 'michael.j@email.com', '555-333-4444', '789 Pine Rd, Booktown', '1978-09-03', '2022-03-20', '2023-03-20', 'active'),
('Emily', 'Williams', 'emily.w@email.com', '555-444-5555', '101 Cedar Ln, Booktown', '1995-12-15', '2022-02-10', '2023-02-10', 'active'),
('Robert', 'Brown', 'robert.b@email.com', '555-555-6666', '202 Maple Dr, Booktown', '1982-05-28', '2021-10-12', '2022-10-12', 'suspended');

-- Insert categories
INSERT INTO categories (category_name, description) VALUES
('Fiction', 'Fictional works of literature'),
('Non-Fiction', 'Factual and informative literature'),
('Science Fiction', 'Speculative fiction with scientific themes'),
('Mystery', 'Fiction dealing with solving a crime or mystery'),
('Biography', 'Account of a person''s life written by someone else'),
('History', 'Study of past events'),
('Self-Help', 'Books aimed at self-improvement'),
('Children''s', 'Books intended for children');

-- Insert authors
INSERT INTO authors (first_name, last_name, birth_date, biography) VALUES
('J.K.', 'Rowling', '1965-07-31', 'British author best known for the Harry Potter series'),
('George', 'Orwell', '1903-06-25', 'English novelist, essayist, and critic'),
('Jane', 'Austen', '1775-12-16', 'English novelist known for her six major novels'),
('Stephen', 'King', '1947-09-21', 'American author of horror, supernatural fiction, and suspense'),
('Agatha', 'Christie', '1890-09-15', 'English writer known for her detective novels');

-- Insert books
INSERT INTO books (isbn, title, publication_year, publisher, total_copies, available_copies, branch_id) VALUES
('9780747532743', 'Harry Potter and the Philosopher''s Stone', 1997, 'Bloomsbury', 10, 7, 1),
('9780451524935', '1984', 1949, 'Signet Classics', 8, 5, 1),
('9780141439518', 'Pride and Prejudice', 1813, 'Penguin Classics', 6, 3, 2),
('9781501182099', 'The Shining', 1977, 'Doubleday', 5, 2, 3),
('9780062073488', 'Murder on the Orient Express', 1934, 'Harper Collins', 7, 4, 2);

-- Insert book_authors relationships
INSERT INTO book_authors (book_id, author_id) VALUES
(1, 1), -- Harry Potter by J.K. Rowling
(2, 2), -- 1984 by George Orwell
(3, 3), -- Pride and Prejudice by Jane Austen
(4, 4), -- The Shining by Stephen King
(5, 5); -- Murder on the Orient Express by Agatha Christie

-- Insert book_categories relationships
INSERT INTO book_categories (book_id, category_id) VALUES
(1, 1), -- Harry Potter - Fiction
(1, 3), -- Harry Potter - Science Fiction
(2, 1), -- 1984 - Fiction
(2, 3), -- 1984 - Science Fiction
(3, 1), -- Pride and Prejudice - Fiction
(4, 1), -- The Shining - Fiction
(5, 1), -- Murder on the Orient Express - Fiction
(5, 4); -- Murder on the Orient Express - Mystery

-- Insert staff
INSERT INTO staff (first_name, last_name, email, phone, role, branch_id, hire_date) VALUES
('David', 'Miller', 'david.m@library.org', '555-777-8888', 'Head Librarian', 1, '2015-05-10'),
('Sarah', 'Johnson', 'sarah.j@library.org', '555-888-9999', 'Librarian', 2, '2018-02-15'),
('James', 'Wilson', 'james.w@library.org', '555-999-0000', 'Librarian Assistant', 1, '2020-09-03'),
('Lisa', 'Davis', 'lisa.d@library.org', '555-000-1111', 'Librarian', 3, '2019-07-22'),
('Mark', 'Taylor', 'mark.t@library.org', '555-111-2222', 'IT Specialist', 1, '2021-01-15');

-- Insert loans
INSERT INTO loans (book_id, member_id, staff_id, loan_date, due_date, return_date, status) VALUES
(1, 1, 1, '2022-05-01', '2022-05-15', '2022-05-12', 'returned'),
(2, 3, 1, '2022-05-03', '2022-05-17', NULL, 'borrowed'),
(3, 2, 2, '2022-04-20', '2022-05-04', '2022-05-08', 'returned'),
(4, 4, 4, '2022-05-10', '2022-05-24', NULL, 'borrowed'),
(5, 5, 2, '2022-04-25', '2022-05-09', NULL, 'overdue');

-- Insert reservations
INSERT INTO reservations (book_id, member_id, reservation_date, expiry_date, status) VALUES
(1, 3, '2022-05-15', '2022-05-22', 'pending'),
(2, 4, '2022-05-10', '2022-05-17', 'fulfilled'),
(3, 1, '2022-05-08', '2022-05-15', 'cancelled');

-- Insert fines
INSERT INTO fines (loan_id, member_id, amount, payment_date, status) VALUES
(3, 2, 2.50, '2022-05-09', 'paid'),
(5, 5, 5.00, NULL, 'pending');

-- Create indexes for performance optimization
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_members_name ON members(last_name, first_name);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_fines_status ON fines(status);