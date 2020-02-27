import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IApiResponse } from "src/app/models/response/api-response.interface";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private readonly root: string = "http://localhost:8080";

  constructor(private httpClient: HttpClient) { }

  public async get<T>(endpoint: string): Promise<T> {
    return await this.httpClient.get<T>(this.root + endpoint).toPromise();
  }

  public async post<T>(path: string, body: any): Promise<IApiResponse<T>> {
    const response = {
      errors: []
    } as IApiResponse<T>;

    try {
      response.payload = await this.httpClient.post<T>(this.root + path, body).toPromise();
    } catch (ex) {
      if (ex.error?.errors) {
        response.errors.push(ex.error?.errors);
        return;
      }
      response.errors.push("Something went wrong...");
    }

    return response;
  }

}
