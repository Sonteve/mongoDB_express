import Joi from "@hapi/joi";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Schema } = mongoose;
const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash; // this => user (문서 인스턴스)
};

UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      // 토큰에 담을 정보
      _id: this.id,
      username: this.username,
    },
    // JWT_SECRET값
    process.env.JWT_SECRET,
    {
      // 7일동안 유효
      expiresIn: "7d",
    }
  );
  return token;
};

UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username }); // this => User (모델)
};

const User = mongoose.model("User", UserSchema);
export default User;
