export interface IApiResponse<T> {
  errors: string[];
  payload: T | undefined;
}
