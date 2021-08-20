import React,{useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'
const Login =()=>{
    const {state, dispatch}= useContext(UserContext)
    const history =useHistory()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const PostData = ()=>{
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Correo invalido", classes:"#c62828 red darken-3"})
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{ 
            console.log(data)
            if (data.error) {
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"Ingreso exitoso", classes:"#76ff03 light-green accent-3"})
                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Cheefsy Food</h2>
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
                <button className="btn waves-effect waves-light #ff9800 orange" onClick={()=>PostData()}>Ingresar</button>
                <h5>
                <Link to="/signup">No tienes una cuenta?</Link>
                </h5>
            </div>
            
        </div>
    )
}

export default Login