import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'

const CreateReceta = ()=>{
    const history = useHistory()
    const [title,setTitle] = useState("")
    const [ingredient,setIngredient] = useState("")
    const [prepare,setPrepare] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{
        if(url){
            fetch("/createreceta",{
                method:"post",
                headers:{
                    "content-type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    ingredient,
                    prepare,
                    pic:url
                })
            }).then(res=>res.json())
            .then(data=>{ 
                console.log(data)
                if (data.error) {
                    M.toast({html: data.error, classes:"#c62828 red darken-3"})
                }
                else{
                    M.toast({html:"Receta agregada", classes:"#76ff03 light-green accent-3"})
                    history.push('/')
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    },[url])

    const postDetails = ()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset", "Cheefsy-Food")
        data.append("cloud_name","dlgsp6q75")
        fetch("https://api.cloudinary.com/v1_1/dlgsp6q75/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
        
    }
    return(
        <div className="card input-filed"
        style={{
            margin: "30px auto",
            maxWidth: "500px",
            padding:"20px",
            textAlign: "center"
        }}
        >
            <input
            type ="text"
            placeholder="Titulo"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            />
            <h6 style={{textAlign:"left"}}>ingredientes</h6>
            <div className="input-field col s12">
                <textarea className="materialize-textarea" value={ingredient} onChange={(e)=>setIngredient(e.target.value)}></textarea>
                
            </div>
            <h6 style={{textAlign:"left"}}>preparacion</h6>
            <div className="input-field col s12">
                <textarea className="materialize-textarea"value={prepare} onChange={(e)=>setPrepare(e.target.value)}></textarea>
                
            </div>
            <div className="file-field input-field">
                <div className="btn #ff9800 orange">
                    <span>Subir imagen</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button className="btn waves-effect waves-light #ff9800 orange" onClick={()=>postDetails()}>Agregar receta</button>
        </div>
    )
}

export default  CreateReceta