import { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";

export const login: RequestHandler = async (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (!login || !password) {
    res.status(400).json({ error: "Login e senha são obrigatórios" });
    return;
  }

  //   Em um cenário real, essa validação seria buscando no banco de dados
  if (login !== "login" || password !== password) {
    res.status(400).json({ error: "Login ou senha incorretos" });
    console.error("User is using incorrect login or password");
    return;
  }

  try {
    const token = jwt.sign({ login }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } catch (error: any) {
    res.status(500).json({ error: "Erro no login" });
    console.error(
      `An error occurred while attempting to login. Error: ${error}`
    );
  }
};
