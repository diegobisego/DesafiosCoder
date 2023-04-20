import ProductManager from "./../manager/ProductManager.js";
import { Router } from 'express'
import { body, validationResult } from 'express-validator'
const router = Router()

const products = new ProductManager("src/db/products.json");


// obtener productos
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    let data = await products.getProducts();

    if (limit) {
      data = data.slice(0, limit);
    }

    res.status(200).json({
      success: true,
      messege: "Productos encontrados con exito",
      data: data,
    });
  } catch (error) {
    console.error(
      `Se verifica un error al intentar obtener los productos: ${error}`
    );
  }
});

// obtener 1 producto
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const data = await products.getProductById(pid);

    if (!data) {
      return res.status(404).json({
        success: false,
        messege: "No se encontro el producto solicitado",
      });
    }

    res.status(200).json({
      success: true,
      messege: "Se encontro el producto solicitado",
      data,
    });
  } catch (error) {
    console.error(
      `Se verifica un error al intentar obtener el producto: ${error}`
    );
  }
});

//agregar un productos
router.post('/', [
  body('title').notEmpty().withMessage('El campo title no puede estar vacío'),
  body('description').notEmpty().withMessage('El campo description no puede estar vacío'),
  body('code').notEmpty().withMessage('El campo code no puede estar vacío'),
  body('price').notEmpty().withMessage('El campo price no puede estar vacío'),
  body('category').notEmpty().withMessage('El campo category no puede estar vacío')
], async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body

    const result = await products.addProduct(title, description, code, price, stock, category, thumbnails)

    console.log(result)

    if (result.success) {
      res.status(200).json({
        success: true,
        messege: 'El producto se creo con exito'
      })
    } else {
      res.status(404).json({
        success: false,
        messege: `Se produjo un error al crear el producto: ${result.message}`
      })
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      messege: `Se produjo un error en la peticion: ${error}`
    })
  }
})

export default router