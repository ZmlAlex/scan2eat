import { prisma } from "~/server/db";

afterAll(async () => {
  await prisma.user.deleteMany();

  await prisma.$disconnect();
});
