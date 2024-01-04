import express from "express";
import { UserController } from "../controllers/UserController.js";
import { checkToken } from "../helpers/verify-token.js";

export const userRouter = express.Router();

userRouter.post("/users/register", UserController.register);
userRouter.post("/users/login", UserController.login);
userRouter.get("/users/checkUser", UserController.checkUser);
userRouter.get("/:id", UserController.getUserById);
userRouter.patch("/edit/:id", checkToken, UserController.editUser);
