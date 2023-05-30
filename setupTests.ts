import { prisma } from "~/server/db";

beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});
