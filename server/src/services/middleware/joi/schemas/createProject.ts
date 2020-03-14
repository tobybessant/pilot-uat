import * as joi from "joi";

export const CreateProjectSchema = joi.object({
  projectName: joi
    .string()
    .label("Project Name")
    .max(30)
    .required(),
});