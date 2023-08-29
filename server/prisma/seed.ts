import { PrismaClient, Prisma } from "@prisma/client";
import { fieldEncryptionExtension } from "prisma-field-encryption";

const globalClient = new PrismaClient();

export const client = globalClient.$extends(
  fieldEncryptionExtension({
    encryptionKey: "k1.aesgcm256.DbQoar8ZLuUsOHZNyrnjlskInHDYlzF3q6y1KGM7DUM=",
  })
);
const userData: Prisma.UserCreateInput[] = [
  {
    name: "User1",
    email: "user1@user1.com",
    posts: {
      create: [
        { title: "Post1", content: "Post1 Content" },
        { title: "Post2", content: "Post2 Content" },
      ],
    },
  },
  {
    name: "User2",
    email: "user2@user2.com",
    posts: {
      create: [
        { title: "Post3", content: "Post3 Content" },
        { title: "Post4", content: "Post4 Content" },
      ],
    },
  },
];

const userTransfer = async () => {
  const users = [];
  for (const u of userData) {
    const user = client.user.create({
      data: u,
    });
    users.push(user);
  }
  return await client.$transaction(users);
};

// 定義されたデータを実際のモデルへ登録する処理
const main = async () => {
  console.log(`Start seeding ...`);

  await userTransfer();

  console.log(`Seeding finished.`);
};

// 処理開始
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.$disconnect();
  });
