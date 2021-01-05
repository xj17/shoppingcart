import products from "./products.json";

export const getProducts = () => {
  return new Promise((resolve) => {
    resolve(products)
  });
};