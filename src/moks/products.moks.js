import { faker } from "@faker-js/faker/locale/es_MX";

export const moksGenerateProducts = async () => {
    const productMocks = [];
    for (let i = 0; i < 100; i++) {
        const mokProduct = {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            code: faker.string.numeric(5),
            price: faker.commerce.price(),
            status: faker.datatype.boolean(),
            quantity: faker.string.numeric(10),
            category: faker.commerce.department(),
            thumbnails: [
              faker.image.urlPicsumPhotos(),
              faker.image.urlPicsumPhotos(),
              faker.image.urlPicsumPhotos(),
            ],
        }
        productMocks.push(mokProduct);
      }
  
    return productMocks;
}