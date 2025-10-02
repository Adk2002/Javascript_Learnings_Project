class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.stack = stack;
        this.success = true;

        if (stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this.constructor);
        }
    }
}
export { ApiError };

/**
 * This is a custom error class that extends JavaScript's built-in Error class to provide structured error handling for your API.
Constructor Parameters:

statusCode: HTTP status code (e.g., 400, 404, 500)
message: Error message (defaults to "Something went wrong")
errors: Array of detailed error information (defaults to empty array)
stack: Custom stack trace (optional)

Working Principle:

Extends the native Error class to maintain error properties
Sets success: false to indicate API failure
Sets data: null since errors don't return data
Handles stack trace either from provided parameter or captures it automatically
Provides consistent error structure across your entire API

Use Case: When you need to throw specific errors with HTTP status codes in your controllers.
 */