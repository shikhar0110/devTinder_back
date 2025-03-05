import mongoose from "mongoose";

const connectdp = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING,);
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error(" Database connection failed:", error.message);
    process.exit(1); 
  }
};

export default connectdp;
