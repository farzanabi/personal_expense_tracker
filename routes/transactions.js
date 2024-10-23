const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const { getAllTransactions, getTransactionById, addTransaction, updateTransaction, deleteTransaction, getSummary } = require('../models/transactionModel');

// Add a new transaction (requires authentication)
router.post('/', authenticateToken, addTransaction);

// Get all transactions (with pagination, requires authentication)
router.get('/', authenticateToken, getAllTransactions);

// Get a single transaction by ID (requires authentication)
router.get('/:id', authenticateToken, getTransactionById);

// Update a transaction by ID (requires authentication)
router.put('/:id', authenticateToken, updateTransaction);

// Delete a transaction by ID (requires authentication)
router.delete('/:id', authenticateToken, deleteTransaction);

// Get summary of transactions (requires authentication)
router.get('/summary', authenticateToken, getSummary);

module.exports = router;
