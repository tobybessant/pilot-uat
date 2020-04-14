import * as jf from "joiful";
import { ICreateFeedbackRequest } from "../../../../dto/request/client/feedback.interface";

export class CreateFeedback implements ICreateFeedbackRequest {

  @jf.string()
    .label("Step ID")
    .required()
  stepId!: string;

  @jf.string()
    .label("status")
    .required()
  status!: string;

  @jf.string()
    .label("notes")
    .max(800)
    .required()
  notes!: string;

}
