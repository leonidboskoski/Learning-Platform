const errorHandler = (err, req, res, next) => {
    // Determine the status code for the response.
    // If a status code was already set by a previous middleware/controller (e.g., res.status(409)), use it.
    // Otherwise, default to 500 (Internal Server Error) for truly unhandled/unexpected errors.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Set the response status code
    res.status(statusCode);

    let responseMessage = ''; // This will hold the translated message
    let responseCode = '';    // This will hold the i18n key or a generic code

    // --- Handle specific types of errors ---

    // 1. Mongoose Validation Errors (e.g., missing required fields, invalid email format)
    if (err.name === 'ValidationError') {
        responseCode = 'COMMON.VALIDATION_FAILED';
        responseMessage = req.__('COMMON.VALIDATION_FAILED');
        const errors = {};
        for (const field in err.errors) {
            if (err.errors.hasOwnProperty(field)) {
                errors[field] = req.__(err.errors[field].message); // Translate each specific field error
            }
        }
        return res.json({
            code: responseCode,
            message: responseMessage,
            errors: errors,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
    }

    // 2. MongoDB Duplicate Key Error (e.g., trying to register with an existing unique email)
    if (err.code === 11000) {
        res.status(409); // Conflict
        responseCode = 'COMMON.DUPLICATE_FIELD_MESSAGE';
        const field = Object.keys(err.keyValue)[0];
        responseMessage = req.__('COMMON.DUPLICATE_FIELD_MESSAGE', { field: field });
        return res.json({
            code: responseCode,
            message: responseMessage,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
    }

    // 3. Mongoose Bad ObjectId (e.g., GET /api/users/invalidId)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        res.status(400); // Bad Request
        responseCode = 'COMMON.INVALID_ID_FORMAT';
        responseMessage = req.__('COMMON.INVALID_ID_FORMAT');
    }
    // 4. Custom Errors Thrown by Controllers with i18n keys as messages
    // This is the crucial block for errors like 'USER.VALIDATION.EMAIL_EXISTS'
    else if (statusCode !== 500 && typeof err.message === 'string' && (err.message.includes('.') || err.message === err.message.toUpperCase())) {
        responseCode = err.message; // The error message itself is the i18n key
        responseMessage = req.__(err.message); // Translate the error message (which is the i18n key)
    }
    // 5. Generic Server Error (truly unexpected errors)
    else {
        responseCode = 'COMMON.SERVER_ERROR';
        responseMessage = req.__('COMMON.SERVER_ERROR');
    }

    // Send the final JSON response for all other errors
    res.json({
        code: responseCode,
        message: responseMessage, // Already translated
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler; // Export the middleware function
