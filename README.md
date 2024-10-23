
### Simple README.md

# Personal Expense Tracker API

## Overview

The **Personal Expense Tracker API** is a Node.js and Express.js application that allows users to manage personal financial records such as income, expenses, and categories. The app uses SQLite for data storage and JWT for user authentication.

## Features

- User registration and login
- Add, view, and manage categories (e.g., salary, groceries)
- Add, view, and manage transactions (income and expenses)
- Get a summary of total income, expenses, and balance
- Filter summary by date range or category

## Installation

### 1. Clone the Repository


git clone https://github.com/your-username/personal-expense-tracker.git
cd personal-expense-tracker

### 2. Install Dependencies


npm install


### 3. Start the Application


node app.js


The server will run at `http://localhost:3000`.

## API Endpoints

### Authentication

- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Login and receive a JWT token.

### Categories

- **POST /categories**: Add a new category (income/expense).
- **GET /categories**: Get all categories.

### Transactions

- **POST /transactions**: Add a new transaction.
- **GET /transactions**: Get all transactions (with pagination).
- **GET /transactions/summary**: Get a summary of total income, expenses, and balance. Supports filtering by category or date range.

## Example Requests

### 1. Register a New User


POST /auth/register
Body:
{
    "username": "john_doe",
    "password": "yourpassword"
}


### 2. Login a User


POST /auth/login
Body:
{
    "username": "john_doe",
    "password": "yourpassword"
}


- **Response**: `{ "token": "your-jwt-token" }`

### 3. Add a Transaction


POST /transactions
Headers:
  Authorization: Bearer <your-jwt-token>
Body:
{
    "category_id": 1,
    "type": "income",
    "amount": 5000,
    "date": "2023-10-23",
    "description": "October Salary"
}


### 4. Get Transaction Summary


GET /transactions/summary?category_id=1&start_date=2023-10-01&end_date=2023-10-31
Headers:
  Authorization: Bearer <your-jwt-token>


## License

This project is open-source and available under the MIT License.
