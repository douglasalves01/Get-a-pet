import express from "express";
import cors from "cors";
import { connDB } from "./db/conn.js";
import { userRouter } from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

//solve cors
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

//public folder for images
app.use(express.static("public"));

//routes
app.use("/", userRouter);

app.listen(5000, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Aplicação rodando em http://localhost:5000");
});
//conect as bd
connDB();
