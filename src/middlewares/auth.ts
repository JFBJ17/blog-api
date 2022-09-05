import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { JWTPayload } from '../interfaces/jwt'

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      const verified = jwt.verify(token, 'blogApi04092022') as JWTPayload
      req.verifiedUser = verified.user
    }
    next()
  } catch (error) {
    // console.log(error)
    next()
  }
}
