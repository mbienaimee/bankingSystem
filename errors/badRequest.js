import CustomError from "/Users/USER/Desktop/bsa/errors/customErr.js";

export class BadRequestError extends CustomError {
  constructor(message) {
    super(message);

    this.statusCode = 400;
  }
}
