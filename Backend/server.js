const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Your MongoDB connection logic [cite: 22]
const errorHandler = require('./Middleware/errorMiddleware'); //[cite: 26]
const politicianRoutes = require('./Routes/promiseRoutes'); // Your API routes

// Load env vars
dotenv.config();

// Connect to Database
connectDB(); // [cite: 104]

const app = express();

// Body parser
app.use(express.json());

// Enable CORS [cite: 33]
app.use(cors());

app.use('/api/politicians', politicianRoutes);

// Mount routers
app.use('/api/promises', require('./Routes/promiseRoutes'));

// Error handler middleware - must be after routes [cite: 26, 29]
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});