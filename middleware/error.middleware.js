import { ApiError } from "../utils/apiError.js";

export const errorHandler = (err, req, res, next) => {
    let error = { ...err }

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Something Went wrong';
        error = new ApiError(statusCode, message, error.errors || [], error.stack);
    }

    // Multer specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        error = new ApiError(400, "File size too large. Maximum 5MB allowed");
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        error = new ApiError(400, "Too many files uploaded");
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        error = new ApiError(400, "Unexpected field in form data");
    }

    const response = {
        success: error.success,
        message: error.message,
        errors: error.errors,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }

    res.status(error.statusCode || 500).json(response);
}