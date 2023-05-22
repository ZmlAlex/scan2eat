import { prisma } from "~/server/db";
import crypto from "crypto";

export const createUser = async () => {
  return await prisma.user.create({
    data: {
      email: `${crypto.randomBytes(20).toString("hex")}@test.com`,
      name: "Sponge Bob",
    },
  });
};
