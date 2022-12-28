const { gql } = require('apollo-server')

const typeDefs = gql`

  type Author {
    name: String!
    id: ID!
    born: Int 
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type User {
    username: String!
    favoriteGenre: String!
    Id: ID!
  }

  type Token{
    value: String!
  }

  type Query {
    authorsCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String):[Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres:  [String!]!
    ): Book

    addAuthor (
      name: String!
      id: ID!
      born: Int
    ): Author

    editAuthor (
      name: String!
      born: Int!
    ): Author

    createUser (
      username: String!
      favoriteGenre: String!
    ): User

    login (
      username: String!
      password: String
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
  
 
`

module.exports = typeDefs