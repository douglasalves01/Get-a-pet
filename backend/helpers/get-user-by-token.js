import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const getUserByToken = async (token) => {
  if (!token) {
    return resizeBy.status(401).json({ message: "Acesso Negado!" });
  }
  const decoded = jwt.verify(token, "nossosecret");
  const userId = decoded.id;
  const user = await User.findOne({ _id: userId });
  return user;
};
