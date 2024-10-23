const express = require('express');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transactions');
const authRoutes = require('./routes/auth').router;
const categoryRoutes = require('./routes/categories');  
const app = express();
app.use(bodyParser.json());

// Authentication routes
app.use('/auth', authRoutes);

// Transaction routes (protected by authentication)
app.use('/transactions', transactionRoutes);

// Categories routes
app.use('/categories', categoryRoutes);  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
