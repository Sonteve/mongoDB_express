import Post from "./models/post.js";
import faker from "faker";

export default function createFakeData() {
  const posts = Array(50)
    .fill()
    .map((v, i) => ({
      title: `포스트 #${i}`,
      body: `${faker.lorem.paragraph()}`,
      tags: ["가짜", "데이터"],
    }));

  Post.insertMany(posts, (err, docs) => {
    console.log(docs);
  });
}
