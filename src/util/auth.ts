import jwt from 'jsonwebtoken'
import { CreateToken } from '../interfaces/user'

export function createJWToken (user: CreateToken): string {
  return jwt.sign({ user }, 'create user', { expiresIn: '1d' })
}
