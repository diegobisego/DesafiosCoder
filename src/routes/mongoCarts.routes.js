import mongoCarts from "./../dao/manager/mongo/mongoCarts.js";
import { Router } from "express";
const router = Router();

// nuevo carrito
const newCartsManager = new mongoCarts();

// delete product in cart
router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const result = await newCartsManager.deleteProductInCart(cid, pid);

    if (result.success) {
      return res.status(200).json({
        success: result.success,
        message: result.message,
      });
    }

    res.status(404).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error en la peticion: ${error}`,
    });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { stock } = req.body;
  
    const result = await newCartsManager.putProductInCart(cid,pid,stock);
  
    if (result.success) {
      return res.status(200).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    }
  
    res.status(404).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error(`Se produjo un error al obtener la ruta: ${error}`)
  }

});

// get carts
router.get("/", async (_req, res) => {
  const result = await newCartsManager.getCarts();

  if (result.success) {
    return res.status(200).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  res.status(404).json({
    success: result.success,
    message: result.message,
  });
});

// post carts
router.post("/", async (_req, res) => {
  const result = await newCartsManager.addCarts();

  if (result.success) {
    return res.status(201).json({
      success: result.success,
      message: result.message,
    });
  }

  res.status(404).json({
    success: result.success,
    message: result.message,
  });
});

// get carts by ID
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  const result = await newCartsManager.getCartsById(cid);

  if (result.success) {
    return res.status(200).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }
  res.status(404).json({
    success: result.success,
    message: result.message,
  });
});

// post product in carts
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const result = await newCartsManager.postProductsInCarts(cid, pid);

  if (result.success) {
    return res.status(200).json({
      success: result.success,
      message: result.message,
    });
  }

  res.status(404).json({
    success: result.success,
    message: result.message,
  });
});

// delete cart
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  const result = await newCartsManager.deleteCart(cid);

  if (result.success) {
    return res.status(204).send();
  }

  res.status(404).json({
    success: result.success,
    message: result.message,
  });
});

export default router;
