import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import Select from 'react-select'


import { SET_BIRTHYEAR } from '../books/graphql-mutations'
import { ALL_AUTHORS } from '../books/graphql-queries'

export const SetBirthYear = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  

  const [ editAuthor ] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query:  ALL_AUTHORS }]
  })

  

  const submit = async (event) => {
    event.preventDefault()

    editAuthor({variables: {name: name.value, born: born}})

    setName('')
    setBorn('')
  
  }

  const authors = useQuery(ALL_AUTHORS)
  const options = authors.data.allAuthors.map((author) => ({value: author.name, label: author.name}))
  console.log(options)
  console.log(name)

  


  return (
    <div>
    <h2>Set Birth Year</h2>
      <form onSubmit={submit}>
        <div>
          Name
          <Select 
            defaultValue={name}
            onChange={setName}
            options={options}
            
          />
        </div>
        <div>
          Born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.valueAsNumber)}
          />
        </div>
        <button type="submit">set year</button>
        </form>
    </div>
  )
}

