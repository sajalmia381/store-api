import { Router } from "express";
import multer from "multer";
import path from "path";
import { imageController } from "../controllers";
import attachUser from "../middlewares/attachUser";
import authorizationHandler from "../middlewares/authorizationHandler";

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
	limits: { fileSize: 1000000 * 10 }
}).single('image') // image is field name


router.get('/', imageController.list);

router.post('/', [authorizationHandler, handleImageUpload], imageController.create);

// router.get('/:id', imageController.description);

router.delete('/:id', authorizationHandler, imageController.destroy);

// router.delete('/bulk-delete/:id', attachUser, imageController.bulkDestroy);

export default router;