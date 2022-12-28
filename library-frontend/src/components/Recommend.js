import { useQuery } from "@apollo/client"
import { USER } from "../user/graphql-queries"


const Recommendations = (props) => {
    const user = useQuery(USER)
    if (!props.show || !user.data) {
      return null
    }
    const userFavoriteGenre = user.data.me.favoriteGenre
    console.log(userFavoriteGenre)

    const books = props.result.data.allBooks
    console.log(books)
    const booksRecommended = books.filter(book => book.genres.includes(userFavoriteGenre))
    console.log('list of favorites books',booksRecommended)

    return (
        <div>
        <h2>Recommendations</h2>
         <p>books in your favorite genre <strong>pattern</strong></p>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
              </tr>
              {booksRecommended.map(f =>
                <tr key={f.title}>
                  <td>{f.title}</td>
                  <td>{f.author.name}</td>
                  <td>{f.published}</td>                 
                </tr>
                  )        
              }
            </tbody>
          </table>          
        </div>
      )


}

export default Recommendations