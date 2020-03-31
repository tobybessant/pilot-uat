import * as jf from "joiful";
import { IUpdateCaseRequest } from "../../../../dto/request/supplier/updateCase";


export class UpdateCase implements IUpdateCaseRequest {

  @jf.string()
    .label("Case Title")
    .not(null)
    .not("")
    .optional()
  title?: string;

  @jf.string()
    .label("Case ID")
    .optional()
  id?: string;

}