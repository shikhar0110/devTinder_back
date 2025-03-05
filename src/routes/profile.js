import express from "express";
const profileRouter = express.Router();
import userAuth from "../middlewares/auth.js";
import { validateEditProfileData } from "../utils/validation.js";
import bcrypt from "bcrypt";

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
    console.log(user);
  } catch (error) {
    res.status(404).send("Error in finding the user: " + error.message); // Improved error message formatting
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isValid = await validateEditProfileData(req); // ✅ Await the async function
    if (!isValid) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;
    console.log(loggedInUser);

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();

    res.send("Your profile updated successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
  

});



profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user
  const { password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10);
  loggedInUser.password = hashedPassword;
  await loggedInUser.save();
  res.send("ur password change successfully ")
  } catch (error) {
    res.status(400).send("Error: " + error.message);

  }

})

export default profileRouter;
