import customErr from "/Users/USER/Desktop/bsa/errors/customErr.js";

export default class UnauthorizedError extends customErr {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
        this.status = 401;
    }
}
