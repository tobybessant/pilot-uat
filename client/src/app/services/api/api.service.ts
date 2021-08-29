import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";
import { NbToastrService } from "@nebular/theme";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  public static readonly root: string = environment.apiRootUrl;

  constructor(private httpClient: HttpClient, private toastrService: NbToastrService) { }

  public async get<T>(endpoint: string): Promise<IApiResponse<T>> {
    let response = {
      errors: []
    } as IApiResponse<T>;

    try {
      response = await this.httpClient.get<IApiResponse<T>>(ApiService.root + endpoint, { withCredentials: true }).toPromise();
    } catch (ex) {
      if (ex.error?.errors) {
        response.errors.push(ex.error?.errors);
        response.errors.forEach(error => {
          this.toastrService.danger(error, "Error", {
            duration: 10000,
            icon: "close-square-outline",
          });
        });
        return response;
      }
    }
    return response;
  }

  public async post<T>(endpoint: string, body?: any): Promise<IApiResponse<T>> {
    let response = {
      errors: []
    } as IApiResponse<T>;

    try {
      response = await this.httpClient.post<IApiResponse<T>>(ApiService.root + endpoint, body, { withCredentials: true }).toPromise();
    } catch (ex) {
      if (ex.error?.errors) {
        response.errors.push(ex.error?.errors);
        response.errors.forEach(error => {
          console.log(response.statusCode);
          if (response.statusCode !== 401) {
            this.toastrService.danger(error, "Error", {
              duration: 10000,
              icon: "alert-circle-outline",
            });
          }
        });
        return response;
      }
    }
    return response;
  }

  public async delete<T>(endpoint: string): Promise<IApiResponse<T>> {
    let response = {
      errors: []
    } as IApiResponse<T>;

    try {
      response = await this.httpClient.delete<IApiResponse<T>>(ApiService.root + endpoint, { withCredentials: true }).toPromise();
    } catch (ex) {
      if (ex.error?.errors) {
        response.errors.push(ex.error?.errors);
        response.errors.forEach(error => {
          this.toastrService.danger(error, "Error", {
            duration: 10000,
            icon: "alert-circle-outline",
          });
        });
        return response;
      }
    }
    return response;
  }

  public async patch<T>(endpoint: string, payload: any): Promise<IApiResponse<T>> {
    let response = {
      errors: []
    } as IApiResponse<T>;

    try {
      response = await this.httpClient.patch<IApiResponse<T>>(ApiService.root + endpoint, payload, { withCredentials: true }).toPromise();
    } catch (ex) {
      if (ex.error?.errors) {
        response.errors.push(ex.error?.errors);
        response.errors.forEach(error => {
          this.toastrService.danger(error, "Error", {
            duration: 10000,
            icon: "alert-circle-outline",
          });
        });
        return response;
      }
    }
    return response;
  }

}
