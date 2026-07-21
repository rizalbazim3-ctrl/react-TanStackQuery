import React,{useState} from 'react'
import axios from "axios"
import {useQuery} from "@tanstack/react-query"
import { useMutation,useQueryClient } from '@tanstack/react-query'

const fetchNotes = async ()=> {
    const response = await axios.get("http://localhost:3000/user")

    return response.data
}

const addnote = async (newNote)=>{
    const response = await axios.post("http://localhost:3000/user",newNote)

    return response.data
}

const removenote = async (id)=>{
    const response = await axios.delete(`http://localhost:3000/user/${id}`)
    return response.data
}

const editnote = async (id,note)=>{
    const response = await axios.patch(`http://localhost:3000/user/${id}`,{note : note})
    return response.data
}


function Note() {
    const [note,setNote] = useState("")
   const [editId, setEditId] = useState(null);
    const [btn,setBtn] = useState("add")

    const {data = [],isLoading,isError,error} = useQuery({
        queryKey : ["user"],
        queryFn : fetchNotes,
    })

    const query = useQueryClient() 


    const mutation = useMutation({
        mutationFn : addnote,

        onSuccess :()=> {
           query.invalidateQueries({
                queryKey : ["user"]
            })
        }
    })

    const deletemutation = useMutation({
        mutationFn : removenote,

        onSuccess : ()=>{
            query.invalidateQueries({
                queryKey : ["user"]
            })
        }
    })

    const editmutation = useMutation({
        mutationFn : ({id,note})=> editnote(id,note),

        onSuccess : ()=>{
            query.invalidateQueries({
            queryKey : ["user"]
        })
            setNote("")
            setEditId(null)
            setBtn("add")
        } 
    })


    const dlt = (id)=>{
        deletemutation.mutate(id)    }
    
    
        const edt = (id,selectedNote)=>{
        if(note !== ""){
            alert("something is typing in input box")
        }else{

        setBtn("update")
        setEditId(id)
        setNote(selectedNote)


        }
        
    }
  return (
    <div>
        <input type="text"  placeholder='enter your note'  value={note}
        onChange={(e)=> {
            setNote(e.target.value)
        }}/>
        <button onClick={()=>{
            if(note===""){
                alert("enter note")
                return;
            }
            if( btn === "update"){
                editmutation.mutate({
                id: editId,
                note: note
            });
            }else{
                 const newNote = {
                note,
                id : crypto.randomUUID()
            }
            mutation.mutate(newNote)
            setNote("")
            }
           
            
        }}>save</button>

        {isLoading && <h1>loading...</h1> }
        {isError &&  <h1>{error.message}</h1>}
        {
            data.map((item)=> <h4 key = {item.id}> {item.note}
            <br />
            <hr />
            <button onClick={()=> edt(item.id,item.note)} 
            >edit</button>
            <button onClick={()=> dlt(item.id)} 
            >delete</button></h4>)
        }
    </div>
  )
}

export default Note