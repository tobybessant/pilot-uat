import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {

  constructor() { }

  public get(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }

  public set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
