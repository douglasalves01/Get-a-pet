import express from "express";
import { PetController } from "../controllers/PetController.js";
import { checkToken } from "../helpers/verify-token.js";
import { imageUpload } from "../helpers/image-upload.js";

export const petRouter = express.Router();

petRouter.post(
  "/create",
  checkToken,
  imageUpload.array("images"),
  PetController.create
);
petRouter.get("/", PetController.getAll);
petRouter.get("/mypets", checkToken, PetController.getAllUserPets);
