import { Schema } from "mongoose"
import  mongoose from mongoose 

const client =  new Schema.mongoose({
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
      }
})

const clientModel = mongoose.model("client", client);
export default clien
 