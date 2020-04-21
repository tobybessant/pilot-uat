import { Injectable, Inject } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {

  constructor(@Inject("LOCAL_STORAGE") private localStorage: Storage) { }

  public get(key: string): any {
    const value = this.localStorage.getItem(key);
    return JSON.parse(value);
  }

  public set(key: string, value: any) {
    try {
      value = JSON.stringify(value);
    } catch {
      value = {};
      console.log(value);
    } finally {
      this.localStorage.setItem(key, value);
    }
  }
}
