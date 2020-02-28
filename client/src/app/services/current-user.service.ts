import { Injectable } from "@angular/core";
import { IUserResponse } from "../models/response/common/user.interface";

@Injectable({
  providedIn: "root"
})
export class CurrentUserService {

  private currentUser: IUserResponse;

  constructor() { }

  public setUser() {

  }

  public getUser() {

  }
}
