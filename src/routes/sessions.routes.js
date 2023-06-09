import { Router } from "express";
import userModel from "../dao/models/user.js";

const router = Router()


router.post('/register', (req, res) => {

    console.log(req)

})

export default router
