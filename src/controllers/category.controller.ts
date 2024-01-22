import { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import { Category } from "../models";
import { CategoryDocument } from "../models/category.model";
import CustomErrorHandler from "../services/CustomErrorHandler";
import categorySchema from '../validates/category.validate';

const categoryController = {
  categories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const _categories = await Category.find().select('-__v');
      return res.json({ data: _categories, status: 200, message: "Success" });
    } catch (err) {
      return next(CustomErrorHandler.serverError())
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    const { error } = categorySchema.validate(req.body);
    if (error) {
      return next(error)
    }
    const obj = new Category({
      name: req.body.name,
      parent: req.body.parent
    });
    try {
      if(req?.isSuperAdmin) {
        const category = await obj.save();
        return res.status(201).json({data: category, status: 201, message: 'Success! Category created by admin'})
      }
      const category = {
        _id: obj._id,
        name: obj.name,
        slug: slugify(obj.name, { lower: true }),
        parent: obj.parent
      }
      return res.status(201).json({data: category, status: 201, message: 'Success! Category created'})
    } catch(err) {
      return next(CustomErrorHandler.serverError())
    }
  },
  single: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await Category
        .findOne({slug: req.params.slug})
        .populate({ path: 'products', select: '-__v -category'})
        .select('-__v');
      if (!category) {
        return next(CustomErrorHandler.notFound('Category is not found!'))
      }
      return res.json({ data: category, status: 200, message: "Success! Category found" });
    } catch (err) {
      return next(CustomErrorHandler.serverError())
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    const { error } = categorySchema.validate(req.body);
    if (error) {
      return next(error)
    }
    const payload = {
      name: req.body.name,
      parent: req.body.parent
    };
    try {
      if(req?.isSuperAdmin) {
        const data = await Category.findOneAndUpdate({slug: req.params.slug}, payload, { new: true, useFindAndModify: false });
        return res.status(202).json({status: 202, message: 'Success! User updated by admin', data })
      }
      const category = await Category.findOne({ slug: req.params.slug }) as CategoryDocument; 
      const newCategory = {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        product: category?.products,
        parent: category?.parent,
        ...req.body
      }
      return res.status(202).json({data: newCategory, status: 202, message: 'Success! Category updated'})
    } catch(err) {
      return next(CustomErrorHandler.serverError())
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if(req?.isSuperAdmin) {
        const instance = await Category.findOneAndDelete({slug: req.params.slug})
        if (!instance) {
          return next(CustomErrorHandler.notFound('Category is not found!'))
        }
        return res.status(202).json({status: 202, message: 'Success! Category deleted by admin'})
      }
      const instance = await Category.find({slug: req.params.slug});
      if (!instance) {
        return next(CustomErrorHandler.notFound('Category is not found!'))
      }
      return res.status(202).json({status: 202, message: 'Success! Category deleted'})
     } catch (err) {
       return next(CustomErrorHandler.notFound('Category is not found!'))
     }
  },
}

export default categoryController;