import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";
import { authMiddleware } from "./authMiddleware";

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 401 if token is not provided", async () => {
    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token não fornecido" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Token inválido");
    });

    req.headers = {
      authorization: "Bearer invalidtoken",
    };

    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token inválido" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if token is valid", async () => {
    const mockDecoded = { login: "login" };
    (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

    req.headers = {
      authorization: "Bearer validtoken",
    };

    await authMiddleware(req as Request, res as Response, next);

    expect(jwt.verify).toHaveBeenCalledWith("validtoken", SECRET_KEY);
    expect(req.body.user).toEqual(mockDecoded);
    expect(next).toHaveBeenCalled();
  });
});
