import React,{useState,useEffect, useContext} from 'react'
import { UserContext } from '../../App'
import {Link} from 'react-router-dom'

const Home =()=>{
    const [data, setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/getsubReceta',{
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=> res.json())
        .then(result=>{
            console.log(result)
            setData(result.recetas)
        })
    },[])

    const likepost=(id)=>{
        fetch('/like',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                recetaId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newdata)
        }).catch(err=>{
            console.log(err)
        })
    }
    const unlikepost=(id)=>{
        fetch('/unlike',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                recetaId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newdata)
        }).catch(err=>{
            console.log(err)
        })
    }
    const makeComment = (text,recetaId)=>{
        console.log("este es el id del usuario");
        console.log(recetaId);
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                recetaId,
                text
            })
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newdata)
        }).catch(err=>{
            console.log(err)
        })
        
    }
    const deletereceta = (recetaId)=>{
        fetch(`/deletereceta/${recetaId}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }
    return(
       <div className="home">
           {
               data.map(item=>{
                   return(
                    <div className="card home-card" key={item._id}>
                        
                        <h5 style={{padding: "5px"}}><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile/"}>{item.postedBy.name} </Link>{item.postedBy._id == state._id 
                        && <i className="material-icons" style={{float:"right"}}
                        onClick={()=>deletereceta(item._id )}
                        >delete</i>
                        }
                        </h5>

                        <div className="card-image">
                            <img src={item.photo} alt=""/>
                        </div>
                        <div className="card-content">
                        <i className="material-icons" style={{color:"red"}}>favorite</i>
                        {item.likes.includes(state._id)
                        ? 
                        <i className="material-icons" style={{color:"red"}}
                        onClick={()=>{unlikepost(item._id)}}>thumb_down</i>
                        :
                        <i className="material-icons" style={{color:"blue"}}
                        onClick={()=>{likepost(item._id)}}>thumb_up</i>
                        
                        }
                            <h6>{item.likes.length} me gusta</h6>
                            <h6>{item.title}</h6>
                            <h6>ingredientes</h6>
                            <p className="parrafo">{item.ingredient}</p>
                            <h6>Preparacion</h6>
                            <p className="parrafo">{item.prepare}</p>
                            <h6 style={{fontWeight:"500"}}>Comentarios {item.comments.length}</h6>
                            {
                                item.comments.map(record=>{
                                    return(
                                        <h6></h6>,
                                        <h6 key={record._id}><span style={{fontWeight:"500", color:"orange"}}>{record.postedBy.name}: </span>{record.text}</h6>
                                    )
                                })
                            }
                            <form onSubmit={(e)=>{
                                e.preventDefault()
                                //console.log(e.target[0].value)
                                makeComment(e.target[0].value,item._id)
                            }}>
                                <input type="text" placeholder="agrega un comentario"/>
                            </form>
                            
                            
                        </div>
                    </div>
                   )
               })
           }
           
        </div>
    )
}

export default Home