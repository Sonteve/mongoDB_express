import express from "express";
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("name", req.query.nickname);
  if (req.query.nickname) {
    return res.send(`<h1>About ${req.query.nickname}</h1>`);
  }
  return res.send(`<h1>About</h1>`);
});

export default router;
