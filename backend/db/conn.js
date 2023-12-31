import mongoose from "mongoose";

export async function main() {
  await mongoose.connect("mongodb://localhost:27017/getapet");
  console.log("conectado ao mongoose");
}

main.catch((err) => console.log(err));
