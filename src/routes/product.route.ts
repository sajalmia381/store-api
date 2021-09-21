import { Router } from "express";
import multer from "multer";
import path from "path";
import { productController } from "../controllers";
import attachUser from "../middlewares/attachUser";

const router = Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
		const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`; // 1e3 = 1000000
    cb(null, fileName)
  }
})

const handleImageUpload = multer({
	storage,
	limits: {fileSize: 1000000 * 10}
}).single('image') // image is field name


router.get('/', productController.list);

router.post('/', attachUser, productController.create);

router.get('/:slug', productController.description);

router.put('/:slug', attachUser, productController.update);

router.delete('/:slug', attachUser, productController.destroy);

router.delete('/bulk-delete/:slugs', attachUser, productController.bulkDestroy);

export default router;