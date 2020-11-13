import express from "express";
const app = express();
import api from "./routes/index.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import jwtMiddleware from "./lib/jwtMiddleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    /* createFakeData(); */
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(jwtMiddleware);
app.use("/api", api);

const port = PORT || 4000;

app.listen(port, () => {
  console.log("%d 포트에서 대기중.", port);
});
