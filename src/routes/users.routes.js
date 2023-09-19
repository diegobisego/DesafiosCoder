import { Router } from "express";
import usersControllers from "../controllers/users.controllers.js";
const router = Router();



router.get('/premium/:uid', usersControllers.changeRoleUser)





export default router