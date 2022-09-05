import jwt from 'jsonwebtoken'
import { CreateToken } from '../interfaces/user'

export function createJWToken (user: CreateToken): string {
  return jwt.sign({ user }, 'blogApi04092022', { expiresIn: '1d' })
}
