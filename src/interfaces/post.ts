import { Types } from 'mongoose'

export interface Post {
  _id: Types.ObjectId
  title: string
  body: string
  authorId: Types.ObjectId
}

export type CreatePost = Pick<Post, 'title' | 'body'>
