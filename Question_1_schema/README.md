# 📚 Library Management System Database

A comprehensive and normalized relational database schema to support operations of a public library system, including member management, book inventory, loans, reservations, fines, and staff oversight.

---

## 🏗️ Database Overview

* **Database Name:** `library_management`
* **Entities:**

  * `members`
  * `books`
  * `authors`
  * `book_authors`
  * `categories`
  * `book_categories`
  * `loans`
  * `reservations`
  * `library_branches`
  * `staff`
  * `fines`

---

## 📁 Tables and Schemas

### 1. `library_branches`

Stores information about physical library branches.

| Field          | Type         | Description                      |
| -------------- | ------------ | -------------------------------- |
| branch\_id     | INT (PK)     | Unique identifier for the branch |
| branch\_name   | VARCHAR(100) | Name of the library branch       |
| address        | VARCHAR(255) | Address of the branch            |
| phone          | VARCHAR(20)  | Contact phone number             |
| email          | VARCHAR(100) | Contact email                    |
| opening\_hours | VARCHAR(255) | Branch operating hours           |
| created\_at    | TIMESTAMP    | Record creation time             |
| updated\_at    | TIMESTAMP    | Record last update time          |

### 2. `members`

Details of registered library patrons.

| Field              | Type         | Description                              |
| ------------------ | ------------ | ---------------------------------------- |
| member\_id         | INT (PK)     | Unique ID of the member                  |
| first\_name        | VARCHAR(50)  | First name                               |
| last\_name         | VARCHAR(50)  | Last name                                |
| email              | VARCHAR(100) | Unique email address                     |
| phone              | VARCHAR(20)  | Contact number                           |
| address            | VARCHAR(255) | Member's address                         |
| date\_of\_birth    | DATE         | Date of birth                            |
| membership\_date   | DATE         | When membership was granted              |
| membership\_expiry | DATE         | Membership expiry date                   |
| membership\_status | ENUM         | Status: 'active', 'expired', 'suspended' |
| created\_at        | TIMESTAMP    | Record creation time                     |
| updated\_at        | TIMESTAMP    | Record last update time                  |

### 3. `categories`

Book genres or categories.

| Field          | Type        | Description                 |
| -------------- | ----------- | --------------------------- |
| category\_id   | INT (PK)    | Unique category ID          |
| category\_name | VARCHAR(50) | Name of the category        |
| description    | TEXT        | Description of the category |
| created\_at    | TIMESTAMP   | Record creation time        |
| updated\_at    | TIMESTAMP   | Record last update time     |

### 4. `authors`

Information about authors.

| Field       | Type        | Description                   |
| ----------- | ----------- | ----------------------------- |
| author\_id  | INT (PK)    | Unique author ID              |
| first\_name | VARCHAR(50) | First name                    |
| last\_name  | VARCHAR(50) | Last name                     |
| birth\_date | DATE        | Date of birth                 |
| death\_date | DATE        | Date of death (if applicable) |
| biography   | TEXT        | Short biography               |
| created\_at | TIMESTAMP   | Record creation time          |
| updated\_at | TIMESTAMP   | Record last update time       |

### 5. `books`

Detailed records of books in the system.

| Field             | Type         | Description                          |
| ----------------- | ------------ | ------------------------------------ |
| book\_id          | INT (PK)     | Unique book ID                       |
| isbn              | VARCHAR(20)  | Unique ISBN                          |
| title             | VARCHAR(255) | Book title                           |
| publication\_year | YEAR         | Year of publication                  |
| publisher         | VARCHAR(100) | Publisher                            |
| total\_copies     | INT          | Total number of copies               |
| available\_copies | INT          | Number of copies currently available |
| branch\_id        | INT (FK)     | Library branch location              |
| created\_at       | TIMESTAMP    | Record creation time                 |
| updated\_at       | TIMESTAMP    | Record last update time              |

### 6. `book_authors`

Many-to-many relationship between books and authors.

| Field      | Type     | Description            |
| ---------- | -------- | ---------------------- |
| book\_id   | INT (FK) | Reference to `books`   |
| author\_id | INT (FK) | Reference to `authors` |

### 7. `book_categories`

Many-to-many relationship between books and categories.

| Field        | Type     | Description               |
| ------------ | -------- | ------------------------- |
| book\_id     | INT (FK) | Reference to `books`      |
| category\_id | INT (FK) | Reference to `categories` |

### 8. `staff`

Employee details.

| Field       | Type         | Description             |
| ----------- | ------------ | ----------------------- |
| staff\_id   | INT (PK)     | Unique ID               |
| first\_name | VARCHAR(50)  | First name              |
| last\_name  | VARCHAR(50)  | Last name               |
| email       | VARCHAR(100) | Unique email            |
| phone       | VARCHAR(20)  | Phone number            |
| role        | VARCHAR(50)  | Job title               |
| branch\_id  | INT (FK)     | Assigned branch         |
| hire\_date  | DATE         | Date of hire            |
| created\_at | TIMESTAMP    | Record creation time    |
| updated\_at | TIMESTAMP    | Record last update time |

### 9. `loans`

Track book loans.

| Field        | Type      | Description                       |
| ------------ | --------- | --------------------------------- |
| loan\_id     | INT (PK)  | Unique loan ID                    |
| book\_id     | INT (FK)  | Book being borrowed               |
| member\_id   | INT (FK)  | Member borrowing the book         |
| staff\_id    | INT (FK)  | Staff handling the loan           |
| loan\_date   | DATE      | Date borrowed                     |
| due\_date    | DATE      | Due date for return               |
| return\_date | DATE      | Date book was returned (if any)   |
| status       | ENUM      | 'borrowed', 'returned', 'overdue' |
| created\_at  | TIMESTAMP | Record creation time              |
| updated\_at  | TIMESTAMP | Record last update time           |

### 10. `reservations`

Manage book reservations.

| Field             | Type      | Description                                    |
| ----------------- | --------- | ---------------------------------------------- |
| reservation\_id   | INT (PK)  | Unique reservation ID                          |
| book\_id          | INT (FK)  | Book reserved                                  |
| member\_id        | INT (FK)  | Member reserving                               |
| reservation\_date | DATE      | Date of reservation                            |
| expiry\_date      | DATE      | Expiry date for the reservation                |
| status            | ENUM      | 'pending', 'fulfilled', 'cancelled', 'expired' |
| created\_at       | TIMESTAMP | Record creation time                           |
| updated\_at       | TIMESTAMP | Record last update time                        |

### 11. `fines`

Track overdue fees and payments.

| Field         | Type          | Description                     |
| ------------- | ------------- | ------------------------------- |
| fine\_id      | INT (PK)      | Unique fine ID                  |
| loan\_id      | INT (FK)      | Related loan                    |
| member\_id    | INT (FK)      | Member fined                    |
| amount        | DECIMAL(10,2) | Fine amount                     |
| payment\_date | DATE          | When the fine was paid (if any) |
| status        | ENUM          | 'pending', 'paid', 'waived'     |
| created\_at   | TIMESTAMP     | Record creation time            |
| updated\_at   | TIMESTAMP     | Record last update time         |

---

## 🔄 Relationships

* **Many-to-Many:**

  * `book_authors`: books ↔ authors
  * `book_categories`: books ↔ categories

* **One-to-Many:**

  * `books` → `library_branches`
  * `staff` → `library_branches`
  * `loans` → `members`, `books`, `staff`
  * `reservations` → `members`, `books`
  * `fines` → `loans`, `members`

---

## 🧪 Sample Data

Sample data is included in the SQL script for:

* Branches: Main, North, and South
* Members: 5 sample members
* Categories: 8 categories
* Authors: 5 renowned authors
* Books: 5 sample books with defined relationships

---

## 📥 How to Use

1. Run the script in your MySQL or MariaDB environment.
2. Use a GUI like MySQL Workbench or CLI to explore the schema.
3. Extend the schema or insert more data as needed.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use, modify, and distribute.

---

## 👩‍💻 Contributing

Feel free to fork, open issues, or suggest improvements via pull requests.

---

