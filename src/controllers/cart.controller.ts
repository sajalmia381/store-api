import { NextFunction, Request, Response } from "express"

const cartController = {
  add: (req: Request, res: Response, next: NextFunction) => {
    res.json({status: 201, message: 'Success, Item is added'})
  },
  remove: (req: Request, res: Response, next: NextFunction) => {
    res.json({status: 202, message: 'Success, Item is removed'})
  },
  list: (req: Request, res: Response, next: NextFunction) => {
    res.json({status: 200, message: 'Success', data: []})
  },
  description: (req: Request, res: Response, next: NextFunction) => {
    res.json({status: 200, message: 'Success', data: {}})
  },
}

export default cartController