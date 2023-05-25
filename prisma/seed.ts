import { prisma } from "~/server/db";

async function main() {
  await prisma.language.createMany({
    data: [
      {
        title: "english",
        code: "english",
      },
      {
        title: "russian",
        code: "russian",
      },
    ],
  });

  await prisma.currency.createMany({
    data: [
      {
        code: "USD",
        title: "dollar",
      },
      {
        code: "RUB",
        title: "рубль",
      },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
