import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  # INPUTS
  input UserInput {
    username: String!
    email: String!
    password: String!
    displayName: String!
  }
  # TYPES
  type User {
    _id: ID
    username: String
    email: String
    password: String
    displayName: String
  }
  # SPECIAL TYPES
  type Query {
    hello: String
  }

  type Mutation {
    register(user: UserInput!): String
  }
`
