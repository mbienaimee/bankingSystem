import express from "express";
import mongoose from "mongoose";
// import ErrorHandler from "./middleware/errorHandling.js"
import cookieParser from "cookie-parser";
import route from "./route/user.route.js";
import router from "./route/tokenRoute.js";
import authjwt from "./helper/jwt.js";
import accRoute from "./route/acc.route.js"
const port = process.env.PORT || 3000;
const db = process.env.DB || "mongodb://localhost:27017/Autho";
const app = express();
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(authjwt());

//routes
app.use("/api/v1", route);
app.use("/api",accRoute)


app.use("/api/v1/token", router);

mongoose.connect(db);
try {
  console.log("connected to db");
  app.listen(port, () => {
    console.log(`listening on port ${port}...`);
  });
} catch (err) {
  console.log(err);
}

// app.use(ErrorHandler())
