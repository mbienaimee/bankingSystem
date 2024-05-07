import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import clientModel from "../model/client.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  

const clientController = {
  clientCreation: async (req, res) => {
    try {
      const { lastName,firstName, email,password } = req.body;

      // Create client in the database
      const newClient = await clientModel.create(req.body);

      // Send email to client
      const mailOptions = {
        from: '"YOUR PASSWORD" <bienaimeemariereine@gmail..com>',
        to: email, // Assuming 'recipient' is 'email' from req.body
        subject: "Account Created Successfully",
        text: `Dear ${lastName},\n\nYour account has been created successfully by the admin.\n\nPassword: ${password}\n\nRegards,\nAdmin`
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        success: true,
        message: "Client created successfully and email sent",
        client: newClient,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
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
  
      // Find user in database by email
      const user = await clientModel.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      // if (!passwordMatch) {
      //   return res.status(400).json({ message: "Invalid password" });
      // }
  
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
  
  clientList: async (req, res) => {
    try {
      const clients = await clientModel.find();
      res.status(200).json({
        success: true,
        clients: clients,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
export default clientController;
