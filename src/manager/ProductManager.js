import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // methods

  // get products
  getProducts = async () => {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");

      const result = JSON.parse(products);

      if (!result == []) {
        return {
          success: true,
          message: "Productos obtenidos con exito",
          data: result,
        };
      }
      return {
        success: false,
        message: "No hay productos para mostrar",
      };
    } catch (error) {
      return {
        success: false,
        message: `Error en la peticion de productos: ${error}`,
      };
    }
  };

  // add products
  addProduct = async (
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails
  ) => {
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
            return {
              success: true,
              message: "Archivo y producto creado con exito",
            };
          })
          .catch((err) => {
            return {
              success: false,
              message: `Error al crear el archivo: ${err}`,
            };
          });
        return {
          success: true,
          message: 'Archivo creado con exito',
          data: result
        } ;
      }

      const result = await this.getProducts();
      const products = result.data;

      // verifica si el codigo existe
      const exist = products.some((value) => value.code == code);
      if (exist) {
        return {
          success: false,
          message: "El codigo de producto ya existe",
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
            success: true,
            message: "Producto creado con exito",
          };
        })
        .catch((err) => {
          return {
            success: false,
            message: `Hubo un error al intentar agregar el producto al archivo: ${err}`,
          };
        });
    } catch (error) {
      return {
        success: false,
        message: `Hubo un error en addProducts: ${error}`,
      };
    }
  };

  // get product by id
  getProductById = async (id) => {
    try {
      const result = await this.getProducts();
      const products = result.data;

      // verifica si el codigo existe
      const productFind = products.find((value) => value.id == id);

      // console.log(productFind)
      if (productFind) {
        return {
          success: true,
          message: "Producto encontrado con exito",
          data: productFind,
        };
      }

      return {
        success: false,
        message: "El producto no fue encontrado",
      };
    } catch (error) {
      return {
        success: false,
        message: `Error en la peticion del producto: ${error}`,
      };
    }
  };

  // update product
  updateProduct = async (id, object) => {
    //validamos que no contenga id el body
    if (object.hasOwnProperty("id")) {
      return {
        success: false,
        message: "No se puede modificar el ID del producto",
      };
    }

    try {
      const result = await this.getProducts();
      const products = result.data;

      const exist = products.some( value => value.id == id)

      if (!exist) {
        return {
          success: false,
          message: 'El producto con id indicado no existe',
        };
      }

      const newProducts = products.map((value) =>
        value.id == id ? { ...value, ...object } : value
      );

      return await fs.promises
        .writeFile(this.path, JSON.stringify(newProducts))
        .then(() => {
          return {
            success: true,
            message: "Producto actualizado con exito",
          };
        });
    } catch (error) {
      return {
        success: false,
        message: `Se produjo un error al intentar leer el archivo: ${error}`,
      };
    }
  };

  // delete product
  deleteProduct = async (pid) => {
    try {
      const result = await this.getProducts();
      const products = result.data;

      const exist = products.some(value => value.id == pid)

      if (!exist) {
        return {
          success: false,
          message: 'El producto a eliminar no se encuentra'
        }
      }

      const newProducts = products.filter((value) => value.id != pid);

      return await fs.promises
        .writeFile(this.path, JSON.stringify(newProducts))
        .then(() => {
          return {
            success: true,
            message: "Producto eliminado con exito",
          };
        });
    } catch (error) {
      return {
        success: false,
        message: "Hubo un error al eliminar el producto",
      };
    }
  };
}

export default ProductManager;
