import { NextFunction, Request, Response } from "express"
import CustomErrorHandler from "../services/CustomErrorHandler"

const paginatedHandler = (model: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string)
    const limit = parseInt(req.query.limit as string)
    const sort = req.query.sort;

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results: any = {}

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
      results.results = await model.find().sort({createdAt: sort === 'desc' ? 'desc' : 'asc'}).limit(limit).skip(startIndex).exec()
      res.pagination = results
      next()
    } catch (err: any) {
      return CustomErrorHandler.serverError(err.message)
    }
  }
}

export default paginatedHandler