import { gql } from "@apollo/client"

export const BOOK_ADDED = gql`
subscription {
    bookAdded {
      title
      genres
      author {
        born
        bookCount
      }
    }
  }
`