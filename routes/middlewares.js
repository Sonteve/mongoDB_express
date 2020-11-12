import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export const checkObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("존재하지않는 글 입니다.");
  }
  return next();
};
