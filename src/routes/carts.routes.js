import CartsManager from "./../dao/manager/CartsManager.js";
import { Router, json } from "express";
const router = Router();

//nuevo carrito
const newCartsManager = new CartsManager("src/db/carts.json");

//get carts
router.get("/", async (_req, res) => {
  const result = await newCartsManager.getCarts();
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  }

  res.status(404).json({
    success: false,
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

//post product in carts
router.post('/:cid/product/:pid', async (req,res) => {

  const { cid, pid } = req.params

  const result = await newCartsManager.postProductsInCarts(cid,pid)

  console.log(result)

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
