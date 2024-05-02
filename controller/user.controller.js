import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "../model/tokenAuth.js";
import { sendEmail } from "../utils/sendEmail.js";
import { otpGenerator } from "../utils/otp.js";
import { validationResult } from "express-validator";
import { BadRequestError } from "/Users/USER/Desktop/bsa/errors/badRequest.js";
// import { NotFoundErr } from "../errors/notFound.js";

import dotenv from "dotenv";

dotenv.config();

const userController = {
  signup: async (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new BadRequestError(errors.array()[0].msg));
    }
    try {
      // Check if user already exists
      const existingUser = await userModel.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      //generate otp
      const otp = otpGenerator();
      const otpExpirationDate = new Date().getTime() + (60 * 1000 * 5);

      // Create a new user
      const newUser = await userModel.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        age: req.body.age,
        password: hashedPassword,
        role: req.body.role,
        otp: otp,
        otpExpirationDate: otpExpirationDate,
      });
     sendEmail(req.body.email, "Verify your account", `Your OTP is ${otp}`);
      // Respond
      res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  
 ValidateOpt:async (req, res, next) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }
    try{
        
    // Checking if the given opt is stored in our database
    const foundUser = await userModel.findOne({ otp: req.body.otp });
    if (!foundUser) {
        next(new UnauthorizedError('Authorization denied'));
    };

    // Checking if the otp is expired or not.
    if (foundUser.otpExpires < new Date().getTime()) {
        next(new UnauthorizedError('OTP expired'));
    }

    // Updating the user to verified
    foundUser.verified = true;
    const savedUser = await foundUser.save();

    if (savedUser) {
        return res.status(201).json({
            message: "User account verified!",
            user: savedUser
        });
    }

    }catch(err){
next(err);
    }

},
  allUser: async (req, res) => {
   
    try {
      const allUser = await userModel.find().select(-password);
      res.status(200).json({
        message: "All user",
        allUser: allUser,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updating: async (req, res) => {
    try {
      // to see if the user already in database
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({
        message: "User updated successfully",
        updatedUser: updatedUser,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  Deleting:async(req,res)=>{
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await userModel.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  listByid: async (req,res)=>{
    try {
      const user = await userModel.findById(req.params.id).select(-password);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        message: "User found",
        user: user,
      });
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try { 
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Must provide email and password" });
      }

      // Find user in database
      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
      // Generate token
      const secret = process.env.SECRET;
      const token = jwt.sign({ user_id: user.id, email: user.email }, secret, {
        expiresIn: "3h",
      });

      // Set token as a cookie
      const options = {
        expiresIn: "3h",
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token: token,
        user: user,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  ForgotPassword : async (req, res, next) => {
 

    // Find user
    const foundUser = await userModel.findOne({ email: req.body.email });
    if (!foundUser) {
        return next(new BadRequestError("Your email is not registered!"));
    };

    // Generate token
    const token = jwt.sign({ id: foundUser.id }, process.env.SECRET, { expiresIn: "15m" });

    // Recording the token to the database
    await Token.create({
        token: token,
        user: foundUser._id,
        expirationDate: new Date().getTime() + (60 * 1000 * 5),
    });

    const link = `http://localhost:8080/reset-password?token=${token}&id=${foundUser.id}`;
    const emailBody = `Click on the link bellow to reset your password\n\n${link}`;

    await sendEmail(req.body.email, "Reset your password", emailBody);

    res.status(200).json({
        message: "We sent you a reset password link on your email!",
    });
},
ResetPassword : async (req, res, next) => {
    try{
        const decoded = await jwt.verify(req.body.token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(new BadRequestError("Invalid token!"));
        }
    
        const recordedToken = await Token.findOne({ token: req.body.token });
        
        if (decoded.id!= req.body.id || recordedToken.user!= req.body.id) {
            return next(new BadRequestError("Invalid token!"));
        }
    
        if (new Date(recordedToken.expirationDate).getTime() < new Date().getTime()) {
            return next(new BadRequestError("Token expired!"));
        }
    
        // Find user
        const foundUser = await UserModel.findById(req.body.id);
        if (!foundUser) {
            return next(new BadRequestError("User not found!"));
        };
    
        // Deleting the user token
        await Token.deleteOne({ token: req.body.token });
    
        // Harshing the user password
        const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
    
        // Updating the user password
        foundUser.password = hashedPassword;
    
        const savedUser = await foundUser.save();
        if (savedUser) {
            return res.status(200).json({
                message: "Your password has been reset!",
            })
        }
    
    
    }catch(err){
        next(err);
    }
   

}



};

export default userController;
