import type { appRouter, AppRouter } from "../../api/root";
import { type inferProcedureInput } from "@trpc/server";
import { createUser } from "../helpers/createUser";
import { createRestaurant } from "../helpers/createRestaurant";
import { createProtectedCaller } from "../helpers/protectedCaller";
import { createCategory } from "../helpers/createCategory";
import { createProduct } from "../helpers/createProduct";
import { type User } from "@prisma/client";

//TODO: MOVE IT TO THE MOCKS
const createRestaurantInput: inferProcedureInput<
  AppRouter["restaurant"]["createRestaurant"]
> = {
  name: "Krusty Krab",
  address: "831 Bottom Feeder Lane",
  description: "best fastfood in the Bikini Bottom",
  currencyCode: "RUB",
  workingHours: "24hrs",
  logoUrl: "mockUrl",
  languageCode: "english",
};

type TestCaller = ReturnType<typeof appRouter.createCaller>;

describe("Product API", () => {
  let testUser: User;
  let caller: TestCaller;

  beforeEach(async () => {
    testUser = await createUser();
    caller = createProtectedCaller(testUser);
  });
  it("should create product", async () => {
    const testRestaurant = await createRestaurant(
      testUser.id,
      createRestaurantInput
    );

    const testCategory = await createCategory({
      menuId: testRestaurant.menu[0]?.id as string,
      name: "juices",
      languageCode: "english",
    });

    const createProductInput: inferProcedureInput<
      AppRouter["product"]["createProduct"]
    > = {
      menuId: testRestaurant.menu[0]?.id as string,
      categoryId: testCategory.id,
      name: "apple juice",
      description: "amazing fresh drink",
      price: 1000,
      languageCode: "english",
      measurmentUnit: "ml.",
      measurmentValue: "250",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    };

    const {
      menu: { product },
    } = await caller.product.createProduct(createProductInput);

    expect(product?.[0]).toMatchObject({
      name: "apple juice",
      description: "amazing fresh drink",
      price: 1000,
      isEnabled: true,
      imageUrl: expect.stringContaining("cloudinary") as string,
    });
  });

  describe("When product is updated by id", () => {
    it("should return product with new data and old imageUrl", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const testCategory = await createCategory({
        menuId: testRestaurant.menu[0]?.id as string,
        name: "juices",
        languageCode: "english",
      });

      const testProduct = await createProduct({
        menuId: testRestaurant.menu[0]?.id as string,
        categoryId: testCategory.id,
        name: "apple juice",
        description: "amazing fresh drink",
        price: 1000,
        languageCode: "english",
        measurmentUnit: "ml.",
        measurmentValue: "250",
        imageUrl: "mockUrl",
      });

      const updateProductInput: inferProcedureInput<
        AppRouter["product"]["updateProduct"]
      > = {
        productId: testProduct.id,
        name: "orange juice",
        price: 1500,
        description: "amazing fresh drink",
        languageCode: "english",
        imageUrl: undefined,
        isEnabled: true,
      };

      const {
        menu: { product },
      } = await caller.product.updateProduct(updateProductInput);

      expect(product?.[0]).toMatchObject({
        name: "orange juice",
        price: 1500,
        description: "amazing fresh drink",
        imageUrl: "mockUrl",
        isEnabled: true,
      });
    });

    it("should return product with new data and new imageUrl", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const testCategory = await createCategory({
        menuId: testRestaurant.menu[0]?.id as string,
        name: "juices",
        languageCode: "english",
      });

      const testProduct = await createProduct({
        menuId: testRestaurant.menu[0]?.id as string,
        categoryId: testCategory.id,
        name: "apple juice",
        description: "amazing fresh drink",
        price: 1000,
        languageCode: "english",
        measurmentUnit: "ml.",
        measurmentValue: "250",
        imageUrl: "originalUrl",
      });

      const updateProductInput: inferProcedureInput<
        AppRouter["product"]["updateProduct"]
      > = {
        productId: testProduct.id,
        name: "orange juice",
        price: 1500,
        description: "amazing fresh drink",
        languageCode: "english",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
        isEnabled: true,
      };

      const {
        menu: { product },
      } = await caller.product.updateProduct(updateProductInput);

      expect(product?.[0]).toMatchObject({
        name: "orange juice",
        price: 1500,
        description: "amazing fresh drink",
        imageUrl: expect.not.stringContaining("originalUrl") as string,
        isEnabled: true,
      });
    });
  });

  it("should delete product by id", async () => {
    const testRestaurant = await createRestaurant(
      testUser.id,
      createRestaurantInput
    );

    const testCategory = await createCategory({
      menuId: testRestaurant.menu[0]?.id as string,
      name: "juices",
      languageCode: "english",
    });

    await createCategory({
      menuId: testRestaurant.menu[0]?.id as string,
      name: "soups",
      languageCode: "english",
    });

    const testProduct = await createProduct({
      menuId: testRestaurant.menu[0]?.id as string,
      categoryId: testCategory.id,
      name: "apple juice",
      description: "amazing fresh drink",
      price: 1000,
      languageCode: "english",
      measurmentUnit: "ml.",
      measurmentValue: "250",
      imageUrl: "mockUrl",
    });

    const input: inferProcedureInput<AppRouter["product"]["deleteProduct"]> = {
      productId: testProduct.id,
    };

    const {
      menu: { product },
    } = await caller.product.deleteProduct(input);

    expect(product).toHaveLength(0);
  });

  //TODO: DESCRIBE WITH ERROR CASES
});
