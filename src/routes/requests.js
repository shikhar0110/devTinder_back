import express from "express";
import userAuth from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js"; // ✅ Import User model

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    console.log(req.params);
    try {
      const fromUserId = req.user._id.toString().trim();
      const toUserId = req.params.toUserId.trim();
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "invalid status type" + status,
        });
      }

      const toUse = await User.findById(toUserId);
      if (!toUse) {
        return res.status(400).json({ message: "User not found" });
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).send({
          message: "Connection request alread exist!!",
        });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      res.json({
        message: "Connection request sent successfully",
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);



requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const {status,requestId} = req.params;
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "invalid status type" + status
      })
    }
    const connectionRequest = await ConnectionRequest.findById({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    });

    if (!connectionRequest) {
      return res.status(400).json({
        message: "Connection request not found"
      })
    }

    connectionRequest.status = status;
    const data=await connectionRequest.save();
    res.json({
      message: "Connection request updated successfully",
      data
    })
    
  } catch (error) {
    console.error(error);
      res.status(500).json({ message: error.message });
   
  }
})
export default requestRouter;
