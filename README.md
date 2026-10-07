# Student Task Management System

A full-stack web application designed to help university students organize, manage, and track their academic tasks efficiently.

The system allows students to create tasks, set priorities and due dates, update task details, mark tasks as completed, delete tasks, search tasks, and filter tasks based on priority and status.

## Features

### Task Management

* Create new study tasks
* Edit existing tasks
* Update task details
* Mark tasks as completed
* Delete tasks
* View all saved tasks

### Task Information

Each task contains:

* Task title
* Description
* Category
* Priority
* Due date
* Status

### Search and Filters

* Search tasks by title
* Filter tasks by priority
* Filter tasks by status
* Display a message when no matching tasks are found

### Dashboard Statistics

The dashboard displays:

* Total Tasks
* Completed Tasks
* Pending Tasks

### Calendar

* Custom calendar for selecting due dates
* Navigate between months
* Select a specific year
* Highlight the current date
* Prevent selection of past dates

### User Experience

* Responsive design
* Clear form validation
* Loading message while tasks are being retrieved
* Error message when the backend cannot be reached
* Delete confirmation before removing a task
* Dynamic `Add Task` / `Update Task` button

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* HTML
* CSS

### Backend

* Node.js
* Express.js
* REST API
* CORS

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

### Development Tools

* Visual Studio Code
* Git
* GitHub
* MongoDB Compass

## System Architecture

```text
┌───────────────────────────────┐
│        React Frontend         │
│          Vite + CSS           │
└───────────────┬───────────────┘
                │
                │ HTTP Requests
                ▼
┌───────────────────────────────┐
│      Node.js + Express        │
│           REST API            │
└───────────────┬───────────────┘
                │
                │ Mongoose
                ▼
┌───────────────────────────────┐
│        MongoDB Atlas          │
│     Student Task Database     │
└───────────────────────────────┘
```

## Project Structure

```text
student-task-management-system/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── models/
│   │   └── Task.js
│   ├── .env
│   ├── .gitignore
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

## REST API Endpoints

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| GET    | `/`              | Check whether the backend is running |
| GET    | `/api/tasks`     | Retrieve all tasks                   |
| POST   | `/api/tasks`     | Create a new task                    |
| PUT    | `/api/tasks/:id` | Update an existing task              |
| DELETE | `/api/tasks/:id` | Delete a task                        |

The `PUT` endpoint is used for both editing task information and marking a task as completed.

## Task Data Model

A task contains the following fields:

```text
title
description
category
priority
dueDate
status
createdAt
updatedAt
```

Supported values:

```text
Category:
- Assignment
- Exam
- Practical
- Other

Priority:
- Low
- Medium
- High

Status:
- Pending
- Completed
```

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB Atlas account
* Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Anuththara20/student-task-management-system.git
```

### 2. Navigate to the Project

```bash
cd student-task-management-system
```

## Backend Setup

Open a terminal and navigate to the backend:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Replace `your_mongodb_connection_string` with your own MongoDB Atlas connection string.

Start the backend:

```bash
node server.js
```

The backend should run on:

```text
http://localhost:5000
```

## Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend should run on a local URL such as:

```text
http://localhost:5173
```

Open the URL in your browser.

## Environment Variables

The MongoDB connection string is stored in an environment variable and should never be committed to GitHub.

Example:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

The backend `.gitignore` file should contain:

```text
.env
```

This prevents sensitive database credentials from being uploaded to the repository.

## Screenshots

Screenshots of the application can be added here to demonstrate the user interface.

### Dashboard

```text
Add your dashboard screenshot here
```

### Add Task

```text
Add your Add Task form screenshot here
```

### Task Management

```text
Add your task list screenshot here
```

## Testing the Application

The following functionality has been implemented and tested:

```text
✓ Add Task
✓ View Tasks
✓ Edit Task
✓ Update Task
✓ Mark Task as Completed
✓ Delete Task
✓ Search Tasks
✓ Filter by Priority
✓ Filter by Status
✓ Due Date Selection
✓ Calendar Navigation
✓ MongoDB Data Storage
✓ MongoDB Data Retrieval
```

## Future Improvements

Possible future enhancements include:

* User authentication
* Student profiles
* Task categories with custom labels
* Task sorting
* Reminder notifications
* Monthly task summaries
* Dark mode
* Cloud deployment
* Improved accessibility

## Learning Outcomes

This project provides practical experience with:

* React component development
* React state management
* REST API development
* Express.js backend development
* MongoDB database integration
* CRUD operations
* API communication using `fetch()`
* Environment variables
* Git and GitHub
* Responsive UI design
* Full-stack application architecture

## Project Status

**Status: Completed — Core Features Implemented**

The application currently provides a complete student task management workflow using a React frontend, Node.js/Express backend, and MongoDB Atlas database.

## Author

**Anuththara Wickramasinghe**

Information Technology Undergraduate
Sri Lanka Institute of Information Technology (SLIIT)

GitHub:
https://github.com/Anuththara20

## License

This project was created for educational and portfolio purposes.
