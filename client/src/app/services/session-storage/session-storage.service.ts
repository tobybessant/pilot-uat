import { Injectable, Inject } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SessionStorageService {

  constructor(@Inject("SESSION_STORAGE") private sessionStorage: Storage) { }

  public get(key: string): any {
    const value = this.sessionStorage.getItem(key);
    return JSON.parse(value);
  }

  public set(key: string, value: any) {
    try {
      value = JSON.stringify(value);
    } catch {
      value = {};
    } finally {
      this.sessionStorage.setItem(key, value);
    }
  }
}
