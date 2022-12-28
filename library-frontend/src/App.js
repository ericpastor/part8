import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useApolloClient, useQuery, useSubscription} from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS } from './books/graphql-queries'
import { BOOK_ADDED } from './books/graphql-subscriptions'

import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommend'



const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return <div style={{ color: 'red' }}>{errorMessage}</div>
}



const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)


  
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map((b) => b.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }   
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

 
  if (authors.loading) return <div>loading...</div>

  if(authors.error) return 
    <span style={{ color: "red" }}>
      {authors.error}
    </span>
  
  if (books.loading) return <div>loading...</div>

  if(books.error) return 
    <span style={{ color: "red" }}>
      {books.error}
    </span>

  const logout = () => {
    setToken(null)
    localStorage.clear()
      try {
       client.resetStore();
      } catch (e) {
       console.error('error clearing store');
      }
    
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={notify} />
      </>
    )
  }


  return (
    <div>
       <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token 
        ? 
          <>
            <button onClick={() => setPage('add')}>add book</button> 
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>  
        :
        <LoginForm setToken={setToken}></LoginForm>

        }
      </div>

  
      <Authors  show={page === 'authors'}  result={authors} />   

      <Books show={page === 'books'} result={books}/>

      <NewBook show={page === 'add'} />

      <Recommendations show={page === 'recommend'} result={books}  />

      
    </div>
  )
}

export default App
