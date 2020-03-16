import { Injectable } from "@angular/core";
import { ITestResponse } from "../models/response/supplier/test.interface";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ActiveTestCaseService {

  private subject = new Subject<ITestResponse>();
  private currentTestCase: ITestResponse;

  constructor() { }

  async setTestCase(test: ITestResponse) {
    this.currentTestCase = test;
    this.subject.next(test);
    console.log("selected case:" , test);
  }

  public getSubject(): Observable<ITestResponse> {
    return this.subject.asObservable();
  }

  public getCurrentTestCase() {
    return this.currentTestCase;
  }

}
