import { Router } from "express";
const router = Router();

// health
router.get("/", (_req, res) => {
  res.status(200).send({
    success: true,
    messege: "UP",
  });
});

export default router;
