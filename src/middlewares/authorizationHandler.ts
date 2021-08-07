import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtService from "../services/JwtService";

const authorizationHandler = (req: Request, res: Response, next: NextFunction) => {
  const headerAuthorization = req.headers.authorization;
  if (!headerAuthorization) {
    return next(CustomErrorHandler.unAuthorization())
  }
  const token = headerAuthorization.split(' ')[1];
  try {
    const { _id, email, role } = JwtService.verify(token) as JwtPayload;
    const user = { _id, email, role }
    req.user = user;
    return next()
  } catch (err) {
    return next(CustomErrorHandler.unAuthorization())
  }
}

export default authorizationHandler;