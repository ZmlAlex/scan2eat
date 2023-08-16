import { prisma } from "~/server/db";

// TODO: DO NOT DELETE ONE RESTAURANT
beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});
