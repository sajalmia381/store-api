import { Request, Response, NextFunction } from "express";
import { DEBUG_MODE } from "../../config";


const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let data = {
    status: statusCode,
    message: 'Internal server error',
    ...(DEBUG_MODE === 'true' && { originalError: err.message1 })
  }
  res.status(statusCode).send(data);
}

export default errorHandler;