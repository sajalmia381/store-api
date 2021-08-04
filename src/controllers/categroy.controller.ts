import { Request, Response, NextFunction } from "express";
import { Category } from "src/models";
import CustomErrorHandler from "src/services/CustomErrorHandler";

const categoryController = {
  categories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const _categories = await Category.find();
      return res.json({ status: 200, data: _categories });
    } catch (err) {
      return next(CustomErrorHandler.serverError())
    }
  },
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    
  },
  categoryDescription: async (req: Request, res: Response, next: NextFunction) => {
    res.json({status: 200})
  },
}