import { Request, Response, NextFunction } from "express";
import logger from "../logger";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`method=${req.method}, uri=${req.url}, status=${res.statusCode}`) // , latency=6.238609ms
  return next()
}

export default loggerMiddleware;