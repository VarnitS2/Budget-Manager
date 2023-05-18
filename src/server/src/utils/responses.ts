/**
 * Class respresenting a HTTP success response.
 */
export class SuccessResponse {
  statusCode: number = 200;
  message: string = "request successful";

  /**
   * Create a SuccessResponse instance
   * @param statusCode The HTTP status code
   * @param message The success message
   */
  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

/**
 * Class respresenting a HTTP failure response.
 */
export class FailureResponse {
  statusCode: number = 500;
  error: string = "request failed";

  /**
   * Create a FailureResponse instance
   * @param statusCode The HTTP status code
   * @param error The error message
   */
  constructor(statusCode: number, error: string) {
    this.statusCode = statusCode;
    this.error = error;
  }
}
