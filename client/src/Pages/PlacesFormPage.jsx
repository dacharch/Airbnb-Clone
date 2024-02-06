import { useEffect, useState } from "react";
import PhotoUploader from "./PhotoUploader";
import Perks from "./Perks";
import AccountNav from "./AccountNav";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
  let {id}  =  useParams() ;

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState();
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  const[price, setPrice] = useState(100) ;
  const [redirect, setRedirect] = useState(false);

  useEffect(()=>{
     if(!id){
       return ;
     }
     axios.get('place/'+id).then(response =>{
         const {data} = response ;
         setTitle(data.title);
         setAddress(data.address) ;
         setAddedPhotos(data.photos);
         setDescription(data.description) ;
         setPerks(data.perks) ;
         setExtraInfo(data.extraInfo);
         setCheckIn(data.checkIn);
         setCheckOut(data.checkOut);
         setMaxGuests(data.maxGuests) ;
         setPrice(data.price) ;
     })


     
  },[id]) ;

  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
    );
  }

  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    )
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(e) {
    e.preventDefault();
    const placeData = {
    title, address, addedPhotos,
      description, perks, extraInfo, checkIn, checkOut, maxGuests,price
    }

    if(id){
      await axios.put('/places', {
          id, ...placeData
      });
  
      setRedirect(true);
    
    }else{
      await axios.post('/places',placeData);
  
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/account/places'} />
  }

  return (
    <div>
      <AccountNav />
      <form >
        {preInput('Title', 'title for your place, should be shor and catchy')}
        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example My Lovel apartments " />
        {preInput('Address', 'Address to your place')}
        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address" />
        {preInput('Photos', 'more=better')}
        <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />


        {preInput('Description', 'Description of the place')}
        <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
        {preInput('Perks', 'Select all perks for Your Perks')}

        <div className="gird grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput('Extra Info', 'House and Rules')}

        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />

        {preInput('Check in & Out Info, max guests', 'House and Rules')}

        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1" >Check in  time</h3>
            <input type="text" value={checkIn}
              onChange={ev => setCheckIn(ev.target.value)}
              placeholder="14"
            />
          </div>

          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input type="text" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} placeholder="11" />
          </div>

          <div>
            <h3 className="mt-2 -mb-1"> Max number of guests</h3>
            <input type="text" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} />
          </div>

          <div>
            <h3 className="mt-2 -mb-1"> Price per night</h3>
            <input type="text" value={price} onChange={ev => setPrice(ev.target.value)} />
          </div>
        </div>
        <button onClick={savePlace} className="bg-primary text-white rounded-full w-full px-2 py-2">Save</button>
      </form>
    </div>
  )
}