import express from "express";
const app = express();
import api from "./routes/index.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", api);

const port = PORT || 4000;

app.listen(port, () => {
  console.log("%d 포트에서 대기중.", port);
});
