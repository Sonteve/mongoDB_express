import jwt from "jsonwebtoken";
import User from "../models/user.js";

const jwtMiddleware = async (req, res, next) => {
  const token = req.cookies["access-token"];
  if (!token) {
    return next();
  } // 토큰이 없음
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = {
      _id: decoded._id,
      username: decoded.username,
    };

    console.log("토큰", decoded);
    // 토큰의 남은 유효 기간이 3.5일 미만이면 재발급
    const now = Math.floor(Date.now() / 1000); //Date.now()가 ms이기 때문에 그냥 초로 바꿔주기위해 1000으로 나누고 버림.
    //decoded.exp도 그냥 초로 되어있다.
    console.log(
      "decoded.exp",
      decoded.exp,
      "now",
      now,
      "3.5일",
      60 * 60 * 24 * 3.5,
      "decoded.exp - now",
      decoded.exp - now
    );
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      // 라우터에 전달되기전에 토큰을 확인해서
      // 3.5일보다 적게 남았으면 토큰 갱신

      const user = await User.findById(decoded._id);
      const token = user.generateToken();
      res.cookie("access-token", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
    }

    /* 
        {
            _id: '5fae515e61a5ff53e4042bba',
            username: 'sds11609',
            iat: 1605260523, // 토큰 언제만들어졌는지
            exp: 1605865323 // 언제 만료되는지
}
    */
    return next();
  } catch (error) {
    console.error(error);
    return next(); // 토큰 검증 실패
  }
};

export default jwtMiddleware;
