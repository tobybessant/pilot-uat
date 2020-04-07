export interface IApiResponse<T> {
  statusCode: number;
  errors: string[];
  payload: T | undefined;
}
