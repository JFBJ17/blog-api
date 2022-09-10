import { Types } from 'mongoose'

export interface Comment {
  _id: Types.ObjectId
  comment: string
  userId: string
  postId: string
  createdAt: Date
  updatedAt: Date
}

export type AddComment = Pick<Comment, 'comment' | 'postId'>
