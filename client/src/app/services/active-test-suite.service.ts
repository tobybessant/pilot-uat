import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { ISuiteResponse } from "../models/api/response/supplier/suite.interface";

@Injectable({
  providedIn: "root"
})
export class ActiveTestSuiteService {

  private subject = new Subject<ISuiteResponse>();
  private currentSuite: ISuiteResponse;

  constructor() { }

  async setSuite(suite: ISuiteResponse) {
    this.currentSuite = suite;
    this.subject.next(suite);
  }

  public getSubject(): Observable<ISuiteResponse> {
    return this.subject.asObservable();
  }

  public getCurrentSuite() {
    return this.currentSuite;
  }
}
