export class ApiError extends Error {
  public statusCode: number;
  public shouldRedirect: boolean;

  constructor(message: string, statusCode: number, shouldRedirect: boolean = false) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.shouldRedirect = shouldRedirect;
  }
}