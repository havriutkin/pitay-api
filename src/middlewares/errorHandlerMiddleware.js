const errorHandler = async (err, req, res, next) => {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Server error occurred.';
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
}

module.exports = errorHandler;