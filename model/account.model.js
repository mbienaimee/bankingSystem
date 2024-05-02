import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  idNumber: { type: String, required: true },
  // idCard: { type: String, required: true },
  accountType: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  accountNumber:{
    type: String,
    required: false,
  },
  
});

const accountModel = mongoose.model("account", accountSchema);
export default accountModel