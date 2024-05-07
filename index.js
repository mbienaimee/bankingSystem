import express from "express";
// import expressJwt from "express-jwt";

import mongoose from "mongoose";
// import ErrorHandler from "./middleware/errorHandling.js"
import cookieParser from "cookie-parser";
import route from "./route/user.route.js";
import router from "./route/tokenRoute.js";
import authjwt from "./helper/jwt.js";
import accRoute from "./route/acc.route.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swagger from "./Docs/swagger.json" assert { type: "json" };
import routerClient from "./route/client.route.js";

const port = process.env.PORT || 3000;
const db = process.env.DB || "mongodb://localhost:27017/Autho";
const app = express();
//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//routes
// app.use("/api-doc", swaggerUi.serve);
app.use("/api-doc",swaggerUi.serve, swaggerUi.setup(swagger));
app.use(authjwt());
app.use("/api/v1", route);
app.use("/api/account", accRoute);
app.use("/api/v1/token", router);
app.use("/api/client", routerClient);

mongoose.connect(db);
try {
  console.log("connected to db");
  app.listen(port, () => {
    console.log(`listening on port ${port}...`);
  });
} catch (err) {
  console.log(err);
}
// app.use("/api-doc", swaggerUi.serve);
// app.use("/api-doc", swaggerUi.setup(swagger));

// app.use(ErrorHandler())
