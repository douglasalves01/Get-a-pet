import mongoose from "mongoose";

export async function connDB() {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/getapet`);
    console.log("Conectado ao mongoose");
  } catch (error) {
    console.error("Erro ao conectar:", error);
  }
}
