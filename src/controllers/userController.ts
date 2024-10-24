import { Request, RequestHandler, Response } from "express";
import { Op } from "sequelize";
import User from "../models/User";

export const createUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, age, active } = req.body;
    const user = await User.create({ name, email, age, active });
    res.status(201).json(user);
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "O e-mail deve ser único." });
      return;
    }
    res.status(500).json({ error });
  }
};

export const getUsers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { name, ageMin, ageMax } = req.query;
    const whereClause: any = {};

    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%`,
      };
    }

    if (ageMin || ageMax) {
      whereClause.age = {};
      if (ageMin) whereClause.age[Op.gte] = Number(ageMin);
      if (ageMax) whereClause.age[Op.lte] = Number(ageMax);
    }

    const users = await User.findAll({ where: whereClause });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
    console.error(
      `An error occurred while searching for users. Error: ${error}`
    );
  }
};

export const getUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
      return;
    }
    res.status(404).json({ error: "Usuário não encontrado" });
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
    console.error(
      `An error occurred while searching for users. Error: ${error}`
    );
  }
};

export const updateUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, age, active } = req.body;

    const user = await User.findByPk(req.params.id);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.age = age !== undefined ? age : user.age;
      user.active = active !== undefined ? active : user.active;

      await user.save();
      res.status(200).json(user);
      return;
    }
    res.status(404).json({ error: "Usuário não encontrado" });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "O e-mail deve ser único." });
      console.error(
        "The user tried to update an email using an email that is already in our database."
      );
      return;
    }
    res.status(500).json({ error: "Erro ao atualizar usuário" });
    console.error(
      `An error occurred while trying to update users. Error: ${error}`
    );
  }
};

export const deleteUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).send();
      return;
    }
    res.status(404).json({ error: "Usuário não encontrado" });
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao deletar usuário" });
    console.error(
      `An error occurred while trying to delete users. Error: ${error}`
    );
  }
};
