import multer from "multer";
import path from "path";

// Configuración de Multer para almacenar archivos en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = req.body.fileType; // Asume que tienes un campo en el formulario que indica el tipo de archivo (profile, product, document)

    let uploadFolder = 'uploads/';

    // Determina la carpeta de destino según el tipo de archivo
    if (fileType === 'profile') {
      uploadFolder += 'profiles/';
    } else if (fileType === 'product') {
      uploadFolder += 'products/';
    } else if (fileType === 'document') {
      uploadFolder += 'documents/';
    } else {
      // Tipo de archivo desconocido o no proporcionado
      return cb(new Error('Tipo de archivo no válido'));
    }

    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const originalname = file.originalname;
    const extension = path.extname(originalname);
    const filename = `${Date.now()}${extension}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

export default upload;
