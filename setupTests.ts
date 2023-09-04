import { prisma } from "~/server/db";

// mock emails for tests
jest.mock("./emails/LoginEmail", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

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
