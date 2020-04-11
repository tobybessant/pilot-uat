import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ActiveStepService {

  private stepSubject = new Subject<any>();
  private stepUpdatedSubject = new Subject<void>();
  private selectedStep: any;

  constructor() { }

  async setSelectedStep(step: any) {
    this.selectedStep = step;
    this.stepSubject.next(step);
  }

  public getStepSubject(): Observable<any> {
    return this.stepSubject.asObservable();
  }

  public getSelectedStep() {
    return this.selectedStep;
  }

  public stepDetailsUpdated() {
    this.stepUpdatedSubject.next();
  }

  public getStepUpdatedSubject() {
    return this.stepUpdatedSubject;
  }
}
