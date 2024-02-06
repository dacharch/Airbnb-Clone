import { useContext, useState } from "react"
import { UserContext } from "../components/UserContext"
import { Navigate, useParams } from "react-router-dom";

import axios from "axios";
import PlacePage from "./PlacePage";
import AccountNav from "./AccountNav";

export default function ProfilePage(){
    const[redirect,setRedirect] = useState(null) ;
    const{ready,user,setUser} = useContext(UserContext) ;
    
    let{subPage} = useParams();
    
    if(subPage === undefined){
       subPage = 'profile' ;
    }

    async function logout(){
       await axios.post('/logout');
       alert("Successfully Logout") ;
       setRedirect('/') ; 
       setUser(null) ;
    }

    if(!ready){
        return 'Loading...' ;
    }

    if(redirect){
       return <Navigate to='/'/>
    }

    if(ready && !user && !redirect){
         return <Navigate to={'/login'} />
    }
   
    return(
        <div>

            <AccountNav/>
            
             {
                 subPage === 'profile' &&(
                    <div className="text-center max-w-lg mx-auto">
                         Logged in as {user.name} ({user.email}) <br/>
                         <button onClick={logout}className="primary max-w-sm mt-2"> Logout</button>
                    </div>    
                 )
             }
             {
               subPage === 'places' && (
                  <PlacePage/>
               )
             }
        </div>
     )
}