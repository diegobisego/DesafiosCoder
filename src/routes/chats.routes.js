import { Router } from "express";
const router = Router();

// import MessageManager from 

router.get("/", async (req, res) => {
  try {
    res.render("chat");
  } catch (error) {
    console.error(`error al obtener productos: ${error}`);
  }
});

export default router;
