import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from "axios"
import Note from "./Note.jsx" 
import Todo from "./Todo.jsx"

const fetchUser = async ()=> {
  const response = await axios.get("https://jsonplaceholder.typicode.com/users")
  return response.data
}

function App() {
  const {data,isLoading,isError,error} = useQuery({
    queryKey : ["user"],
    queryFn : fetchUser,
  })
  if(isLoading){
    return <p>loading...</p>
  }
  if(isError){
    return <p>{error.message}</p>
  }
  return (
    <div>
      <h1>users</h1>
      {data.map((item)=> < p key={item.id}>{item.name}</p>)}
      <br />
      <br />
      <h1>NOTE</h1>
      <Note />
      <Todo/>
    </div>
  )
}

export default App