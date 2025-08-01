const mongoose = require("mongoose");
const connectionstring = "mongodb://localhost:27017/E-learning";
const url =
  "mongodb+srv://zerguineyounes3:vUUqBXPOkskcFLX4@cluster0.s5njglh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await await mongoose.connect(url);

    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
