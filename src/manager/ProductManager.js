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
  addProduct = async (title,description,code,price,stock,category,thumbnails) => {
    const newProduct = {
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || [],
    };
    // verificacion y save de producto
    try {
      
      //si no existe ningun productos
      if (!fs.existsSync(this.path)) {
         const arrayProducts = [];
         const id = 1;
         arrayProducts.push({ id, ...newProduct });
 
         const result = await fs.promises
           .writeFile(this.path, JSON.stringify(arrayProducts))
           .then(() => {
             return { success: true };
           })
           .catch((err) => {
             return {
               success: false,
               message: `Error al crear el archivo: ${err}`
             };
           });
        return result
      }

      const products = await this.getProducts();


      // verifica si el codigo existe
      const exist = products.some((value) => value.code == code);
      if (exist) {
        return {
          success: false,
          message: "El codigo de producto ya existe"
        };
      }

      //id del producto y push
      const id = products[products.length - 1].id + 1;
      products.push({ id, ...newProduct });
      const productsArray = JSON.stringify(products);

      //guardo en archivo
      return await fs.promises
        .writeFile(this.path, productsArray)
        .then(() => {
          return {
            success: true
          };
        })
        .catch((err) => {
          return {
            success: false,
            message: `Hubo un error al intentar agregar el producto al archivo: ${err}`
          };
        });      
      
    } catch (error) {
      return {
        success: false,
        message: `Hubo un error en addProducts: ${error}`
      };
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

    //validamos que no contenga id
    if (object.hasOwnProperty("id")) {
      return {
        success: false,
        message: 'No se puede modificar el ID del producto'
      };
    }

    try {
      const products = await this.getProducts();

      const newProducts = products.map((value) =>
        value.id == id ? { ...value, ...object } : value
      );

      return await fs.promises
        .writeFile(this.path, JSON.stringify(newProducts))
        .then(() => {
          return {
            success: true,
            message: 'Producto actualizado con exito'          
          }
        })
    } catch (error) {
      return {
        success: false,
        message: `Se produjo un error al intentar leer el archivo: ${error}`
      }
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

export default ProductManager;
