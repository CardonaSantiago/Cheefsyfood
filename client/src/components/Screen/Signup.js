import React, {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
const Signup =()=>{
    const history =useHistory()
    const [name, setName] = useState("")
    const [lastname, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(() => {
        if(url){
            subirArchivos()
        }
    },[url])

    const subirImagen = ()=>{
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
    const subirArchivos =()=>{
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Correo invalido", classes:"#c62828 red darken-3"})
            return
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                name,
                lastname,
                email,
                password,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{ 
            if (data.error) {
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html:data.msg, classes:"#76ff03 light-green accent-3"})
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const PostData = ()=>{
        if(image){
            subirImagen()
        }else{
            subirArchivos()
        }
        
    }
    return(
        
        <div className="mycard">
        <div className="card auth-card input-field">
            <h2>Cheefsy Food</h2>
            <input
            type="text"
            placeholder="nombre"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
            <input
            type="text"
            placeholder="apellido"
            value={lastname}
            onChange={(e)=>setLastName(e.target.value)}
            />


            <input
            type="text"
            placeholder="correo electronico"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #ff9800 orange">
                    <span>Subir foto de perfil</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button className="btn waves-effect waves-light #ff9800 orange" onClick={()=>PostData()}>Registrarse</button>
            <h5>
                <Link to="/signin">Ya tienes una cuenta?</Link>
            </h5>
        </div>
    </div>
    )
}

export default Signup