import { createUserToken } from "../helpers/create-user-token.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
export class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmPassword } = req.body;

    //validações
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }
    if (!phone) {
      res.status(422).json({ message: "O telefone é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha é obrigatório" });
      return;
    }
    if (!confirmPassword) {
      res.status(422).json({ message: "A confirmação de senha é obrigatório" });
      return;
    }
    if (password != confirmPassword) {
      res.status(422).json({
        message: "A senha e a confrmação de senha precisam ser iguais",
      });
      return;
    }
    //checar se usuário já existe7
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      res.status(422).json({
        message: "Por favor, utilize outro email",
      });
      return;
    }

    //create a password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //create a user
    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: passwordHash,
    });
    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}
