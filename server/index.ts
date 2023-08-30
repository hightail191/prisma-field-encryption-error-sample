// you can create sample data if you command "npm run seed" in terminal

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

const server = app.listen(3000, function () {
  console.log("start server");
});

// normal query
app.get("/userposts1", async (req, res, next) => {
  const user = await client.user.findFirst();
  const authorId = user?.id || 1;
  const posts = await client.post.findMany({
    where: {
      authorId: authorId,
    },
  });
  console.log(posts);
  res.send(posts);
});

// fluent API
app.get("/userposts2", async (req, res, next) => {
  const posts = await client.user.findFirst().posts();
  console.log(posts);
  res.send(posts);
});
