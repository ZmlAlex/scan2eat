import { prisma } from "~/server/db";

// mock emails for tests
jest.mock("./emails/LoginEmail", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

// TODO: DO NOT DELETE ONE RESTAURANT
beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});
