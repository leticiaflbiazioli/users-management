import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";

export const authMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).json({ error: "Token não fornecido" });
    console.error("User is trying to make a request without a token");
    return;
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.body.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
    console.error("User is using an invalid token.");
  }
};
