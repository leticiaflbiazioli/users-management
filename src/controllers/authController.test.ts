import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";
import { login } from "./authController";

jest.mock("jsonwebtoken");

describe("login", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction>;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 400 if login is not provided", async () => {
    req.body = { password: "password" };

    await login(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Login e senha são obrigatórios",
    });
  });

  it("should return 400 if password is not provided", async () => {
    req.body = { login: "login" };

    await login(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Login e senha são obrigatórios",
    });
  });

  it("should return 400 if login or password is incorrect", async () => {
    req.body = { login: "wronglogin", password: "wrongpassword" };

    await login(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Login ou senha incorretos",
    });
  });

  it("should return a JWT token if the login and password are correct", async () => {
    req.body = { login: "login", password: "password" };

    (jwt.sign as jest.Mock).mockReturnValue("mocked_token");

    await login(req as Request, res as Response, next as NextFunction);

    expect(jwt.sign).toHaveBeenCalledWith({ login: "login" }, SECRET_KEY, {
      expiresIn: "1h",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ token: "mocked_token" });
  });

  it("should return 500 if there was an error generating the token", async () => {
    req.body = { login: "login", password: "password" };

    (jwt.sign as jest.Mock).mockImplementation(() => {
      throw new Error("Erro ao gerar token");
    });

    await login(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro no login" });
  });
});
