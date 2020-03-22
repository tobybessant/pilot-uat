import { Injectable } from "@angular/core";
import { ICaseResponse } from "../../models/api/response/supplier/test.interface";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ActiveTestCaseService {

  private subject = new Subject<ICaseResponse>();
  private currentTestCase: ICaseResponse;

  constructor() { }

  async setTestCase(test: ICaseResponse) {
    this.currentTestCase = test;
    this.subject.next(test);
  }

  public getSubject(): Observable<ICaseResponse> {
    return this.subject.asObservable();
  }

  public getCurrentTestCase() {
    return this.currentTestCase;
  }

}
