import { Injectable, Inject } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {

  constructor(@Inject("LOCAL_STORAGE") private localStorage: Storage) { }

  public get(key: string): any {
    return JSON.parse(this.localStorage.getItem(key));
  }

  public set(key: string, value: any) {
    this.localStorage.setItem(key, JSON.stringify(value));
  }
}
