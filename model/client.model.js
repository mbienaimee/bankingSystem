import mongoose from "mongoose"


const client =  new mongoose.Schema({
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
       
      },
    
      password: {
        type: String,
        required: true,
      },
      role:{
        type: String,
        required: true,
        default: "user"
      }
})

const clientModel = mongoose.model("client", client);
export default clientModel
 