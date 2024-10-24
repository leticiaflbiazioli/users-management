import { Router } from "express";
import { login } from "../controllers/authController";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateFieldsMiddleware } from "../middleware/validateFieldsMiddleware";

const router = Router();
router.post("/login", login);
router.post("/users", authMiddleware, validateFieldsMiddleware, createUser);
router.get("/users", authMiddleware, getUsers);
router.get("/users/:id", authMiddleware, getUser);
router.put("/users/:id", authMiddleware, validateFieldsMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;
