import { AddUser } from '../interfaces/user'
import { models } from '../models'
import { createJWToken } from '../util/auth'

export const resolvers = {
  Query: {
    hello: () => 'Hola mundo'
  },
  Mutation: {
    register: async (_: unknown, args: { user: AddUser }): Promise<string> => {
      const { userModel } = models
      const { username, email, _id, displayName } = await userModel.create(
        args.user
      )
      const token = createJWToken({ _id, username, email, displayName })
      return token
    }
  }
}
