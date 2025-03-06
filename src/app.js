import express from "express";
import connectdb from "./config/database.js";
import User from "./models/user.js";
import validationData from "./utils/validation.js";
import "dotenv/config";


import cookieParser from "cookie-parser";

import cors from "cors"
const app = express();
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(cookieParser());
app.use(express.json());

import authRouter from "./routes/auth.js";

import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/requests.js";
import userRouter from "./routes/users.js";

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);



app.delete("/user", async (req, res) => {
  try {
    const user = await User.findOneAndDelete(req.body.userId);
    res.send("user is deleted");
  } catch (error) {
    res.status(400).send("Error in finding the user");
  }
});

connectdb()
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT,"0.0.0.0", () => {
      console.log("Server is running on port 8000");
    });
  })
  .catch((err) => {
    console.log("Database is not connected: " + err);
  });
