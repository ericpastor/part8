import { gql } from "@apollo/client"

export const ALL_AUTHORS = gql`
query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
query {
    allBooks {
      title
      published
      genres
      author {
        name
      }
    }
  }
`

export const BOOKS_BY_GENRE = gql`
  query booksByGenre ($genre: String) {
    allBooks (genre: $genre) {
    title
    author {
      name
    }
    published
    }
  }
`