import { Router, Request, Response } from "express";
// import { Request, Response } from "express-serve-static-core";

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const path_name: string = res.req.originalUrl;
  console.log(req.protocol, req.hostname, req.baseUrl)
  res.render('index', { path_name })
})

router.get('/docs', (req: Request, res: Response) => {
  const path_name: string = res.req.originalUrl
  res.render('documentation', { path_name })
})

export default router;