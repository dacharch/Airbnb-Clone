import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Image from "../components/Image";
import BookingWidget from "../components/BookingWidget";
import axios from "axios";
import PlaceGallery from "../components/PlaceGallary";


export default function SinglePlacePage() {
    const { id } = useParams();
    const [place, setPlaces] = useState(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/place/${id}`).then(response => {
            setPlaces(response.data);
        })
    }, [id]);

    if (!place) return '';

    if (showAllPhotos) {
        return (
            <div className="absolute inset-0 bg-black text-white min-h-screen">
                <div className="bg-black p-8 grid gap-4">
                    <div>
                        <h2 className="text-3xl mr-48">Photos of {place.title}</h2>
                        <button onClick={() => setShowAllPhotos(false)} className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                            </svg>
                            Close photos
                        </button>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map(photo => (
                        <div>
                            <Image src={photo} alt="" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4 bg-gray-100 -mx-8 px-8 py-8">
            <h2 className="text-3xl ">{place.title}</h2>
            <a className="my-2 block font-semibold underline" target="_blank" href={'#'}>{place.address}</a>
            <PlaceGallery place={place} />

            <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-[2-fr_1fr]">
                <div className="my-4">
                    <h2 className="fort-semibold text-2xl">Description</h2>
                    {place.description}
                </div>
                <div>
                    Check in: {place.checkIn} <br />
                    Check-out : {place.checkOut} <br />
                    Max number of guess : {place.maxGuests}
                </div>
                <div>
                    <BookingWidget place={place} />
                </div>
            </div>
            <div>
                 <h2 className="font-semibold text-2xl">Extra Info</h2>
            </div>
            <div className="m-4 text-sm text-gray-700 leading-4">{place.extraInfo}</div>

        </div>
    )
}