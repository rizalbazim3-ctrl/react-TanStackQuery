import React,{useState} from 'react'
import {useQuery,useMutation, useQueryClient} from "@tanstack/react-query"
import axios from "axios"

const addnote = async (newNote)=> {
    const response = await axios.post("http://localhost:3000/user",newNote)

    return response.data
}
const fetchnote = async()=> {
    const response = await axios.get("http://localhost:3000/user")

    return response.data
}
const removenote = async (id)=>{
    const response =await axios.delete(`http://localhost:3000/user/${id}`)
    return response.data
}
const editnote = async (id,note)=> {
    const response = await axios.patch(`http://localhost:3000/user/${id}`,{
        note : note
    })
}


function Todo() {
    const [note,setNote] = useState("")
    const [editid,setEditid] = useState(null)
    const [btn,setbtn] = useState("save")

    const {data = [],
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey : ["todo"],
        queryFn : fetchnote

    })

    const query = useQueryClient()
    const addmutation = useMutation({
        mutationFn : addnote,

        onSuccess : query.invalidateQueries({
                queryKey : ["todo"]
            })
    })

    const removemutation = useMutation({
        mutationFn : removenote,

        onSuccess : ()=> {
            query.invalidateQueries({
                queryKey : ["todo"]
            })
        }
    })

    const editmutation = useMutation({
        mutationFn : ({id,note})=> editnote(id,note),

        onSuccess : ()=>{
           query.invalidateQueries({ 
            queryKey : ["todo"]
        })
        setEditid(null)
        setNote("")
        setbtn("add")
        }
    })

    const handleadd = ()=>{
        if(note === ""){
            alert("type note")
            return ;
        }
        if(btn === "update"){
            editmutation.mutate({
                    id : editid,
                    note : note
                })

        }else{
            const newNote = {
                note,
                id : crypto.randomUUID()
            }

            addmutation.mutate(newNote)
            setNote("")
            setNote('add')
        }
    }

   
  return (
    <div>
        <input type="text" placeholder='type your note...' value={note} onChange={(e)=> setNote(e.target.value)}
        />
        <button onClick={handleadd}>{btn}</button>
         {isLoading &&
         <p>loading...</p>
        }
        {isError && 
        <p>{error}</p>
        }
        {data.map((item)=> <p key = {item.id}> {item.note}
            <br />
            <button onClick={()=>{
                setEditid(item.id)
                setNote(item.note)
                setbtn("update")
            }}
            >edit</button>
            <button onClick={()=> {
                removemutation.mutate(item.id)
            }} 
            >delete</button>
        </p>)}
    </div>
  )
}

export default Todo