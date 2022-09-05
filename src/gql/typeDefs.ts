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
    displayName: String
  }
  type Post {
    _id: ID
    title: String
    body: String
    author: User
  }
  # SPECIAL TYPES
  type Query {
    allUsers: [User]
    oneUser(_id: String!): User
    allPosts: [Post]
  }

  type Mutation {
    register(user: UserInput!): String
    login(email: String!, password: String!): String
    createPost(title: String!, body: String!): Post
  }
`
