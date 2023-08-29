import express from "express";

import { PrismaClient } from "@prisma/client";
import { fieldEncryptionExtension } from "prisma-field-encryption";

const globalClient = new PrismaClient();

const client = globalClient.$extends(
  fieldEncryptionExtension({
    encryptionKey: "k1.aesgcm256.DbQoar8ZLuUsOHZNyrnjlskInHDYlzF3q6y1KGM7DUM=",
  })
);

const app = express();

/* 2. listen()メソッドを実行して3000番ポートで待ち受け。*/
const server = app.listen(3000, function () {
  console.log("start server");
});

app.get("/userposts1", async (req, res, next) => {
  const user = await client.user.findFirst();
  const authorId = user?.id || 1;
  const posts = await client.post.findMany({
    where: {
      authorId: authorId,
    },
  });
  res.send(posts);
});

app.get("/userposts2", async (req, res, next) => {
  const posts = await client.user.findFirst().posts();
  res.send(posts);
});
