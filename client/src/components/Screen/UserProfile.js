import React, {useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
const Profile =()=>{
    
    const [userProfile,setProfile]=useState(null)
    const {state,dispatch}= useContext(UserContext)
    const {usuarioid}=useParams()
    console.log("este es mi follow ANTES",state);
    const [showfollow,setShowFollow] = useState(state?state.following?!state.following.includes(usuarioid):true:true);
    //console.log("este es mi follow DESPUES",state.following);
    //const [showfollow,setShowFollow] = useState(true)
    useEffect(()=>{
        setShowFollow(state && !state.following.includes(usuarioid))
    },state)
    //console.log(state.following.includes(usuarioid),'Este es el usuario antes del state', usuarioid);
    //console.log(state.following.includes(usuarioid),'Este es el usuario', usuarioid);
    useEffect(() => {
        fetch(`/usuario/${usuarioid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            setProfile(result)
        })   
    }, [])

    

    const followUsuario = ()=>{
        fetch('/follow', {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:usuarioid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("usuario",JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    usuario:{
                        ...prevState.usuario,
                        followers:[...prevState.usuario.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }

    const unfollowUsuario = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:usuarioid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("usuario",JSON.stringify(data))
            
            setProfile((prevState)=>{
                const newFollower = prevState.usuario.followers.filter(item=>item != data._id)
                return{
                    ...prevState,
                    usuario:{
                        ...prevState.usuario,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true)
            
        })
    }

    return(
        <div>
            {userProfile ? 
            
            <div style={{maxWidth:"550px",margin:"0px auto"}}>
                <div style={{

                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom: "1px solid orange"
                }}>
                    <div>
                        <img style ={{width:"160px",height:"160px",borderRadius:"80px"}}
                        src={userProfile.usuario.pic}
                    />
                    </div>
                    <div>
                        <h4>{userProfile.usuario.name}</h4>
                        <h4>{userProfile.lastname}</h4>
                        <div style={{display:"flex",justifyContent:"space-between",width:"110%"}}>
                            <h6>{userProfile.recetas.length} recetas</h6>
                            <h6>{userProfile.usuario.followers.length} seguidores</h6>
                            <h6>{userProfile.usuario.following.length} siguiendo</h6>
                        </div>
                        {
                            showfollow?
                            <button style={{margin:"10px"}} className="btn waves-effect waves-light #ff9800 orange" onClick={()=>followUsuario()}>Seguir</button>
                            :
                            <button style={{margin:"10px"}} className="btn waves-effect waves-light #ff9800 orange" onClick={()=>unfollowUsuario()}>Dejar de Seguir</button>
                            /*
                            state.following === null?
                            <h4>cargando...</h4>:
                            (state.following.includes(usuarioid)?
                            <button style={{margin:"10px"}} className="btn waves-effect waves-light #ff9800 orange" onClick={()=>followUsuario()}>Seguir</button>
                            :
                            <button style={{margin:"10px"}} className="btn waves-effect waves-light #ff9800 orange" onClick={()=>unfollowUsuario()}>Dejar de Seguir</button>
                            )
                            */
                            
                        }
                        
                    </div>
                </div>
                <div className="gallery">
                    {
                        userProfile.recetas.map(item=>{
                            return(
                            //<p>{item.title}</p>,
                            //<img className="item" src={item.photo} alt={item.title}/>
                            <div className="card perfil-card" key={item._id}>
                                <div className="card-image">
                                    <img src={item.photo} alt=""/>
                                </div>
                                <div className="card-content titulo-perfil">
                                    <p>{item.title}</p>
                                </div>
                            </div>
                            
                            )
                        })
                    }
                </div>
            </div>
            
            : <h4>Cargando datos ...</h4>}
        </div>
    )
}

export default Profile