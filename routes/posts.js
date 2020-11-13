import express from "express";
import Post from "../models/post.js"; // 모델 인스턴스를 불러온다.
import checkObjectId from "../lib/checkObjectId.js";
import Joi from "@hapi/joi";
const router = express.Router();

/*  전체 글 목록
  GET /api/posts   
*/

router.get("/", async (req, res, next) => {
  const page = parseInt(req.query.page || "1", 10);
  if (page < 1) {
    return res.status(400).send("잘못된 페이지 입니다.");
  }

  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec(); // find 메서드 후에는 exec를 호출해야 서버에 쿼리요청을 한다.
    const postCount = await Post.countDocuments().exec();
    res.setHeader("Last-page", Math.ceil(postCount / 10));

    return res.status(200).json(
      posts.map((post) => ({
        ...post,
        body:
          post.body.length < 100 ? post.body : `${post.body.slice(0, 100)}...`,
      }))
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/*   특정 글 조회
  GET /api/posts/:id   
*/

router.get("/:id", checkObjectId, async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      return res.status(404).send("존재하지 않는 글 입니다.");
    }
    res.status(200).json(post);
  } catch (error) {
    console.log("atch문 에러");
    console.error(error);
    next(error);
  }
});

/*   글 등록
  POST /api/posts
    {
      title : '제목',
      body: '내용',
      tags: ['태그1', '태그2']
    }
*/

router.post("/", async (req, res, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }
  const { title, body, tags } = req.body;
  const post = new Post({
    title,
    body,
    tags,
  });
  try {
    await post.save(); // 저장
    return res.status(201).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/*  글 수정
    PATCH /api/posts/:id
*/

router.patch("/:id", checkObjectId, async (req, res, next) => {
  const { id } = req.params;
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }
  try {
    const post = await Post.findByIdAndUpdate(id, req.body, {
      new: true, // true시 바뀐값으로 객체가 새로 생성됨 false시 변경전 객체를 리턴한다.
    }).exec();
    if (!post) {
      return res.status(404).send("존재하지 않는 글 입니다.");
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/*  특정 글 삭제
    DELETE /api/posts/:id
 */

router.delete("/:id", checkObjectId, async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndRemove(id).exec();
    if (!post) {
      return res.status(404).send("존재하지 않는 글 입니다.");
    }
    res.status(204); // 성공했으나 보낼것없음.
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
