import { AddComment, Comment } from '../interfaces/comment'
import { CreatePost, Post, UpdatePost } from '../interfaces/post'
import { AddUser, CreateToken, Login, User } from '../interfaces/user'
import { models } from '../models'
import { createJWToken } from '../util/auth'

const { userModel, postModel, commentModel } = models

export const resolvers = {
  Query: {
    allUsers: async () => {
      try {
        const users = await userModel.find()
        return users
      } catch (error) {
        throw new Error(error as string)
      }
    },
    oneUser: async (_: unknown, args: Pick<User, '_id'>) => {
      try {
        const user = await userModel.findById(args._id)
        return user
      } catch (error) {
        throw new Error(error as string)
      }
    },
    allPosts: async () => {
      try {
        return await postModel.find()
      } catch (error) {
        throw new Error(error as string)
      }
    },
    onePost: async (_: unknown, args: Pick<Post, '_id'>) => {
      const post = await postModel.findById(args._id)
      return post
    },
    allComment: async () => {
      try {
        return await commentModel.find()
      } catch (error) {
        throw new Error(error as string)
      }
    },
    oneComment: async (_: unknown, args: Pick<Comment, '_id'>) => {
      try {
        return await commentModel.findById(args._id)
      } catch (error) {
        throw new Error(error as string)
      }
    }
  },
  Mutation: {
    register: async (_: unknown, args: { user: AddUser }): Promise<string> => {
      try {
        const { username, email, _id, displayName } = await userModel.create(
          args.user
        )
        const token = createJWToken({ _id, username, email, displayName })
        return token
      } catch (error) {
        throw new Error(error as string)
      }
    },
    login: async (_: unknown, args: Login): Promise<string> => {
      try {
        const user = await userModel
          .findOne({ email: args.email })
          .select('+password')

        if (!user) throw new Error('User not found')
        if (args.password !== user.password) throw new Error('Invalid password')
        const token = createJWToken({
          _id: user._id,
          username: user.username,
          email: user.email,
          displayName: user.displayName
        })
        return token
      } catch (error) {
        throw new Error(error as string)
      }
    },
    createPost: async (
      _: unknown,
      args: CreatePost,
      ctx: { verifiedUser: CreateToken }
    ) => {
      try {
        if (ctx.verifiedUser) {
          const post = new postModel({
            title: args.title,
            body: args.body,
            authorId: ctx.verifiedUser._id
          })
          await post.save()
          return post
        } else {
          throw new Error('Not authenticated')
        }
      } catch (error) {
        throw new Error(error as string)
      }
    },
    updatePost: async (
      _: unknown,
      args: UpdatePost,
      ctx: { verifiedUser: CreateToken }
    ) => {
      const { _id, body, title } = args
      try {
        if (!ctx.verifiedUser) throw new Error('Unauthorized')
        const updatedPost = await postModel.findOneAndUpdate(
          { _id, authorId: ctx.verifiedUser._id },
          { title, body },
          { new: true, runValidators: true }
        )
        return updatedPost
      } catch (error) {
        throw new Error(error as string)
      }
    },
    deletePost: async (
      _: unknown,
      args: Pick<Post, '_id'>,
      ctx: { verifiedUser: CreateToken }
    ) => {
      const { _id } = args
      try {
        if (!ctx.verifiedUser) throw new Error('Unauthorized')
        const deletedPost = await postModel.findByIdAndDelete({
          _id,
          authorId: ctx.verifiedUser._id
        })
        if (!deletedPost) throw new Error('Post not found')
        return 'Deleted post'
      } catch (error) {
        throw new Error(error as string)
      }
    },
    addComment: async (
      _: unknown,
      args: AddComment,
      ctx: { verifiedUser: CreateToken }
    ) => {
      const { comment, postId } = args
      try {
        const newComment = new commentModel({
          comment,
          postId,
          userId: ctx.verifiedUser._id
        })
        return await newComment.save()
      } catch (error) {
        throw new Error(error as string)
      }
    },
    updateComment: async (
      _: unknown,
      args: Pick<Comment, '_id' | 'comment'>,
      ctx: { verifiedUser: CreateToken }
    ) => {
      const { _id, comment } = args
      try {
        if (!ctx.verifiedUser) throw new Error('Unauthorized')
        const updateComment = await commentModel.findOneAndUpdate(
          { _id, userId: ctx.verifiedUser._id },
          { comment },
          { new: true, runValidators: true }
        )
        if (!updateComment) throw new Error('Comment not found')
        return updateComment
      } catch (error) {
        throw new Error(error as string)
      }
    },
    deleteComment: async (
      _: unknown,
      args: Pick<Comment, '_id'>,
      ctx: { verifiedUser: CreateToken }
    ) => {
      const { _id } = args
      try {
        if (!ctx.verifiedUser) throw new Error('Unauthorized')
        const deleteComment = await commentModel.findOneAndDelete({
          _id,
          userId: ctx.verifiedUser._id
        })
        if (!deleteComment) throw new Error('Comment not found')
        return 'Comment deleted'
      } catch (error) {
        throw new Error(error as string)
      }
    }
  },
  // SUBQUERIES
  Post: {
    author: async (parent: Post) => {
      try {
        return await userModel.findById(parent.authorId)
      } catch (error) {
        throw new Error(error as string)
      }
    },
    comments: async (parent: Post) => {
      try {
        return await commentModel.find({ postId: parent._id })
      } catch (error) {
        throw new Error(error as string)
      }
    }
  },
  Comment: {
    user: async (parent: Comment) => {
      try {
        return await userModel.findById(parent.userId)
      } catch (error) {
        throw new Error(error as string)
      }
    },
    post: async (parent: Comment) => {
      try {
        return await postModel.findById(parent.postId)
      } catch (error) {
        throw new Error(error as string)
      }
    }
  }
}
