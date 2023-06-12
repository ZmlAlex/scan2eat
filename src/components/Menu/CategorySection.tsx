import React from "react";

const CategorySection = ({
  products,
  category,
  setSelectedCategory,
}: {
  products: { name: string; description: string; url: string; price: string }[];
  category: string;
  setSelectedCategory: (category: string) => void;
}) => {
  return (
    <section key={category}>
      <h2 className="mb-4 text-3xl">{category}</h2>
      {/* TODO: USE INTERSECTION HOOK TO UPDATE VALUE */}
      <div
        id={category}
        className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6"
      >
        {products
          .filter((product) => product.category === category)
          .map((product, index) => (
            <div
              key={index}
              className=" cursor-pointer overflow-hidden rounded-2xl "
            >
              <div className="relative">
                {/* //TODO: IMPLEMENT VIA IMAGE COMPONENT */}
                <img src={product.url} alt="food" />
              </div>
              <div className="rounded-b-2xl border px-2  py-4 ">
                <p className="mb-1 text-xl">{product.price}</p>

                <p className="mb-3">{product.name}</p>
                <p>300 g</p>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default CategorySection;
