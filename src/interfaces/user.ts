import { Types } from 'mongoose'

export interface User {
  _id: Types.ObjectId
  username: string
  email: string
  password: string
  displayName: string
  createdAt: Date
  updatedAt: Date
}

export type AddUser = Omit<User, '_id' | 'createdAt' | 'updatedAt'>
export type CreateToken = Omit<User, 'createdAt' | 'updatedAt' | 'password'>
export type Login = Pick<User, 'email' | 'password'>
