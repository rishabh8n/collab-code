class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: [];
  data: any;
  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: [] = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export { ApiError };
