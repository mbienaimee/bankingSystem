import clientModel from "../model/client.model.js";
import jwt from "jsonwebtoken";

const userMiddleware = async (req, res, next) => {
  if (req.cookies.token) {
    const token = req.cookies.token;
    console.log(token);

    try {
      const payload = jwt.decode(token);
      const emailPayload = payload.email;

      // Finding user in database
      const user = await clientModel.findOne({ email: emailPayload });

      // if (!user) {
      //   return res.status(401).json({ message: "User not found" });
      // }

      // User exists, check their role
      const role = user.role;
      
      if (role === "user") {
        next();
      } else {
        return res.status(401).json({ message: "Access denied" });
      }
    } catch (error) {
      console.error("Error in userMiddleware:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(401).json({ message: "Token not found" });
  }
};

export default userMiddleware;
