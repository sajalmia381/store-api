import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import JwtService from "../services/JwtService";

const attachUser = (req: Request, res: Response, next: NextFunction) => {
  const headerAuthorization = req.headers.authorization;
  if (headerAuthorization) {
    const token = headerAuthorization.split(' ')[1];
    try {
      const { _id, email, role } = JwtService.verify(token) as JwtPayload;
      const user = { _id, email, role }
      req.user = user;
      req.isSuperAdmin = user.role === 'ROLE_SUPER_ADMIN'
    } catch (err) {
      return next()
    }
  }
  return next()
}

export default attachUser;
