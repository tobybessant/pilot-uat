export class ApiError extends Error {
  public statusCode: number;
  public redirectToErrorPage: boolean;

  constructor(message: string, statusCode: number, redirectToErrorPage: boolean = false) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.redirectToErrorPage = redirectToErrorPage;
  }
}