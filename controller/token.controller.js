import Token from "../model/tokenAuth.js";
// import { validationResult } from 'express-validator';
import { BadRequestError } from "../errors/badRequest.js";

const tokenController = {
  addToken: async (req, res, next) => {
    if (!errors.isEmpty()) {
      next(new BadRequestError(errors.array()[0].msg));
    }
    try {
      const newToken = await Token.create(req.body);
      return res.status(201).json(newToken);
    } catch (err) {
      next(err);
    }
  },
  findByUser: async (req, res, next) => {
    try {
      const tokenOwner = req.params.user;

      const foundToken = await Token.findOne({ status: tokenOwner });
      return res.status(200).json({
        foundToken,
      });
    } catch (err) {
      next(err);
    }
  },
  deleteToken: async (req, res, next) => {
    const deletedToken = await Token.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "Token deleted", token: deletedToken });
  },
};
export default tokenController;
