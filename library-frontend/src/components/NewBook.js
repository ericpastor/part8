import { useMutation } from '@apollo/client'
import { useState } from 'react'

import { CREATE_BOOK } from '../books/graphql-mutations'
import { ALL_BOOKS, ALL_AUTHORS } from '../books/graphql-queries'




const NewBook = (props, {setError, updateCacheWith}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [ { query: ALL_BOOKS }, { query:  ALL_AUTHORS }],
    
    update: (store, response) => {
      const dataInStore = store.readQuery({query: ALL_BOOKS}, { query:  ALL_AUTHORS })
      store.writeQuery({
        query: ALL_BOOKS,
        data: {
          ...dataInStore, 
          allBooks: [
            ...dataInStore.allBooks, 
            response.data.addBook

          ]
        }
      })
    }
   
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    createBook({variables: { title, author, genres, published}})

    console.log('add book...')

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
       <h2>Add Book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.valueAsNumber)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
