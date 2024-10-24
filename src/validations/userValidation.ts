import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.min": "O nome deve ter pelo menos 3 caracteres",
    "string.empty": "O nome é obrigatório",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Formato de e-mail inválido",
    "string.empty": "O e-mail é obrigatório",
  }),
  age: Joi.number().integer().min(0).optional().messages({
    "number.base": "A idade deve ser um número",
  }),
  active: Joi.boolean().optional(),
});

export default userSchema;
