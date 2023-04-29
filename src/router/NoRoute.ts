import { RequestNotFoundException } from '@/exception'
import { NextFunction, Request, Response } from 'express'

export default function (req: Request, res: Response, next: NextFunction) {
  next(new RequestNotFoundException())
}
