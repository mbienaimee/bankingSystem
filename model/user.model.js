import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
  
    otpExpires: {
        type: Date,
        required: false,
    }
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
