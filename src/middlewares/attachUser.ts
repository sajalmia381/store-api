import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import JwtService from "../services/JwtService";

const attachUser = (req: Request, res: Response, next: NextFunction) => {
  const headerAuthorization = req.headers.authorization;
  if (headerAuthorization) {
    const token = headerAuthorization.split(' ')[1];
    try {
      const { data } = JwtService.verify(token) as JwtPayload;
      req.user = data;
      req.isSuperAdmin = data.role === 'ROLE_SUPER_ADMIN'
    } catch (err) {
      console.log('user attach err: ', err)
      return next()
    }
  }
  return next()
}

export default attachUser;
