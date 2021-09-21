import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import multer from "multer";
import path from "path";
import fs from 'fs';

import CustomErrorHandler from "../services/CustomErrorHandler";
import { Category, Product } from "../models";
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
	limits: {fileSize: 1000000 * 10}
}).single('image') // image is field name


const productController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
		 	const products = await Product.find()
			 	.populate({ path: 'createBy', select: '_id name role'})
				.populate({ path: 'category', select: '_id name slug'})
				.select('-__v')
				.sort({ createdAt: 'desc'})
			 res.json({data: products, status: 200, message: "Success"});
		} catch (err) {
			return next(err);
		}
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
			const productSchema = Joi.object({
				title: Joi.string().max(300).required(),
				price: Joi.number().required(),
				description: Joi.string().allow(''),
				category: Joi.string(),
				image: Joi.string().allow('')
			});
			const { error } = productSchema.validate(req.body);
			if (error) {
				return next(error);
			}
			const { title, price, category, description, image } = req.body;
			const instance = new Product({
				title,
				price,
				category,
				description: description || null,
				image,
				createBy: req?.user?._id || '612e48e3345dcc333ac6cb2b'
			})
			if (!req?.isSuperAdmin) {
				const product = {
					_id: instance._id,
					title,
					slug: slugify(title, { lower: true}),
					price,
					category,
					description: description || null,
					image,
					createBy: req?.user?._id || '6108fa46be4d6c8723fd4233'
				}
				return res.status(201).json({ data: product, status: 201, message: 'Success! product created'})
			}
			try {
				await instance.save( async (err, doc) => {
					if (err) return next(CustomErrorHandler.serverError(err.message));
					if (category) {
						await Category.updateOne({_id: doc.category}, {$push: { products: doc._id}});
					}
					res.status(201).json({ data: doc, status: 201, message: 'Success! product created by admin'})
				});
			} catch (err) {
				return next(err)
			}
		// })
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
				title: Joi.string().max(300),
				price: Joi.number(),
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
			try {
				const _product = await Product.findOne({slug: req.params.slug}) as ProductDocument
				if (!_product) {
					return res.status(406).json({status: 406, message: 'Product is not found!'})
				}
				if (!req?.isSuperAdmin) {
					const product = {
						"_id": _product._id,
            "title": _product.title,
            "price": _product.price,
            "category": _product.category,
            "description": _product.description,
            "image": _product.image,
            "createBy": _product.createBy,
            "createdAt": _product.createdAt,
            "updatedAt": _product.updatedAt,
            "slug": req.body?.title ? slugify(req.body.title, { lower: true }) : _product.slug,
						...req.body
					}
					if (filePath) {
						fs.unlink(`${appRoot}/${filePath}`, (err: any) => {
							if(err) {
								return next(CustomErrorHandler.serverError(err.message))
							}
						})
					}
					return res.status(201).json({ data: { ...product, ...req.body }, status: 201, message: 'Success! product updated'})
				}
				
				const product = await Product.findOneAndUpdate(
					{
						slug: req.params.slug
					},
					{
						$set: {
							...req.body
						}
					},
					{
						new: true,
						useFindAndModify: false
					}
				);
				res.status(201).json({ data: product, status: 201, message: 'Success! product updated by admin'})
			} catch (err: any) {
				return next(CustomErrorHandler.serverError(err))
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
		try {
		 	if(!req?.isSuperAdmin) {
				const instance = await Product.findOne({ slug: req.params.slug })
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
			await Category.updateMany({ '_id': instance.category }, { $pull: { products: instance._id } });
			return res.json({status: 202, message: 'Success! Product deleted by Admin'});
		} catch (err) {
			return next(CustomErrorHandler.serverError())
		}
	},
	
	bulkDestroy: async (req: Request, res: Response, next: NextFunction) => {
		try {
		 	if(!req?.isSuperAdmin) {
				return res.json({status: 202, message: 'Success! Product deleted'})
		 	}
			const slugs = req.params.slugs.split(',');
			console.log('slugs', slugs)
			const instance = await Product.deleteMany({ slug: { $in: slugs }})
			console.log('instance', instance)
			if (!instance) {
				return next(CustomErrorHandler.notFound('Product is not found!'))
			}
			// const imagePath = instance.image;
			// if (imagePath) {
			// 	fs.unlink(`${appRoot}/${imagePath}`, (err) => {
			// 		if (err) {
			// 				return next(CustomErrorHandler.serverError());
			// 		}
					
			// 	});
			// }
			// await Category.updateMany({ '_id': instance.category }, { $pull: { products: instance._id } });
			return res.json({status: 202, message: 'Success! Product deleted by Admin'});
		} catch (err) {
			return next(CustomErrorHandler.serverError())
		}
	}
}

export default productController;