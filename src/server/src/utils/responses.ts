/**
 * Class respresenting a HTTP success response.
 */
export class SuccessResponse {
  status: number = 200;
  message: string = "request successful";

  /**
   * Create a SuccessResponse instance
   * @param status The HTTP status code
   * @param message The success message
   */
  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

/**
 * Class respresenting a HTTP failure response.
 */
export class FailureResponse {
  status: number = 500;
  error: string = "request failed";

  /**
   * Create a FailureResponse instance
   * @param status The HTTP status code
   * @param error The error message
   */
  constructor(status: number, error: string) {
    this.status = status;
    this.error = error;
  }
}
