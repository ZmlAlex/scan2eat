import { prisma } from "~/server/db";

import { createBurgerRestaurant } from "./seedData/burgerRestaurant";
import { currencies, languages } from "./seedData/common";
import { createWokRestaurant } from "./seedData/wokRestaurant";

async function main() {
  await prisma.language.createMany({
    data: languages,
  });

  await prisma.currency.createMany({
    data: currencies,
  });

  const basicUser = await prisma.user.create({
    data: {
      email: "amazonalexzml@gmail.com",
      name: "example",
    },
  });

  await createBurgerRestaurant(basicUser.id);
  await createWokRestaurant(basicUser.id);
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
