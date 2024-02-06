import { Route, Routes } from "react-router-dom"
import IndexPage from "./Pages/IndexPage"
import LoginPage from "./Pages/LoginPage"
import RegisterPage from './Pages/RegisterPage'
import Layout from "./components/Layout"
import axios from "axios"

import UserContextProvider from './components/UserContext'
import ProfilePage from "./Pages/ProfilePage"
import PlacePage from "./Pages/PlacePage"
import PlacesFormPage from "./Pages/PlacesFormPage"
import SinglePlacePage from "./Pages/SinglePlacePage"
import Booking from "./Pages/BookingsPage"
import SingleBookingPage from "./Pages/SingleBookingPage"
import BookingsPage from "./Pages/BookingsPage"

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
            <Route path="/account/" element={<ProfilePage/>} />
            <Route path ="/account/places" element={<PlacePage />} />
            <Route path ="/account/places/new" element={<PlacesFormPage />} />
            <Route path ="/account/places/:id" element={<PlacesFormPage />} />
            <Route path="/place/:id" element={<SinglePlacePage/>} />
            <Route path="/account/bookings" element={<BookingsPage/>} />
            <Route path ="/account/bookings/:id" element={<SingleBookingPage/>} />

            
         </Route>
      </Routes>
      
      </UserContextProvider >

   )
}

export default App
