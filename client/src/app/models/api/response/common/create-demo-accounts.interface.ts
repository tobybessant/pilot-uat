interface IDemoAccountCredentials {
  firstName: string;
  email: string;
  password: string;
}

export interface ICreateDemoAccountsResponse {
  client: IDemoAccountCredentials;
  supplier: IDemoAccountCredentials;
}
