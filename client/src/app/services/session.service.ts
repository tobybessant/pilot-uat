import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { IUserResponse } from "../models/response/common/user.interface";
import { UserApiService } from "./api/user-api.service";

@Injectable({
  providedIn: "root"
})
export class SessionService {

  private currentUserSubject: BehaviorSubject<IUserResponse>;
  public currentUser: Observable<IUserResponse>;

  constructor(protected userService: UserApiService) { }

  public async setLoggedInUserFromSession() {
    const response = await this.userService.getLoggedInAccountDetails();
    this.currentUserSubject = new BehaviorSubject<IUserResponse>(response.payload);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public getLoggedInUser(): IUserResponse | undefined {
    return this.currentUserSubject?.value;
  }
}
