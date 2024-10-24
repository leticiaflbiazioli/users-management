import { NextFunction, Request, Response } from "express";
import { validateUser } from "./validateFieldsMiddleware";

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

  it("should call next if data is valid", () => {
    req.body = {
      name: "Ana",
      email: "ana@example.com",
      age: 25,
      active: true,
    };

    validateUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return error if name is shorter than 3 characters", () => {
    req.body = { name: "An", email: "ana@example.com" };

    validateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["O nome deve ter pelo menos 3 caracteres"],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return error if email is invalid", () => {
    req.body = { name: "Ana", email: "email_invalido" };

    validateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["Formato de e-mail inválido"],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return error if email is empty", () => {
    req.body = { name: "Ana", email: "" };

    validateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["O e-mail é obrigatório"],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return error if age is invalid", () => {
    req.body = { name: "Ana", email: "ana@example.com", age: "vinte" };

    validateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["A idade deve ser um número"],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
