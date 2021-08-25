export interface IAccountCredentials {
  email: string;
  password: string;
}

export interface IDemoAccounts {
  supplier: IAccountCredentials;
  client: IAccountCredentials;
}