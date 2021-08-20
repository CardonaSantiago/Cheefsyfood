import React, {useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const Profile =()=>{
    const [mypics,setPics]=useState([])
    const {state,dispatch}= useContext(UserContext)
    const [image, setImage] = useState("")

    const [data, setData] = useState([])

    useEffect(() => {
        fetch('/myReceta',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.myreceta)
        })
        
    }, [])
    useEffect(()=>{
        if (image) {
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
                fetch('/updatepic',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:data.url
                })
            }).then(res=>res.json())
            .then(result=>{
                console.log(result);
                localStorage.setItem("usuario",JSON.stringify({...state,pic:data.pic}))
                dispatch({type:"UPDATEPIC",payload:result. pic})
            })
            })
            .catch(err=>{
                console.log(err)
            })
            }
    },[image])

    //+++++++++++++++++++++++++++
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
    //++++++++++++++++++++++++++

    const updatePhoto =(file)=>{
        setImage(file)   
    }
    return(
        
       <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
               margin:"18px 0px",
               borderBottom: "1px solid orange"
           }}>
            <div style={{

                display:"flex",
                justifyContent:"space-around",
            }}>
                <div>
                    <img style ={{width:"160px",height:"160px",borderRadius:"80px"}}
                    src={state?state.pic:"cargando.."}
                    />
                </div>
                <div>
                    <h4>{state?state.name:"loading"} {state?state.lastname:"loading"}</h4>
                    <h4>{state?state.email:"loading"}</h4>
                    <div style={{display:"flex",justifyContent:"space-between",width:"110%"}}>
                        <h6>{mypics.length} recetas</h6>
                        <h6>{state?state.followers.length:"0"} seguidores</h6>
                        <h6>{state?state.following.length:"0"} seguidos</h6>
                    </div>
                </div>
           </div>
           <div className="file-field input-field">
                <div className="btn #ff9800 orange">
                    <span>Actualizar foto de perfil</span>
                    <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
           </div>
           <div className="gallery">
               {
                   mypics.map(item=>{
                       return(
                        //<p>{item.title}</p>,
                        //<img className="item" src={item.photo} alt={item.title}/>
                        //<div className="card perfil-card" key={item._id}>
                        //    <div className="card-image">
                        //        <img src={item.photo} alt=""/>
                        //    </div>
                        //    <div className="card-content titulo-perfil">
                        //        <p>{item.title}</p>
                        //    </div>
                        //</div>
                        <div className="card home-card" key={item._id}>
                        <h5 style={{padding_left: "5px"}}>{item.title}</h5>
                        <h5 ><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile/"}>{item.postedBy.name} </Link>{item.postedBy._id == state._id 
                        && <i className="material-icons" style={{float:"right"}}
                        onClick={()=>deletereceta(item._id )}
                        >delete</i>
                        }
                        </h5>

                        <div className="card-image">
                            <img src={item.photo} alt=""/>
                        </div>
                        <div className="card-content">
                        {item.likes.includes(state._id)
                        ? 
                        <i className="material-icons" style={{color:"gray"}}
                        onClick={()=>{unlikepost(item._id)}}>thumb_down</i>
                        :
                        <i className="material-icons" style={{color:"gray"}}
                        onClick={()=>{likepost(item._id)}}>thumb_up</i>
                        
                        }
                            <h6>{item.likes.length} me gusta</h6>
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
       </div>
    )
}

export default Profile