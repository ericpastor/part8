import { useLazyQuery, useQuery} from "@apollo/client"
import { useEffect, useState } from "react"
import { ALL_BOOKS, BOOKS_BY_GENRE } from "../books/graphql-queries"


const Books = (props) => {  
  const books = useQuery(ALL_BOOKS)
  const allSelected = props.result.data.allBooks

  const [getGenre, result] = useLazyQuery(BOOKS_BY_GENRE)
  const [genre, setGenre] = useState('all')

 
  
  useEffect(() => {
    if (result.data) {
      setGenre(result.data.allBooks)
    }
  }, [result])

  const genres = [...new Set(allSelected.flatMap((book) => book.genres))]
  console.log(genres)

  const chosenGenre = genre => {
    getGenre({ variables: {genre: genre}})
  }

  if (!props.show || !books.data) {
    return null
  }

  if (genre === 'all')

  return (
    <div>
      <h2>Books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {allSelected.map( a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
              
            </tr>
              )        
          }
        </tbody>
      </table>     
      <strong>genres: </strong>
      {genres.map(genre =>
        <button key={genre} onClick={() => chosenGenre(genre)}>{genre}</button>
      )} 
    </div>
  )


console.log(genre)

  if (genre !== 'all')
  
  return (
    <div>
      <h2>Books</h2>
     <strong>In genre pattern</strong>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>     
          </tr>
          {genre.map( g =>
            <tr key={g.title}>
              <td>{g.title}</td>
              <td>{g.author.name}</td>
              <td>{g.published}</td>            
            </tr>
              )        
          } 
          
        </tbody>
      </table>     
      <strong>genres: </strong>
      {genres.map(genre =>
        <button key={genre} onClick={() => chosenGenre(genre)}>{genre}</button>
      )}
      <button onClick={() => setGenre('all')}>all</button>
 
    </div>
  )
}

export default Books




// const [filter, setFilter] = useState('all')


  // if (!props.show) {
  //   return null
  // }

  // const books = props.result.data.allBooks
 
  // const genres = [...new Set(books.flatMap((book) => book.genres))].concat('all')
  // console.log(genres)
  // const booksByGenre = books.filter(book => filter === 'all' ? book : book.genres.includes(filter)) 
  // console.log(booksByGenre)
