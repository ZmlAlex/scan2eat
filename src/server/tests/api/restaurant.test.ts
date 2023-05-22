import { type AppRouter, appRouter } from "../../api/root";
import { type Session } from "next-auth";
import { type inferProcedureInput } from "@trpc/server";

import { createInnerTRPCContext } from "../../api/trpc";
import { createUser } from "../utils/createUser";

describe("Restaurant API", () => {
  it("should create restaurant", async () => {
    const testUser = await createUser();

    const mockSession: Session = {
      expires: new Date().toISOString(),
      user: { id: testUser.id, name: testUser.name },
    };

    const input: inferProcedureInput<
      AppRouter["restaurant"]["createRestaurant"]
    > = {
      name: "Krusty Krab",
      address: "831 Bottom Feeder Lane",
      description: "best fastfood in the Bikini Bottom",
      currencyCode: "RUB",
      workingHours: "24hrs",
      logoUrl: "bla!",
      languageCode: "english",
    };

    const caller = appRouter.createCaller(
      //TODO: USE TEST ENV FOR DB PRISMA: prismaMock?
      createInnerTRPCContext({ session: mockSession })
    );

    const result = await caller.restaurant.createRestaurant(input);

    console.log("result: ", result);

    expect(result).toMatchObject({
      name: "Krusty Krab",
      address: "831 Bottom Feeder Lane",
      description: "best fastfood in the Bikini Bottom",
      currencyCode: "RUB",
      logoUrl: "bla!",
      workingHours: "24hrs",
    });
  });
});
