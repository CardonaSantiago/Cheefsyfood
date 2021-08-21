import React, {useContext, useRef, useEffect, useState} from 'react';
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
const NavBar =()=>{
    const searchModal = useRef(null)
    const [search,setSearch]= useState('')
    const [userDetails,setUserDetails]= useState([])
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    useEffect(() => {
      M.Modal.init(searchModal.current)
      
    }, [])
    const renderList = ()=>{
      if (state) {
        return[
          <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color: 'orange'}}>search</i></li>,
          <li key="2"><Link to="/profile">perfil</Link></li>,
          <li key="3"><Link to="/create">Crear receta</Link></li>,
          <li key="4"><Link to="/myfollowingpost">siguiendo cheff</Link></li>,
          <li key="5"><button className="btn waves-effect waves-light #ff9800 orange"
          onClick={()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push('/signin')
          }}>
            Salir
            </button>
            </li>
        ]
      }else{
        return[
          <li key="6"><Link to="/Signin">Login</Link></li>,
          <li key="7"><Link to="/signup">Registrarse</Link></li>
        ]
      }
    }

    const fetchUsers=(query)=>{
      setSearch(query)
      fetch('/search-users',{
        method:"post",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          query
        })
      }).then(res=>res.json())
      .then(results=>{
        setUserDetails(results.usuario)
      })
    }

    
    
    return(
        <nav>
          <div className="nav-wrapper white">
            <Link to={state?"/":"/signin"} className="brand-logo left">Cheefsy Food</Link>
            <ul id="nav-mobile" className="right">
              {renderList()}
            </ul>
          </div>
          <div id="modal1" className="modal" ref={searchModal} style={{color: 'black'}}>
            <div className="modal-content">
            <input
              
              type="text"
              placeholder="Buscar usuario"
              value={search}
              onChange={(e)=>fetchUsers(e.target.value)}
              
              />
                <ul className="collection">
                  {userDetails.map(item=>{
                    return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                      M.Modal.getInstance(searchModal.current).close()
                      setSearch('')
                    }}><li className="collection-item">{item.name} {item.lastname}</li></Link>
                  })}
                </ul>
            </div>
            <div className="modal-footer">
              <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Cerrar</button>
            </div>
          </div>
      </nav>
    )
}

export default NavBar