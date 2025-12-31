import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ListingItem from "../components/ListingItem"
import axios from "axios"
import { Listing, SearchFilters } from "../types"

const url = 'http://localhost:8000/api'

const Search: React.FC = () => {
  const navigate = useNavigate()
  const [sideBarData, setSideBarData] = useState<SearchFilters>({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc'
  }) 
  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
      setSideBarData({
        searchTerm: searchTermFromUrl || '',
        type: (typeFromUrl as 'all' | 'rent' | 'sale') || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'createdAt',
        order: (orderFromUrl as 'asc' | 'desc') || 'desc',
      });
    } 

    const fetchListings = async () => {
      setLoading(true)
      const searchQuery = urlParams.toString()
      try {
        const response = await axios.get(`${url}/v1/listing/get-all-listing?${searchQuery}`)
        setListings(response.data.listings)
        if(response.data.listings.length > 8){
          setShowMore(true)
        } else {
          setShowMore(false)
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [location.search])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value, type} = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setSideBarData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
      setSideBarData(prev => ({
        ...prev,
        type: e.target.id as 'all' | 'rent' | 'sale'
      }))
    }

    if(e.target.id === 'searchTerm'){
      setSideBarData(prev => ({
       ...prev,
        searchTerm: (e.target as HTMLInputElement).value
      }))
    }

    if(e.target.id ==='parking' || e.target.id ==='furnished' || e.target.id ==='offer'){
      setSideBarData(prev => ({
       ...prev,
        [e.target.id]: (e.target as HTMLInputElement).checked
      }))
    }

    if (e.target.id === 'sort') {
      const sort = (e.target as HTMLSelectElement).value.split('-')[0] || 'createdAt';
      const order = (e.target as HTMLSelectElement).value.split('-')[1] || 'desc';

      setSideBarData(prev => ({
        ...prev,
        sort,
        order: order as 'asc' | 'desc'
      }));
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sideBarData.searchTerm);
    urlParams.set('type', sideBarData.type);
    urlParams.set('parking', sideBarData.parking.toString());
    urlParams.set('furnished', sideBarData.furnished.toString());
    urlParams.set('offer', sideBarData.offer.toString());
    urlParams.set('sort', sideBarData.sort);
    urlParams.set('order', sideBarData.order);
    const searchQuery = urlParams.toString()

    navigate(`/search?${searchQuery}`)
  }

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length
    const startIndex = numberOfListings
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex.toString())
    const searchQuery = urlParams.toString()
    
    try {
      const response = await axios.get(`${url}/v1/listing/get-all-listing?${searchQuery}`)
      if(response.data.listings.length < 9){
        setShowMore(false)
      }
      setListings([...listings, ...response.data.listings])
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>

          <div className="flex items-center gap-2">
              <label className="whitespace-nowrap font-semibold">Search Term:</label>
              <input type="text" id="searchTerm" placeholder="Search...." className="border rounded-lg p-3 w-full" value={sideBarData.searchTerm} onChange={handleChange}/>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" className="w-5" onChange={handleChange} checked={sideBarData.type == 'all'}/><span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={sideBarData.type == 'rent'}/> <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={sideBarData.type == 'sale'}/> <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={sideBarData.offer}/> <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities</label>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={sideBarData.parking}/> <span>Parking</span>
            </div>
            <div className="flex-gap-2">
              <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={sideBarData.furnished}/> <span>Furnished</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
              <label className="font-semibold">Sort:</label>
              <select className="border rounded-lg p-3" onChange={handleChange} id="sort" defaultValue={'createdAt_desc'}>
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Search</button>
        </form>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing Results</h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listings found</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">Loading....</p>
          )}
          {!loading && listings.length > 0 && listings.map((listing) => <ListingItem key={listing._id} listing={listing}/>)}
        </div>
        {showMore && (
          <button onClick={onShowMoreClick} className="text-green-700 hover:underline p-7">
            Show more
          </button>
        )}
      </div>
    </div>
  )
}

export default Search