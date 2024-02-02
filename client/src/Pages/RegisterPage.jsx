import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const RegisterPage = () => {
    
  const [name,setName] = useState('') ;
  const [email,setEmail] = useState('') ;
  const [password,setPassword] = useState('') ;

 async function registerForm(e){
      e.preventDefault() ;
     await axios.post('/register',{
        name,
        email,
        password
      }) ;
      alert("User Successfully Registered") ;
  }

 

  return (
     <div className='mt-4 grow flex items-center justify-around'>
         <div className='mb-64'>
            <h1 className='text-4xl text-center mb-4'>Register</h1>
            <form className='max-w-md mx-auto' onSubmit={registerForm}>
                <input type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder='Type Username here'
                />

                <input type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='your@email.com' 
                />

                <input type="password"
                   value={password} 
                   onChange={e=> setPassword(e.target.value)}
                   placeholder='password'
                />
             
                <button className='primary'>Register</button>
                <div className='text-center py-2 text-gray-500'>
                   Already a member? 
                  <Link className='underline text-black p-2' to={'/login'}>Login</Link>
                </div>
            </form>
         </div>
     </div>
  )
}

export default RegisterPage
