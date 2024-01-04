import { getToken } from "../helpers/get-token.js";
import { getUserByToken } from "../helpers/get-user-by-token.js";
import { Pet } from "../models/Pet.js";
export class PetController {
  static async create(req, res) {
    const { name, age, weight, color } = req.body;
    const avaliable = true;

    //images upload

    //validações
    if (!color) {
      res.status(422).json({
        message: "Cor é obrigatória!",
      });
      return;
    }
    if (!name) {
      res.status(422).json({
        message: "Nome é obrigatório!",
      });
      return;
    }
    if (!age) {
      res.status(422).json({
        message: "Idade é obrigatória!",
      });
      return;
    }
    if (!weight) {
      res.status(422).json({
        message: "Peso é obrigatório!",
      });
      return;
    }
    const token = getToken(req);
    const user = getUserByToken(token);
    const pet = new Pet({
      name,
      age,
      weight,
      color,
      avaliable,
      images: [],
      user: {
        _id: user.id,
        name: user.name,
        image: user.image,
        phone: user.iphone,
      },
    });
    try {
      const newPet = await pet.save();
      res.status(201).json({
        message: "Pet cadastrado com sucesso",
        newPet,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}
