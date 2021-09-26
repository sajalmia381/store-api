import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import multer from "multer";
import path from "path";
import fs from 'fs';

import CustomErrorHandler from "../services/CustomErrorHandler";
import { Image } from "../models";
import { appRoot } from "../config";
import slugify from "slugify";
import { ProductDocument } from "../models/product.model";


const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
	filename: (req, file, cb) => {
		const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`; // 1e3 = 1000000
		cb(null, fileName)
	}
})

const handleMultiPartData = multer({
	storage,
	limits: { fileSize: 1000000 * 10 }
}).single('image') // image is field name


const imageController = {
	list: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const images = await Image.find()
				.select('-__v')
				.sort({ createdAt: 'desc' })
			res.json({ data: images, status: 200, message: "Success" });
		} catch (err) {
			return next(err);
		}
	},
	create: async (req: Request, res: Response, next: NextFunction) => {
		console.log(req.file)
		try {
			const file: any = req.file;
			const image = await Image.create({
				name: file?.originalname || file?.filename,
				size: file.size,
				type: file?.mimetype,
				// dimensions?: string,
				webUrl: file?.path,
			})
			res.json({ data: image, status: 201, message: 'Success! image created by admin' })
		} catch (err) {
			return next(err)
		}
	},
	destroy: async (req: Request, res: Response, next: NextFunction) => {
		const id = req.params.id;
		try {
			const instance = await Image.findOneAndDelete({ _id: id })
			if (!instance) {
				return next(CustomErrorHandler.notFound('Image is not found!'))
			}
			// const imagePath = instance.webUrl;
			// if (imagePath) {
			// 	fs.unlink(`${appRoot}/${imagePath}`, (err) => {
			// 		if (err) {
			// 			return next(CustomErrorHandler.serverError());
			// 		}
			// 	});
			// }
			return res.json({ status: 202, message: 'Success! Image deleted by Admin' });
		} catch (err) {
			return next(CustomErrorHandler.serverError())
		}
	},
	// bulkDestroy: async (req: Request, res: Response, next: NextFunction) => {
	// 	try {
	// 	 	if(!req?.isSuperAdmin) {
	// 			return res.json({status: 202, message: 'Success! Product deleted'})
	// 	 	}
	// 		const slugs = req.params.slugs.split(',');
	// 		console.log('slugs', slugs)
	// 		const instance = await Product.deleteMany({ slug: { $in: slugs }})
	// 		console.log('instance', instance)
	// 		if (!instance) {
	// 			return next(CustomErrorHandler.notFound('Product is not found!'))
	// 		}
	// 		// const imagePath = instance.image;
	// 		// if (imagePath) {
	// 		// 	fs.unlink(`${appRoot}/${imagePath}`, (err) => {
	// 		// 		if (err) {
	// 		// 				return next(CustomErrorHandler.serverError());
	// 		// 		}

	// 		// 	});
	// 		// }
	// 		// await Category.updateMany({ '_id': instance.category }, { $pull: { products: instance._id } });
	// 		return res.json({status: 202, message: 'Success! Product deleted by Admin'});
	// 	} catch (err) {
	// 		return next(CustomErrorHandler.serverError())
	// 	}
	// }
}

export default imageController;