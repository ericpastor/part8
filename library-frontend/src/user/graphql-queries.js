import { gql } from "@apollo/client"

export const USER = gql`
query {
    me {
      username
      favoriteGenre
    }
  }
`