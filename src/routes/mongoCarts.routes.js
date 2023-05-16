import mongoCarts from "../manager/mongoCarts.js";
import { Router } from "express";
const router = Router();

//nuevo carrito
const newCartsManager = new mongoCarts("src/db/carts.json");

//get carts
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

//post carts
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

//get carts by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const result = await newCartsManager.getCartsById(id);

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

//post product in carts
router.post('/:cid/product/:pid', async (req,res) => {

  const { cid, pid } = req.params

  const result = await newCartsManager.postProductsInCarts(cid,pid)

  if (result.success) {
    return res.status(200).json({
      success: result.success,
      message: result.message
    })
  }

  res.status(404).json({
    success: result.success,
    message: result.message
  })

})

export default router;
