import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private readonly root: string = "http://localhost:8080";

  constructor(private httpClient: HttpClient) { }

  public async get<T>(endpoint: string): Promise<T> {
    return await this.httpClient.get<T>(this.root + endpoint).toPromise();
  }

  public async post<T>(path: string, body: any): Promise<T> {
    return await this.httpClient.post<T>(this.root + path, body).toPromise();
  }

}
