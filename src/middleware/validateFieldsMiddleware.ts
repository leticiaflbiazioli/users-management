import { NextFunction, Request, RequestHandler, Response } from "express";

export const validateFieldsMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email } = req.body;

    if (!name || name.length < 3) {
      res
        .status(400)
        .json({ error: "O nome deve ter pelo menos 3 caracteres" });
      console.error(
        "User is trying to use name field with less than 3 characters"
      );
      return;
    }
    if (!email) {
      res.status(400).json({ error: "O email é obrigatório" });
      console.error("User is not submitting email field.");
      return;
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      res.status(400).json({ error: "Email inválido" });
      console.error(
        `The user is not using a valid email. The email they are trying to use is: ${req.body.email}`
      );
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Erro ao validar dados" });
    console.error(`Error validating data. Error: ${error}`);
  }
};
