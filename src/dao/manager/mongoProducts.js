//mongoose
import productModel from "../../models/product.js";
import dotenv from "dotenv";
dotenv.config();

class ProductManager {
  constructor() {}

  // methods

  // get products
  getProducts = async (limit, page, sort) => {
    try {
      const limitOptions = limit || 10
      const skipCount = limit * (page - 1) || 0;
      const sortOptions = {};
  
      if (sort === 'asc' ) {
        sortOptions.price = 1; // Orden ascendente por precio
      } else if (sort === 'desc') {
        sortOptions.price = -1; // Orden descendente por precio
      }
  
      const totalProducts = await productModel.countDocuments();
      const result = await productModel
        .find()
        .sort(sortOptions)
        .skip(skipCount)
        .limit(limitOptions)
        .lean();

      // los parametros de respuesta
      const totalPages = Math.ceil(totalProducts / limit)  // total de paginas
      const actuallyPage = skipCount + 1
      const prevPage = actuallyPage - 1

      // verifica si la pagina seleccionada existe
      if (actuallyPage > totalPages) {
        return {
          success: false,
          message: 'La pagina seleccionada no existe'
        }
      }

      // comprueba si la pagina siguiente existe y setea el valor
      let nextPage = 0
      if (actuallyPage < totalPages) {
        nextPage = prevPage + 2
      } else {
        nextPage = -1
      }

      // comprueba si la pagina anterior existe y setea el estado
      let hasPrevPage = false
      if (prevPage > 0) {
        hasPrevPage = true
      }

      // comprueba si la pagina posterior existe y setea el estado
      let hasNextPage = false
      if (nextPage !== -1) {
        hasNextPage = true
      }
      
      // seteo link pagina previa
      let prevLink = ''
      if (hasPrevPage) {
        prevLink = `${process.env.URL_BASE}/${limit}/${prevPage}/${sort}` 
      } else {
        prevLink = null
      }

      // seteo link pagina posterior
      let nextLink = ''
      if (hasNextPage) {
        nextLink = `${process.env.URL_BASE}/${limit}/${nextPage}/${sort}` 
      } else {
        nextLink = null
      }
  
      if (result) {
        return {
          success: true,
          message: "Productos obtenidos con éxito",
          data: result,
          totalProducts: totalProducts,
          totalPages,
          prevPage,
          nextPage,
          page: actuallyPage,
          hasPrevPage,
          hasNextPage,
          prevLink,
          nextLink
        };
      }
  
      return {
        success: false,
        message: "No hay productos para mostrar",
      };
    } catch (error) {
      return {
        success: false,
        message: `Error en la petición de productos: ${error}`,
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

    try {
      //si no existe ningun productos
      const exist = await productModel.findOne({ code });

      if (exist) {
        return {
          success: false,
          message: "El codigo de producto ya existe",
        };
      }

      await productModel.create(newProduct);

      return {
        success: true,
        message: "Producto creado con exito",
      };
    } catch (error) {
      return {
        success: false,
        message: `Hubo un error en addProducts: ${error}`,
      };
    }
  };

  // get product by id
  getProductById = async (code) => {
    try {
      const exist = await productModel.findOne({ code });

      // console.log(productFind)
      if (exist) {
        return {
          success: true,
          message: "Producto encontrado con exito",
          data: exist,
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
  updateProduct = async (code, object) => {
    //validamos que no contenga id el body
    if (object.hasOwnProperty("_id")) {
      return {
        success: false,
        message: "No se puede modificar el ID del producto",
      };
    }

    try {
      const exist = await productModel.findOne({ code });

      if (!exist) {
        return {
          success: false,
          message: "El producto con codigo indicado no existe",
        };
      }

      await productModel.findOneAndUpdate({code}, object);

      return {
        success: true,
        message: "Producto actualizado con exito",
      };
    } catch (error) {
      return {
        success: false,
        message: `Se produjo un error al intentar leer el archivo: ${error}`,
      };
    }
  };

  // delete product
  deleteProduct = async (code) => {
    try {
      const exist = await productModel.findOneAndDelete({ code });

      if (exist) {
        return {
          success: true,
          message: "Producto eliminado con exito",
        };
      }

      return {
        success: false,
        message: "Producto no encontrado",
      };
    } catch (error) {
      return {
        success: false,
        message: "Hubo un error al eliminar el producto",
      };
    }
  };
}

export default ProductManager;
