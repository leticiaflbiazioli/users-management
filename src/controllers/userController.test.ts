import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/userController";
import User from "../models/User";

jest.mock("../models/User");

describe("User Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction>;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe("createUser", () => {
    it("must create a new user with valid data", async () => {
      req.body = {
        name: "Ana",
        email: "ana@example.com",
        age: 30,
        active: true,
      };
      (User.create as jest.Mock).mockResolvedValue(req.body);

      await createUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it("should return error 400 if email is not unique", async () => {
      req.body = { name: "Ana Maria", email: "ana@example.com" };
      (User.create as jest.Mock).mockRejectedValue({
        name: "SequelizeUniqueConstraintError",
      });

      await createUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "O e-mail deve ser único.",
      });
    });

    it("should return error 500 in case of generic error", async () => {
      req.body = { name: "Ana", email: "ana@example.com" };
      (User.create as jest.Mock).mockRejectedValue(
        new Error("Erro inesperado")
      );

      await createUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: new Error("Erro inesperado"),
      });
    });
  });

  describe("getUsers", () => {
    it("should return a list of filtered users", async () => {
      const users = [
        { id: 1, name: "Ana", age: 25 },
        { id: 2, name: "João", age: 30 },
      ];
      (User.findAll as jest.Mock).mockResolvedValue(users);

      req.query = { name: "Ana", ageMin: "20", ageMax: "30" };

      await getUsers(req as Request, res as Response, next as NextFunction);

      expect(User.findAll).toHaveBeenCalledWith({
        where: {
          name: { [Op.like]: "%Ana%" },
          age: { [Op.gte]: 20, [Op.lte]: 30 },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it("should return error 500 in case of search error", async () => {
      (User.findAll as jest.Mock).mockRejectedValue(
        new Error("Erro ao buscar usuários")
      );

      await getUsers(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao buscar usuários",
      });
    });
  });

  describe("getUser", () => {
    it("should return a specific user if it exists", async () => {
      req.params!.id = "1";
      const mockUser = { id: 1, name: "Ana", email: "ana@example.com" };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await getUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 error if user is not found", async () => {
      req.params!.id = "2";
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await getUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Usuário não encontrado",
      });
    });

    it("should return error 500 in case of search error", async () => {
      req.params!.id = "1";
      (User.findByPk as jest.Mock).mockRejectedValue(
        new Error("Erro ao buscar usuário")
      );

      await getUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao buscar usuário",
      });
    });
  });

  describe("updateUser", () => {
    it("must update the data of an existing user", async () => {
      req.params!.id = "1";
      req.body = { name: "Ana Updated" };
      const mockUser = {
        id: 1,
        name: "Ana",
        email: "ana@example.com",
        save: jest.fn(),
      };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await updateUser(req as Request, res as Response, next as NextFunction);

      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 error if user is not found", async () => {
      req.params!.id = "2";
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await updateUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Usuário não encontrado",
      });
    });

    it("should return error 400 if email is not unique", async () => {
      req.params!.id = "1";
      req.body = { email: "email@exemplo.com" };
      const mockUser = {
        id: 1,
        name: "Ana",
        email: "ana@example.com",
        save: jest.fn(),
      };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      mockUser.email = "newemail@exemplo.com";
      (mockUser.save as jest.Mock).mockRejectedValue({
        name: "SequelizeUniqueConstraintError",
      });

      await updateUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "O e-mail deve ser único.",
      });
    });

    it("should return error 500 in case of generic error", async () => {
      req.params!.id = "1";
      req.body = { name: "Ana Updated" };
      const mockUser = {
        id: 1,
        name: "Ana",
        email: "ana@example.com",
        save: jest.fn(),
      };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (mockUser.save as jest.Mock).mockRejectedValue(
        new Error("Erro inesperado")
      );

      await updateUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao atualizar usuário",
      });
    });
  });

  describe("deleteUser", () => {
    it("must delete an existing user", async () => {
      req.params!.id = "1";
      const mockUser = {
        id: 1,
        name: "Ana",
        email: "ana@example.com",
        destroy: jest.fn(),
      };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await deleteUser(req as Request, res as Response, next as NextFunction);

      expect(mockUser.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should return 404 error if user is not found", async () => {
      req.params!.id = "2";
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await deleteUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Usuário não encontrado",
      });
    });

    it("should return error 500 in case of deletion error", async () => {
      req.params!.id = "1";
      const mockUser = {
        id: 1,
        name: "Ana",
        email: "ana@example.com",
        destroy: jest.fn(),
      };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (mockUser.destroy as jest.Mock).mockRejectedValue(
        new Error("Erro ao deletar usuário")
      );

      await deleteUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao deletar usuário",
      });
    });
  });
});
