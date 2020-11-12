import express from "express";
import Post from "../models/post.js"; // 모델 인스턴스를 불러온다.
import { checkObjectId } from "./middlewares.js";
const router = express.Router();

/*  전체 글 목록
  GET /api/posts   
*/

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find().exec(); // find 메서드 후에는 exec를 호출해야 서버에 쿼리요청을 한다.
    return res.status(200).json(posts);
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
