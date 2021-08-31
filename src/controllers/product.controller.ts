import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import multer from "multer";
import path from "path";
import fs from 'fs';

import CustomErrorHandler from "../services/CustomErrorHandler";
import { Product } from "../models";
import { appRoot } from "../config";
import slugify from "slugify";


const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
		const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`; // 1e3 = 1000000
    cb(null, fileName)
  }
})

const handleMultiPartData = multer({
	storage,
	limits: {fileSize: 1000000 * 10}
}).single('image') // image is field name


const productController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
		 	const products = await Product.find().populate({ path:'createBy', select: "_id name role" }).select('-__v')
			 res.json({data: products, status: 200, message: "Success"});
		} catch (err) {
			return next(err);
		}
  },
  create: (req: Request, res: Response, next: NextFunction) => {
    handleMultiPartData(req, res, async (err) => {
			if (err) {
				return next(CustomErrorHandler.serverError(err.message))
			}
			let filePath;
			if (req.file) {
				filePath = req.file.path;
			}
			const productSchema = Joi.object({
				title: Joi.string().max(300).required(),
				price: Joi.number().required(),
				description: Joi.string(),
				category: Joi.string(),
			});
			const { error } = productSchema.validate(req.body);
			if (error) {
				if (filePath) {
					fs.unlink(`${appRoot}/${filePath}`, (err: any) => {
						if(err) {
							return next(CustomErrorHandler.serverError(err.message))
						}
					})
				}
				return next(error);
			}
			const { title, price, category, description } = req.body;
			if (!req?.isSuperAdmin) {
				const product = {
					_id: '61114e63f1ee4b3cdd819654',
					title,
					slug: slugify(title, { lower: true}),
					price,
					category,
					description,
					image: filePath || null,
					createBy: '6108fa46be4d6c8723fd4233'
				}
				if (filePath) {
					fs.unlink(`${appRoot}/${filePath}`, (err: any) => {
						if(err) {
							return next(CustomErrorHandler.serverError(err.message))
						}
					})
				}
				return res.status(201).json({ data: product, status: 201, message: 'Success! product created'})
			}
			const instance = new Product({
				title,
				price,
				category,
				description: description || null,
				image: filePath || null,
				createBy: req.user._id
			})
			try {
				const product = await instance.save();
				res.status(201).json({ data: product, status: 201, message: 'Success! product created by admin'})
			} catch (err) {
				return next(err)
			}
		})
  },
	update: (req: Request, res: Response, next: NextFunction) => {
		handleMultiPartData(req, res, async (err) => {
			if (err) {
				return next(CustomErrorHandler.serverError(err.message))
			}
			let filePath;
			if (req.file) {
				filePath = req.file.path;
			}
			const productSchema = Joi.object({
				title: Joi.string().max(300).required(),
				price: Joi.number().required(),
				description: Joi.string(),
				category: Joi.string(),
			});
			const { error } = productSchema.validate(req.body);
			if (error) {
				if (filePath) {
					fs.unlink(`${appRoot}/${filePath}`, (err: any) => {
						if(err) {
							return next(CustomErrorHandler.serverError(err.message))
						}
					})
				}
				return next(error);
			}
			const { title, price, category, description } = req.body;
			if (!req?.isSuperAdmin) {
				const product = {
					_id: '61114e63f1ee4b3cdd819654',
					title,
					slug: slugify(title, { lower: true}),
					price,
					category: category || null,
					description: description || null,
					image: filePath || null,
					createBy: '6108fa46be4d6c8723fd4233'
				}
				if (filePath) {
					fs.unlink(`${appRoot}/${filePath}`, (err: any) => {
						if(err) {
							return next(CustomErrorHandler.serverError(err.message))
						}
					})
				}
				return res.status(201).json({ data: product, status: 201, message: 'Success! product updated'})
			}
			try {
				const product = await Product.findOneAndUpdate(
					{
						slug: req.params.slug
					},
					{
						title,
						price,
						category,
						description: description,
						...(req.file && { image: filePath }),
					},
					{
						new: true
					}
				);
				res.status(201).json({ data: product, status: 201, message: 'Success! product updated by admin'})
			} catch (err) {
				return next(err)
			}
		})
	},
	description: async (req: Request, res: Response, next: NextFunction) => {
		const slug = req.params.slug;
		try {
			const product = await Product
				.findOne({slug})
				.populate({path:'createBy', select: "_id name role"})
				.select('-__v');
			if(!product) {
				return res.status(404).json({status: 404, message: 'Product is not found!'})
			}
			res.json({status: 200, data: product})
		} catch (err) {
			return res.status(404).json({status: 404, message: 'Product is not found!'})
		}
	},
	destroy: async (req: Request, res: Response, next: NextFunction) => {
		console.log(req?.isSuperAdmin)
		try {
		 	if(!req?.isSuperAdmin) {
				const instance = await Product.findOne({slug: req.params.slug})
				if (!instance) {
					return next(CustomErrorHandler.notFound('Product is not found!'))
				}
				return res.json({status: 202, message: 'Success! Product deleted'})
		 	}
			const instance = await Product.findOneAndDelete({slug: req.params.slug})
			if (!instance) {
				return next(CustomErrorHandler.notFound('Product is not found!'))
			}
			const imagePath = instance.image;
			if (imagePath) {
				fs.unlink(`${appRoot}/${imagePath}`, (err) => {
					if (err) {
							return next(CustomErrorHandler.serverError());
					}
					
				});
			}
			return res.json({status: 202, message: 'Success! Product deleted by Admin'});
		} catch (err) {
			return next(CustomErrorHandler.serverError())
		}
		 
	 }
}

export default productController;