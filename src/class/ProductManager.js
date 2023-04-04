import fs from "fs";
import path from "path";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // methods

  // add products
  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    // verifica si todos los campos estan completos
    for (const key in newProduct) {
      if (newProduct[key] == undefined) {
        throw new Error("Debe contar con todas las propiedades del objeto");
      }
    }

    // verificacion y save de producto
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);

      // verifica si el codigo existe
      const exist = products.some((value) => value.code == code);
      if (exist) {
        throw new Error("El codigo de producto ya existe");
      }

      const id = products.length + 1;

      products.push({ id, ...newProduct });

      const productsArray = JSON.stringify(products);

      await fs.promises
        .writeFile(this.path, productsArray)
        .then(() => console.log("El producto se agrego con exito"))
        .catch((err) =>
          console.error(`Hubo un error al intentar agregar el producto ${err}`)
        );
    } catch (error) {
      // si da error crea el archivo
      const arrayProducts = [];
      const id = 1;
      arrayProducts.push({ id, ...newProduct });

      await fs.promises
        .writeFile(this.path, JSON.stringify(arrayProducts))
        .then(() => console.log("El archivo se creó con éxito!"))
        .catch((err) =>
          console.error(
            `Se produjo un error al intentar agregar un producto: ${err}`
          )
        );
    }
  };

  // get products
  getProducts = async () => {
    const products = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(products);
  };

  // get product by id
  getProductById = async (id) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(data);

    // verifica si el codigo existe
    const productFind = products.find((value) => value.id == id);
    if (!productFind) {
      throw new Error("El producto no se encuentra dentro de la lista");
    }
    return productFind

  };

  // update product
  updateProduct = async (id,object) => {
    const products = await fs.promises.readFile(this.path, "utf-8");
  }






}

/*************** INSTRUCCIONES **********************/

// Colocar la ruta relativa deseada dentro de resolve('ruta deseada')
const filePath = path.resolve("src/class/db/products.json");

// ejecucion de clase
const prodManager = new ProductManager(filePath);
// prodManager.addProduct(
//   "producto1",
//   "producto descripcion 1",
//   "price 1",
//   "thumbnail 1",
//   "code 2",
//   "stock 1"
// );
// prodManager.getProducts();
prodManager.getProductById(4)
