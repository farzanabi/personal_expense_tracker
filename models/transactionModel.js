const db = require('../db/database');

// Get all transactions (with pagination and user-specific filtering)
const getAllTransactions = (req, res) => {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const offset = parseInt(req.query.offset) || 0;

    const query = 'SELECT * FROM transactions WHERE user_id = ? LIMIT ? OFFSET ?';
    db.all(query, [userId, limit, offset], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ transactions: rows });
    });
};

// Get transaction by ID (ensure the user owns the transaction)
const getTransactionById = (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;

    const query = 'SELECT * FROM transactions WHERE id = ? AND user_id = ?';
    db.get(query, [id, userId], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        if (!row) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ transaction: row });
    });
};

// Add a new transaction (now with category_id)
const addTransaction = (req, res) => {
    const { category_id, type, amount, date, description } = req.body;
    const userId = req.user.id;

    if (!category_id || !type || !amount || !date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `INSERT INTO transactions 
                    (user_id, category_id, type, amount, date, description) 
                    VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(query, [userId, category_id, type, amount, date, description], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ transactionId: this.lastID });
    });
};
// Update a transaction (ensure the user owns the transaction)
const updateTransaction = (req, res) => {
    const { type, category, amount, date, description } = req.body;
    const userId = req.user.id;
    const id = req.params.id;

    const query = 'UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ? AND user_id = ?';
    db.run(query, [type, category, amount, date, description, id, userId], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ updatedID: id });
    });
};

// Delete a transaction (ensure the user owns the transaction)
const deleteTransaction = (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;

    const query = 'DELETE FROM transactions WHERE id = ? AND user_id = ?';
    db.run(query, [id, userId], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Transaction deleted', id });
    });
};

const getSummary = (req, res) => {
    const userId = req.user.id; // Authenticated user's ID
    const { category_id, start_date, end_date } = req.query; // Query params

    let query = `
        SELECT 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
            (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) AS balance
        FROM transactions
        WHERE user_id = ?
    `;
    const params = [userId]; // Store the user_id parameter

    // Apply category filter
    if (category_id) {
        query += ' AND category_id = ?';
        params.push(category_id); // Add category_id to the parameters
    }

    // Apply date filters if provided
    if (start_date) {
        query += ' AND date >= ?';
        params.push(start_date);
    }
    if (end_date) {
        query += ' AND date <= ?';
        params.push(end_date);
    }

    // Debugging logs
    console.log('Executing SQL Query:', query);
    console.log('With Parameters:', params);

    db.get(query, params, (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        console.log('Row result:', row); // Log the row result for debugging
        if (!row || (row.total_income === null && row.total_expense === null)) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // If null values are returned, convert them to 0
        row.total_income = row.total_income || 0;
        row.total_expense = row.total_expense || 0;
        row.balance = row.balance || 0;

        res.json(row); // Return the summary result
    });
};


module.exports = { getAllTransactions, getTransactionById, addTransaction, updateTransaction, deleteTransaction, getSummary };
