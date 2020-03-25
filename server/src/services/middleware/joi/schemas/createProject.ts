import * as jf from "joiful";
import { ICreateProjectRequest } from "../../../../dto/request/supplier/createProject";

export class CreateProject implements ICreateProjectRequest {

  @jf.string()
    .label("Project Title")
    .max(30)
    .required()
  title!: string;

}