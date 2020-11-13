import mongoose from "mongoose";
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String], // 문자열로 이루어진 배열
  publishedDate: {
    type: Date,
    default: Date.now, // 현재 날짜를 기본값으로 지정
  },
});

const Post = mongoose.model("Post", PostSchema); // model(1,2)  : 1. 스키마이름 2.스키마 객체
export default Post;

// 이렇게만들면 스키마이름의 소문자 복수형으로 컬렉션이 생성된다.   /Post => posts, BookInfo => bookinfos
