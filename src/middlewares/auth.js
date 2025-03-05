import jwt from "jsonwebtoken";
import User from "../models/user.js";
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
        return res.status(404).send("Please authenticate");
    }
    const decodedObj = jwt.verify(token, "DEV@Tinder$790");

    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(404).send("Please authenticate" + error.message);
  }
};


export default userAuth;
