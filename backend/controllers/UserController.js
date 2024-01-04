import { createUserToken } from "../helpers/create-user-token.js";
import { getToken } from "../helpers/get-token.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getUserByToken } from "../helpers/get-user-by-token.js";
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
  static async login(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha é obrigatório" });
      return;
    }
    //checar se usuário existe
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(422).json({
        message: "Sem usuário cadastrado para esse email",
      });
      return;
    }
    //checar senha com senha do banco(hash)
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      res.status(422).json({
        message: "Senha inválida!",
      });
      return;
    }
    await createUserToken(user, req, res);
  }
  static async checkUser(req, res) {
    let currentUser;
    if (req.header.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "nossosecret");
      currentUser = await User.findById(decoded.id);
      currentUser.password = undefined;
    } else {
      currentUser = null;
    }
    res.status(200).send(currentUser);
  }
  static async getUserById(req, res) {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(422).json({
        message: "Usuário não encontrado!",
      });
      return;
    }
    res.status(200).json({ user });
  }
  static async editUser(req, res) {
    const id = req.params.id;
    const { name, email, phone, password, confirmPassword } = req.body;
    const token = getToken(req);
    const user = getUserByToken(token);
    let image = "";
    if (req.file) {
      user.image = req.file.filename;
    }

    if (!user) {
      res.status(422).json({
        message: "Usuário não encontrado!",
      });
      return;
    }
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
    user.phone = phone;
    if (password != confirmPassword) {
      res.status(422).json({
        message: "A senha e a confrmação de senha precisam ser iguais",
      });
      return;
    } else if (password === confirmPassword && password != null) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      user.password = passwordHash;
    }
    try {
      const updateUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );
      res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}
