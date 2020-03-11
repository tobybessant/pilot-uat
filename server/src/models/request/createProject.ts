import * as joi from "joi";

export const ICreateProjectRequest = joi.object({
  projectName: joi
    .string()
    .label("Project Name")
    .max(30)
    .required(),
});