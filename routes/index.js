import express from "express";
import postsRouter from "./posts.js";
import authRouter from "./auth.js";

const router = express.Router();

router.use("/posts", postsRouter);
router.use("/auth", authRouter);

export default router;
