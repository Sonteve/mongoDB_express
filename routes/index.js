import express from "express";
import aboutRouter from "./about.js";
import postsRouter from "./posts.js";

const router = express.Router();

router.use("/about", aboutRouter);
router.use("/posts", postsRouter);

export default router;
