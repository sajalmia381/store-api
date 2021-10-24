import { NextFunction, Request, Response } from "express"
import Joi from "joi"
import { Cart } from "../models"
import CustomErrorHandler from "../services/CustomErrorHandler"

const cartController = {
  add: (req: Request, res: Response, next: NextFunction) => {
    const scheme = Joi.object({
      
    })
    res.json({status: 201, message: 'Success, Item is added'})
  },
  remove: (req: Request, res: Response, next: NextFunction) => {
    res.json({status: 202, message: 'Success, Item is removed'})
  },
  
  
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const carts = await Cart.find({});
      res.json({status: 200, message: 'Success, Cart list', data: carts})
    } catch (err) {
      return next(err)
    }
  },
  description: async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const cart = await Cart.find({_id: id});
      if (!cart) {
        return next(CustomErrorHandler.notFound('Cart is not found!'))
      }
      res.json({status: 200, message: 'Success, Cart list', data: cart})
    } catch (err) {
      return next(err)
    }
  },
}

export default cartController