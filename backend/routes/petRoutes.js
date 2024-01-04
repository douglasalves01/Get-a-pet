import express from "express";
import { PetController } from "../controllers/PetController.js";
import { checkToken } from "../helpers/verify-token.js";

export const petRouter = express.Router();

petRouter.post("/create", checkToken, PetController.create);
