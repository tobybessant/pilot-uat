export interface ICreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  type: string;
  organisationName?: string;
}