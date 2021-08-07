import Joi from "joi";

const categorySchema = Joi.object({
  name: Joi.string().required(),
  parent: Joi.string()
});

export default categorySchema;