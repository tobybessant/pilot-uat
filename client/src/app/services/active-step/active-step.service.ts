import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ActiveStepService {

  private subject = new Subject<any>();
  private selectedStep: any;

  constructor() { }

  async setSelectedStep(step: any) {
    this.selectedStep = step;
    this.subject.next(step);
  }

  public getSubject(): Observable<any> {
    return this.subject.asObservable();
  }

  public getSelectedStep() {
    return this.selectedStep;
  }
}
