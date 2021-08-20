import React,{useEffect,createContext,useReducer,useContext} from 'react';
import NavBar from './components/Navbar';
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom';
import Home from './components/Screen/Home'
import Signin from './components/Screen/Login'
import Profile from './components/Screen/Profile'
import Signup from './components/Screen/Signup'
import CreateReceta from './components/Screen/CreateReceta'
import './App.css'
import {reducer, initialState} from './reducers/userReducer'
import UserProfile from './components/Screen/UserProfile'
import SubscribedUserPost from './components/Screen/SubscribesUserPosts'


export const UserContext = createContext()


const Routing =()=>{
  const history = useHistory()
  const {state,dispatch}= useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    console.log(typeof(user),user)
    if (user) {
      dispatch({type:"USER",payload:user})
      
    }else{
      history.push('/signin')
    }
  },[])
  return(

    <Switch>
      <Route exact path='/'>
        <Home/>
      </Route>
      <Route path='/signin'>
        <Signin/>
      </Route>
      <Route path='/signup'>
        <Signup/>
      </Route>
      <Route exact path='/profile'>
        <Profile/>
      </Route>
      <Route path='/create'>
        <CreateReceta/>
      </Route>
      <Route path='/profile/:usuarioid'>
        <UserProfile/>
      </Route>
       <Route path='/myfollowingpost'>
        <SubscribedUserPost/>
      </Route>
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value = {{state,dispatch}}> 
    <BrowserRouter>
    <NavBar/>
    <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
    
  );
}

export default App;
