import express from "express";
import Joi from "@hapi/joi";
import User from "../models/user.js";

const router = express.Router();

/* 
    //GET /api/auth/check
 */

router.get("/check", (req, res, next) => {
  const { user } = res.locals;
  if (!user) {
    return res.status(401).send("로그인중이지 않습니다.");
  }
  console.log("check의 유저데이터", user);
  res.status(200).json(user);
});

/*  
    //POST api/auth/register
    {
        username : 'sonteve',
        password: 'passdsds'
    }
 */

router.post("/register", async (req, res, next) => {
  // req.body검증
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).json(result.error);
  }
  const { username, password } = req.body;
  try {
    // username이 이미 존재하는지 확인
    const exists = await User.findByUsername(username);
    if (exists) {
      return res.status(409).send("이미 존재하는 유저입니다.");
    }
    const user = new User({
      username,
    });
    await user.setPassword(password); // 비밀번호 해쉬화함.
    await user.save(); // 유저인스턴스 정보를 db에 저장
    const data = user.serialize(); // 인스턴스를 객체 처럼 다루기 위해 toJSON하고 해쉬화된 암호 제거
    const token = user.generateToken();
    res.cookie("access_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, //쿠키의 만료 시간(단위 ms)
      httpOnly: true, // front에서 js로 쿠키 조회 못함.
    });
    return res.status(201).json(data); // 유저에겐 아이디와 닉네임만 전달
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return req.status(401).send("id나 비밀번호가 없습니다.");
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).send("존재하지 않는 유저 입니다.");
    }
    const valid = await user.checkPassword(password);
    if (!valid) {
      return res.status(401).send("비밀번호가 틀렸습니다.");
    }
    const data = user.serialize();
    const token = user.generateToken();
    res.cookie("access-token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
