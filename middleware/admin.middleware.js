import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";

const adminMiddleware = async (req, res, next) => {
  if (req.cookies.token) {
    const token = req.cookies.token;
    console.log(token);

    // Move decoding logic inside the if block
    const payload = jwt.decode(token);
    const emailpayload = payload.email;

    // Finding user in database
    const user = await userModel.findOne({ email: emailpayload });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Assigning with their roles
    const role = user.role;
    if (role === "admin") {
      next();
    
    } else {
      return res.status(401).json({ message: "Access denied" });
    }
  } else {
    res.status(401).json({ message: "Token not found" });
  }
};

export default adminMiddleware;
