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
import { validateUser } from "../middleware/validateFieldsMiddleware";

const router = Router();
router.post("/login", login);
router.post("/users", [authMiddleware, validateUser], createUser);
router.get("/users", authMiddleware, getUsers);
router.get("/users/:id", authMiddleware, getUser);
router.put("/users/:id", [authMiddleware, validateUser], updateUser);
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;
