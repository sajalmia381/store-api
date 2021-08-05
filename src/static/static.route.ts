import { Router } from "express";
import { Request, Response } from "express-serve-static-core";

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index')
})

router.get('/docs', (req: Request, res: Response) => {
  res.render('documentation')
})

export default router;