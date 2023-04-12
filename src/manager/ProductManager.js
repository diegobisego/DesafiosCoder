import fs from "fs";
import path from "path";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // methods

  // get products
  getProducts = async () => {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      // console.log(JSON.parse(products))
      return JSON.parse(products);
    } catch (error) {
      throw new Error(
        `Se produjo un error al intentar leer el archivo: ${error}`
      );
    }
  };

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
      const products = await this.getProducts();

      // verifica si el codigo existe
      const exist = products.some((value) => value.code == code);
      if (exist) {
        return console.error("El codigo de producto ya existe");
      }

      const id = products[products.length - 1].id + 1;

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

  // get product by id
  getProductById = async (id) => {
    try {
      const products = await this.getProducts();

      // verifica si el codigo existe
      const productFind = products.find((value) => value.id == id);
      
      // console.log(productFind)
      return productFind;
    } catch (error) {
      throw new Error(
        `Se produjo un error al intentar leer el archivo: ${error}`
      );
    }
  };

  // update product
  updateProduct = async (id, object) => {
    try {
      const products = await this.getProducts();

      const newProducts = products.map((value) =>
        value.id == id ? { ...value, ...object } : value
      );

      await fs.promises
        .writeFile(this.path, JSON.stringify(newProducts))
        .then("Producto actualizado con exito!");
    } catch (error) {
      throw new Error(
        `Se produjo un error al intentar leer el archivo: ${error}`
      );
    }
  };

  // delete product
  deleteProduct = async (id) => {
    try {
      const products = await this.getProducts();

      const newProducts = products.filter((value) => value.id != id);

      await fs.promises
        .writeFile(this.path, JSON.stringify(newProducts))
        .then("Producto eliminado con exito!");
    } catch (error) {
      throw new Error(
        `Se produjo un error al intentar leer el archivo: ${error}`
      );
    }
  };
}

/*************** INSTRUCCIONES **********************/

// Colocar la ruta relativa deseada dentro de resolve('ruta deseada')
// const filePath = path.resolve("src/class/db/products.json");

// // ejecucion de clase
// const prodManager = new ProductManager(filePath);

// // agregar un producto
// prodManager.addProduct(
//   "producto 1",
//   "producto descripcion 1",
//   "price 1",
//   "thumbnail 1",
//   "code 1",
//   "stock 1"
// );

// obtener todos los productos
// prodManager.getProducts();

// obtener un producto por id
// prodManager.getProductById(2)

// actualizar un producto por id
// prodManager.updateProduct(1, { stock: "123456" });

// eliminar un producto
// prodManager.deleteProduct(1)

export default ProductManager