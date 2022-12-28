import { gql } from "@apollo/client";



export const CREATE_BOOK = gql`
mutation createBook( $title: String!, $author: String!, $published: Int!, $genres: [String!]! )
{
  addBook(
    title: $title
    author: $author
    published: $published
    genres: $genres
    ) {
      author {
        name
      }
      title
      genres
      published
  }
}
`

export const SET_BIRTHYEAR = gql`
mutation setBirthYear($name: String!, $born: Int!) 
{
  editAuthor(
    name: $name
    born: $born
    ) {
       name
       born
       id
  }
}
`