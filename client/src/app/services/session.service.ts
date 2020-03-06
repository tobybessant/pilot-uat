import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { IUserResponse } from "../models/response/common/user.interface";
import { UserApiService } from "./api/user-api.service";

@Injectable({
  providedIn: "root"
})
export class SessionService {

  private subject = new Subject<IUserResponse>();
  private currentUser: IUserResponse;

  constructor(protected userService: UserApiService) { }

  async setUser() {
    const response = await this.userService.getLoggedInAccountDetails();
    this.currentUser = response.payload;
    this.subject.next(this.currentUser);
  }

  public getSubject(): Observable<IUserResponse> {
    return this.subject.asObservable();
  }

  public getCurrentUser() {
    return this.currentUser;
  }
}
