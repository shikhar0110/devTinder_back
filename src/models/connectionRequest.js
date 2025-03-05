import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is not supported",
      },
      required: true,
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
  connectionRequestSchema.pre("save", async function (next) {
      const ConnectionRequest=this
      if(ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)){
        throw new Error("You cannot send a connection request to yourself")
      }
      next() 
  })
const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

export default ConnectionRequest;
