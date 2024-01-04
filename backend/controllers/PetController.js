import { isValidObjectId } from "mongoose";
import { getToken } from "../helpers/get-token.js";
import { getUserByToken } from "../helpers/get-user-by-token.js";
import { Pet } from "../models/Pet.js";
export class PetController {
  static async create(req, res) {
    const { name, age, weight, color } = req.body;
    const images = req.files;
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
    if (images.length === 0) {
      res.status(422).json({
        message: "Imagem é obrigatória!",
      });
      return;
    }
    const token = getToken(req);
    const user = await getUserByToken(token);
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
    images.map((image) => {
      pet.images.push(image.filename);
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
  static async getAll(req, res) {
    const pets = await Pet.find().sort("-createdAt");

    res.status(200).json({
      pets: pets,
    });
  }
  static async getAllUserPets(req, res) {
    //get user
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "user._id": user._id }).sort("-createdAt");
    res.status(200).json({ pets: pets });
  }
  static async getAllUserAdoptions(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "adopter._id": user._id }).sort("-createdAt");
    res.status(200).json({ pets: pets });
  }
  static async getPetById(req, res) {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      res.status(422).json({ message: "ID inválido!" });
      return;
    }
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({ message: "Pet não foi encontrado!" });
    }
    res.status(200).json({
      pet: pet,
    });
  }
  static async removePetById(req, res) {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      res.status(422).json({ message: "ID inválido!" });
      return;
    }
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({ message: "Pet não foi encontrado!" });
      return;
    }

    //check if logged in user registered the pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id) {
      res
        .status(422)
        .json({ message: "Houve um problema ao processar a sua solicitação!" });
      return;
    }
    await Pet.findByIdAndDelete(id);
    res.status(200).json({ message: "Pet removido com sucesso!" });
  }
  static async updatePet(req, res) {
    const id = req.params.id;
    const { name, age, weight, color, avaliable } = req.body;
    const images = req.files;
    const updatedData = {};

    //pet existe
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({ message: "Pet não foi encontrado!" });
      return;
    }
    //se o pet é do usuário
    //check if logged in user registered the pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id) {
      res
        .status(422)
        .json({ message: "Houve um problema ao processar a sua solicitação!" });
      return;
    }
    if (!color) {
      res.status(422).json({
        message: "Cor é obrigatória!",
      });
      return;
    } else {
      updatedData.color = color;
    }
    if (!name) {
      res.status(422).json({
        message: "Nome é obrigatório!",
      });
      return;
    } else {
      updatedData.name = name;
    }
    if (!age) {
      res.status(422).json({
        message: "Idade é obrigatória!",
      });
      return;
    } else {
      updatedData.age = age;
    }
    if (!weight) {
      res.status(422).json({
        message: "Peso é obrigatório!",
      });
      return;
    } else {
      updatedData.weight = weight;
    }
    if (images.length === 0) {
      res.status(422).json({
        message: "Imagem é obrigatória!",
      });
      return;
    } else {
      updatedData.images = [];
      images.map((image) => {
        updatedData.images.push(image.filename);
      });
    }
    await Pet.findByIdAndUpdate(id, updatedData);
    res.status(200).josn({ message: "Pet atualizado com sucesso!" });
  }
}
