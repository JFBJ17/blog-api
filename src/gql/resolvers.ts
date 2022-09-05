import { CreatePost, Post } from '../interfaces/post'
import { AddUser, CreateToken, Login } from '../interfaces/user'
import { models } from '../models'
import { createJWToken } from '../util/auth'

const { userModel, postModel } = models

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
    oneUser: async (_: unknown, args: { _id: string }) => {
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
    }
  },
  Post: {
    author: async (parent: Post) => {
      try {
        return userModel.findById(parent.authorId)
      } catch (error) {
        throw new Error(error as string)
      }
    }
  }
}
