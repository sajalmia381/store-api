import { Request, Response, NextFunction } from "express";
import logger from "../logger";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`method=${req.method}, uri=${req.originalUrl}, status=${res.statusCode} ip=${req.headers?.['x-forwarded-for'] || req.socket.remoteAddress}`) // , latency=6.238609ms
  return next()
}

export default loggerMiddleware;