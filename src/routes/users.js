import express from "express";
import User from "../models/user.js";
const userRouter = express.Router();
import userAuth from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
const USER_SAFE_DATA = ["firstName", "lastName", "photoURL", "age", "gender"];
userRouter.get("/users/requests", userAuth, async (req, res) => {
  try {

    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested" 
    }).populate("fromUserId",["firstName","lastName","photoURL","age","gender"]);
  res.json({
    message: "Connection request updated successfully",
    connectionRequest
  })
    
  } catch (error) {
    res.status(400).send("Error in finding the user: " + error.message); 
  }
});

userRouter.get("/users/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
   
    const connectionRequest = await ConnectionRequest.find({
        $or: [
            { toUserId: loggedInUser._id ,status:"accepted"},
            {
                fromUserId: loggedInUser._id,status:"accepted"
            }
        ]
    }).populate("fromUserId",["firstName","lastName","photoURL","age","gender"]).populate("toUserId",["firstName","lastName","photoURL","age","gender"]);
    const data=connectionRequest.map((row)=>{
        if(row.fromUserId.equals(loggedInUser._id)){
            return row.toUserId
        }else{
            return row.fromUserId
        }
    })
    
    res.json({
     data
    })
  } catch (error) {
    res.status(400).send("Error in finding the user: " + error.message); // Improved error message formatting
  }
}); 

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});




export default userRouter;
