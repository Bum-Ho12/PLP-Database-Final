# Task Manager API

A complete Task Management System API built with Node.js, Express, and MySQL. This API allows users to create, read, update, and delete tasks, manage categories, and includes user authentication.

## Project Structure

```
task-manager-api/
├── config/
│   └── db.js                 # Database connection configuration
├── controllers/
│   ├── authController.js     # User authentication logic
│   ├── categoryController.js # Category CRUD operations
│   └── taskController.js     # Task CRUD operations
├── middleware/
│   └── auth.js               # Authentication middleware
├── models/
│   ├── User.js               # User model
│   ├── Category.js           # Category model
│   └── Task.js               # Task model
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── categories.js         # Category routes
│   └── tasks.js              # Task routes
├── sql/
│   └── task_manager.sql      # SQL script to create database & tables
├── .env                      # Environment variables (not committed to Git)
├── .gitignore                # Git ignore file
├── app.js                    # Express application setup
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

## Entity Relationship Diagram (ERD)

```
+----------------+       +----------------+       +----------------+
|     users      |       |     tasks      |       |   categories   |
+----------------+       +----------------+       +----------------+
| id (PK)        |       | id (PK)        |       | id (PK)        |
| username       |       | title          |       | name           |
| email          |       | description    |       | description    |
| password       |       | status         |       | user_id (FK)   |
| created_at     |------>| priority       |<------| created_at     |
| updated_at     |       | due_date       |       | updated_at     |
+----------------+       | user_id (FK)   |       +----------------+
                         | category_id (FK)|
                         | created_at     |
                         | updated_at     |
                         +----------------+
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/task-manager-api.git
   cd task-manager-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**

   Import the SQL script to create your database:
   ```bash
   mysql -u yourusername -p < sql/task_manager.sql
   ```

4. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=task_manager
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   ```

5. **initialize the DB**
```bash
npm run init-db
```

 or use

 ```bash
 npm run setup
 ```
 to initialize database and run the development server

6. **Start the server**
   ```bash
   npm start
   ```

   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get auth token
- `GET /api/auth/me` - check/confirm current user
- `PUT /api/auth/me` - Update current user
- `DELETE /api/auth/me` - Delete current user


### Categories
- `GET /api/categories` - Get all categories (for logged-in user)
- `GET /api/categories/:id` - Get a specific category
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Tasks
- `GET /api/tasks` - Get all tasks (for logged-in user)
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/category/:categoryId` - Get tasks by category
- `GET /api/tasks/statistics` - Get overall statics of tasks

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Password Hashing**: bcrypt
- **Database ORM**: Sequelize (optional)