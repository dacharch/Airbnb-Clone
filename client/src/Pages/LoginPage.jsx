import React, { useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios' ;
import {UserContext} from '../components/UserContext'

const LoginPage = () => {
  const [email,setEmail] = useState("") ;
  const [password,setPassword] =useState('') ;
  const [redirect, setRedirect] = useState(false) ;
  const {setUser} = useContext(UserContext)
  
  async function loginhandle(e){
       e.preventDefault() ;
       try {
       let {data} = await axios.post('/login',{email,password});
         setUser(data) ;
         alert("Login Successfully") ;
         setRedirect(true) ;
         
       } catch (error) {
         alert("Login Unsuccessfull");
       }
    
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }
  
  return (
     <div className='mt-4 grow flex items-center justify-around'>
         <div className='mb-64'>
            <h1 className='text-4xl text-center mb-4'>Login</h1>

            <form className='max-w-md mx-auto' onSubmit={loginhandle}>
                <input
                  value={email}
                  onChange={e=> setEmail(e.target.value)}
                  type="email" 
                  placeholder='your@email.com'
                />

                <input 
                   onChange ={e=> setPassword(e.target.value)}
                   value={password}
                   type="password"
                   placeholder='password'
                />
                
                <button className='primary'>Login</button>

                <div className='text-center py-2 text-gray-500'>
                   Don't hve an account yet?
                  <Link className='underline text-black p-2' to={'/register'}>Register Now</Link>
                </div>
            </form>
         </div>
     </div>
  )
}

export default LoginPage
