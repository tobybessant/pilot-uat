import * as joi from "joi";

export const CreateProjectSchema = joi.object({
  title: joi
    .string()
    .label("Project Name")
    .max(30)
    .required(),
});