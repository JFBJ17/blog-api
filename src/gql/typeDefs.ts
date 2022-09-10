import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  scalar Date
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
    createdAt: Date
    updatedAt: Date
    author: User
    comments: [Comment]
  }
  type Comment {
    _id: ID
    comment: String
    user: User
    post: Post
  }
  # SPECIAL TYPES
  type Query {
    allUsers: [User]
    oneUser(_id: ID!): User
    allPosts: [Post]
    onePost(_id: ID!): Post
  }

  type Mutation {
    register(user: UserInput!): String
    login(email: String!, password: String!): String
    createPost(title: String!, body: String!): Post
    updatePost(_id: ID!, title: String!, body: String): Post
    deletePost(_id: ID!): String
    addComment(comment: String!, postId: ID!): Comment
  }
`
