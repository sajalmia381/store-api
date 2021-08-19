import { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import { Category } from "../models";
import CustomErrorHandler from "../services/CustomErrorHandler";
import categorySchema from '../validates/category.validate';

const categoryController = {
  categories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const _categories = await Category.find();
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
      if(req.isSuperAdmin) {
        const category = await obj.save();
        return res.json({data: category, status: 201, message: 'Success! Category created by admin'})
      }
      const category = {
        _id: obj._id,
        name: obj.name,
        slug: slugify(obj.name, { lower: true }),
        parent: obj.parent
      }
      return res.json({data: category, status: 201, message: 'Success! Category created'})
    } catch(err) {
      return next(CustomErrorHandler.serverError())
    }
  },
  single: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await Category.findOne({slug: req.params.slug});
      if(!category) {
        return next(CustomErrorHandler.notFound())
      }
      return res.json({ data: category, status: 200, message: "Success" });
    } catch (err) {
      return next(CustomErrorHandler.serverError())
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    const { error } = categorySchema.validate(req.body);
    if (error) {
      return next(error)
    }
    const obj = new Category({
      name: req.body.name,
      parent: req.body.parent
    });
    try {
      if(req.isSuperAdmin) {
        const category = await obj.save();
        return res.json({data: category, status: 201, message: 'Success! Category updated by admin'})
      }
      const category = {
        _id: obj._id,
        name: obj.name,
        slug: slugify(obj.name, { lower: true }),
        parent: obj.parent
      }
      return res.json({data: category, status: 201, message: 'Success! Category updated'})
    } catch(err) {
      return next(CustomErrorHandler.serverError())
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if(req.isSuperAdmin) {
        const instance = await Category.findOneAndDelete({slug: req.params.slug})
        if (!instance) {
          return next(CustomErrorHandler.notFound('Category is not found!'))
        }
        return res.json({status: 202, message: 'Success! Category deleted by admin'})
      }
      const instance = await Category.find({slug: req.params.slug});
      if (!instance) {
        return next(CustomErrorHandler.notFound('Category is not found!'))
      }
      return res.json({status: 202, message: 'Success! Category deleted'})
     } catch (err) {
       return next(CustomErrorHandler.notFound('Category is not found!'))
     }
  },
}

export default categoryController;