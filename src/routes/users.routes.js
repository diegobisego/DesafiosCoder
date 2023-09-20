import { Router } from "express";
import upload from "../multer/documents.multer.js";
import usersControllers from "../controllers/users.controllers.js";

const router = Router();

// Ruta para cambiar el campo role a "premium"
router.get('/premium/:uid', usersControllers.changeRoleUser);

// Ruta para subir documentos
router.post('/:uid/documents', upload.array('documents', 5), usersControllers.uploadDocuments);

export default router;
