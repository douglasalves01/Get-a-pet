import jwt from "jsonwebtoken";

export const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    "nossosecret"
  );
  res.status(200).json({
    message: "Você está atutenticado",
    token: token,
    userId: user._id,
  });
};
