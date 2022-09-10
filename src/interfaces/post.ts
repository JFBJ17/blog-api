import { Types } from 'mongoose'

export interface Post {
  _id: Types.ObjectId
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
  authorId: Types.ObjectId
}

export type CreatePost = Pick<Post, 'title' | 'body'>
export type UpdatePost = Pick<Post, '_id' | 'title' | 'body'>
