/* eslint-disable react/no-unescaped-entities */
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { useEffect, useState } from "react";
import axios from "axios";
import ListingItem from "../components/ListingItem";
import { Listing } from "../types";

const url = 'http://localhost:8000/api/v1'

const Home: React.FC = () => {
  SwiperCore.use([Navigation])
  const [offerListings, setOfferListings] = useState<Listing[]>([])
  const [saleListings, setSaleListings] = useState<Listing[]>([])
  const [rentListings, setRentListings] = useState<Listing[]>([])

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await axios.get(`${url}/listing/get-all-listing?offer=true&limit=4`)
        setOfferListings(response.data.listings)
      } catch (err) {
        console.log(err)
      }
    }
    
    const fetchRentListings = async () => {
      try {
        const response = await axios.get(`${url}/listing/get-all-listing?type=rent&limit=4`)
        setRentListings(response.data.listings)
      } catch (err) {
        console.log(err)
      }
    }
    
    const fetchSaleListings = async () => {
      try {
        const response = await axios.get(`${url}/listing/get-all-listing?type=sale&limit=4`)
        setSaleListings(response.data.listings)
      } catch (err) {
        console.log(err)
      }
    }
    
    fetchOfferListings()
    fetchRentListings()
    fetchSaleListings()
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">Find your next 
        <span className="text-slate-500"> perfect</span>
        <br /> 
        place with ease</h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          NewHall Estate is the best place to find your next perfect place to
            live.
            <br />
            We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      <Swiper navigation>
        {rentListings && rentListings.length > 0 &&
          rentListings.map((listing, index) => (
            <SwiperSlide key={index}>
              <div key={listing._id} style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} className="h-[500px]"></div>
            </SwiperSlide>
          ))
        }
      </Swiper>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 &&  (
          <div className="">
            <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 &&  (
          <div className="">
            <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent Rent Offers</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?type=rent'}>Show more offers</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 &&  (
          <div className="">
            <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent Sale Offers</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?type=sale'}>Show more offers</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home