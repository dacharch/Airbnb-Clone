import { Route, Routes } from "react-router-dom"
import IndexPage from "./Pages/IndexPage"
import LoginPage from "./Pages/LoginPage"
import RegisterPage from './Pages/RegisterPage'
import Layout from "./components/Layout"
import axios from "axios"

import UserContextProvider from './components/UserContext'
import AccountPage from "./Pages/AccountPage"

axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.withCredentials = true ;



function App() {
  
   return (
      < UserContextProvider >
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route path="/" element={<IndexPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account/:subPage?" element={<AccountPage/>} />
            <Route path ="/account/:subPage/:action" element={<AccountPage />} />
            
         </Route>
      </Routes>
      
      </UserContextProvider >

   )
}

export default App
