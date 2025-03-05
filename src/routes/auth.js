import express from "express";
const authRouter = express.Router();
import validationData from "../utils/validation.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";

authRouter.post("/signup", async (req, res) => {
  try {
    validationData(req);
  } catch (error) {
    return res.status(400).send(error.message);
  }
  
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(hashedPassword);
  const user = new User({ ...req.body, password: hashedPassword });

  try {
   const SavedUser = await user.save();
   const token = await SavedUser.getJWT();
   res.cookie("token", token);
   res.json({ message: "User Added Successfully", data: SavedUser });
  } catch (error) {
    console.log("Error in saving the data: " + error);
    res.status(400).send("error" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }
    
    console.log(user);
    const isPasswordValid = await user.validatePassword(password);
    
    if (isPasswordValid) {
      const token = await user.getJWT();
      console.log(token);
      res.cookie("token", token);
      return res.send(user); 
    }
    
    return res.status(404).send("Invalid credentials"); 
  } catch (err) {
    return res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful"); // 🛠 Fix: Send response separately
});

export default authRouter;
