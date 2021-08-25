export interface ICreateAccountRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organisationName: string;
  type: "Supplier" | "Client";
}
