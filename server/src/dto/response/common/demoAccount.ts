export interface IAccountCredentials {
  firstName: string;
  email: string;
  password: string;
}

export interface IDemoAccounts {
  supplier: IAccountCredentials;
  client: IAccountCredentials;
}