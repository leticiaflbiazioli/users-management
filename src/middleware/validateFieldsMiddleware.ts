import { NextFunction, Request, RequestHandler, Response } from "express";
import userSchema from "../validations/userValidation";

export const validateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  next();
};
