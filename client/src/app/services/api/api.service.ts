import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private readonly root: string = "http://localhost:8080/api/v1";

  constructor(private httpClient: HttpClient) { }

  public async get<T>(endpoint: string): Promise<IApiResponse<T>> {
    let response = {
      errors: []
    } as IApiResponse<T>;

    try {
      response = await this.httpClient.get<IApiResponse<T>>(this.root + endpoint, { withCredentials: true }).toPromise();
    } catch (ex) {
      if (ex.error?.errors) {
        response.errors.push(ex.error?.errors);
        return response;
      }
      response.errors.push("Something went wrong...");
    }

    return response;
  }

  public async post<T>(endpoint: string, body: any): Promise<IApiResponse<T>> {
    let response = {
      errors: []
    } as IApiResponse<T>;

    try {
      response = await this.httpClient.post<IApiResponse<T>>(this.root + endpoint, body, { withCredentials: true }).toPromise();
    } catch (ex) {
      if (ex.error?.errors) {
        response.errors.push(ex.error?.errors);
        return response;
      }
      response.errors.push("Something went wrong...");
    }
    return response;
  }

  public async delete<T>(endpoint: string): Promise<IApiResponse<T>> {
    let response = {
      errors: []
    } as IApiResponse<T>;

    try {
      response = await this.httpClient.delete<IApiResponse<T>>(this.root + endpoint, { withCredentials: true }).toPromise();
    } catch (ex) {
      if (ex.error?.errors) {
        response.errors.push(ex.error?.errors);
        return response;
      }
      response.errors.push("Something went wrong...");
    }
    return response;
  }

  public async patch<T>(endpoint: string, payload: any): Promise<IApiResponse<T>> {
    let response = {
      errors: []
    } as IApiResponse<T>;

    try {
      response = await this.httpClient.patch<IApiResponse<T>>(this.root + endpoint, payload, { withCredentials: true }).toPromise();
    } catch (ex) {
      if (ex.error?.errors) {
        response.errors.push(ex.error?.errors);
        return response;
      }
      response.errors.push("Something went wrong...");
    }
    return response;
  }

}
