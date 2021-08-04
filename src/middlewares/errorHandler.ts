import { Request, Response, NextFunction } from "express";
import { ValidationError } from "joi";
import { DEBUG_MODE } from "../config";

import CustomErrorHandler from "../services/CustomErrorHandler";


const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let data = {
    status: statusCode,
    message: 'Internal server error',
    ...(DEBUG_MODE === 'true' && { originalError: err.message, errorRef: "error From default" })
  }
  if (err instanceof ValidationError) {
    statusCode = 422;
    data = {
      status: statusCode,
      message: err.message,
      ...(DEBUG_MODE === 'true' && { errorRef: 'error from joi' })
    }
  }
  if (err instanceof CustomErrorHandler) {
    statusCode = err.status
    data = {
      status: statusCode,
      message: err.message,
      ...(DEBUG_MODE === 'true' && { errorRef: 'error from CustomErrorHandler' })
    }
  }
  res.status(statusCode).json(data);
}

export default errorHandler;