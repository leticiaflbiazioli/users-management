import { NextFunction, Request, Response } from "express";
import { validateFieldsMiddleware } from "./validateFieldsMiddleware";

describe("validateFieldsMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

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

  it("should return 400 if name is not provided", async () => {
    req.body = { email: "test@example.com" };

    await validateFieldsMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "O nome deve ter pelo menos 3 caracteres",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if name is less than 3 characters", async () => {
    req.body = { name: "Jo", email: "test@example.com" };

    await validateFieldsMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "O nome deve ter pelo menos 3 caracteres",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if email is not provided", async () => {
    req.body = { name: "Ana" };

    await validateFieldsMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "O email é obrigatório" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if email is invalid", async () => {
    req.body = { name: "Ana", email: "invalidemail" };

    await validateFieldsMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Email inválido" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if name and email are valid", async () => {
    req.body = { name: "Ana", email: "ana@example.com" };

    await validateFieldsMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 500 if there is an unexpected error", async () => {
    req = null as unknown as Request;

    await validateFieldsMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao validar dados" });
    expect(next).not.toHaveBeenCalled();
  });
});
