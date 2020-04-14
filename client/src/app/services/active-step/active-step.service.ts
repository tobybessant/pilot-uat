import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { IStepResponse } from "src/app/models/api/response/client/step.interface";

@Injectable({
  providedIn: "root"
})
export class ActiveStepService {

  private stepSubject = new Subject<any>();
  private stepUpdatedSubject = new Subject<void>();
  private selectedStep: IStepResponse;

  constructor() { }

  async setSelectedStep(step: IStepResponse) {
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
