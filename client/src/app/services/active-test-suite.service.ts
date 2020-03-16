import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { ITestSuiteResponse } from "../models/response/supplier/suite.interface";

@Injectable({
  providedIn: "root"
})
export class ActiveTestSuiteService {

  private subject = new Subject<ITestSuiteResponse>();
  private currentSuite: ITestSuiteResponse;

  constructor() { }

  async setSuite(suite: ITestSuiteResponse) {
    this.currentSuite = suite;
    this.subject.next(suite);
  }

  public getSubject(): Observable<ITestSuiteResponse> {
    return this.subject.asObservable();
  }

  public getCurrentSuite() {
    return this.currentSuite;
  }
}
