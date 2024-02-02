import { useContext, useState } from "react"
import { UserContext } from "../components/UserContext"
import { Navigate, redirect, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import PlacePage from "./PlacePage";

export default function AccountPage(){
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
   
    function linkClasses(type=null){
        let classes = 'inline-flex gap-1 py-2 px-6 rounded-full' ;
        if(type === subPage){
           classes += ' bg-primary text-white  ' ;
        }else{
          classes += 'bg-gray-200'
        }
        return classes ;
    }
    
   

    return(
        <div>
             <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
                 <Link  className={linkClasses('profile')} to ={'/account/'}>My Profile</Link>
                 <Link className={linkClasses('bookings')} to={'/account/bookings'} >My bookings</Link>
                 <Link className={linkClasses('places')}to={'/account/places'} >My accomdations</Link>
             </nav>
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