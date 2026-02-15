const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log for the developer
    console.error(err.stack);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        return res.status(404).json({ success: false, error: message });
    }

    // Mongoose duplicate key
    if (err.code === 121000) {
        const message = 'Duplicate field value entered';
        return res.status(400).json({ success: false, error: message });
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;