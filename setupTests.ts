import { prisma } from "~/server/db";

beforeAll(async () => {
  await prisma.user.deleteMany({
    where: {
      NOT: {
        name: "example",
      },
    },
  });
  await prisma.$disconnect();
});
