class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };

/**
 * A utility class to create consistent success responses across your API.
Constructor Parameters:

statusCode: HTTP status code for successful operations (200, 201, etc.)
data: The actual response data
message: Success message (defaults to "Success")

Working Principle:

Automatically determines success based on status code (< 400 = success)
Provides uniform response structure for all successful API calls
Ensures consistency in how your API responds to clients

Use Case: When sending successful responses from your controllers to maintain consistent API response format.
 */