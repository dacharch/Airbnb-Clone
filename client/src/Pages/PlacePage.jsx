import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "./Perks";
import axios from "axios";

export default function PlacePage() {

  const { action } = useParams();

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState();
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState('');
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);


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

  function uploadPhoto(e){
    const files = e.target.files ;
    const data = new FormData() ;
    
    for(let i = 0;i<files.length;i++){
       data.append('photos',files[i]) ;
    }
   
     axios.post('/uploads',data,{
       heaaders:{'Content-type':'multipart/form-data'}
    }).then(response =>{
       const {data:filename} = response ;
       setAddedPhotos(prev => {
         return[...prev,filename] ;
       })
    })
  }

 async  function addPhotoByLink(e){
    e.preventDefault() ;
    const {data:filename} = await axios.post('/uploadImageLink',{
          link: photoLink
       })

      setAddedPhotos(prev =>{
         return[...prev, filename]
      })  
      setPhotoLink('') ;
  }




  return (
    <div>
      {action !== 'new' && (
        <div className="text-center">
          <Link to="/account/places/new" className="inline-flex bg-primary text-white py-2 px-6 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add new Place
          </Link>
        </div>
      )}
      {
        action === 'new' && (
          <div>
            <form>
              {preInput('Title', 'title for your place, should be shor and catchy')}
              <input type="text" value={title} onChange={ev=> setTitle(ev.target.value)} placeholder="title, for example My Lovel apartments " />
              {preInput('Address', 'Address to your place')}
              <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address" />
              {preInput('Photos', 'more=better')}
              <div className="flex gap-2">
                <input value={photoLink} onChange={ev => setPhotoLink(ev.target.value)}type="text" name="" id="" placeholder={'Add using a link ....jpg'} />
                <label className="rounded-full p-2 gap-1" onClick={addPhotoByLink}>Add Photo</label>
              </div>  <input type="file" className="hidden cursor-pointer" />
              <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                
                {addedPhotos.length >0 && addedPhotos.map(link=>(
                   <div >
                       <img className="rounded-2xl "src={'http://localhost:4000/uploads/'+link}  />
                   </div>
                ))
                }

                <label className=" flex cursor-pointer items-center justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-500">
                  <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                  </svg>
                  Upload
                </label>
              </div>  
              {preInput('Description', 'Description of the place')}
              <textarea value={description} onChange={ev => setDescription(ev.target.value)}/>
              {preInput('Perks', 'Select all perks for Your Perks')}

              <div className="gird grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
               <Perks selected={perks} onChange={setPerks}/>
              </div>
              {preInput('Extra Info', 'House and Rules')}

              <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />

              {preInput('Check in & Out Info, max guests', 'House and Rules')}

              <div className="grid sm:grid-cols-3">
                <div>
                  <h3 >Check in  time</h3>
                  <input type="text" value={checkIn}  
                      onChange = {ev => setCheckIn(ev.target.value)}
                      placeholder="14" 
                  />
                </div>

                <div>
                  <h3>Check out time</h3>
                  <input type="text" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} placeholder="11"/>
                </div>

                <div>
                  <h3> Max number of guests</h3>
                  <input type="text" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} />
                </div>
              </div>
              <div>
                <label className="primary my-4">Save</label>
              </div>  <input type="file" className="hidden cursor-pointer" />

            </form>
          </div>
        )
      }
    </div>
  )
}
