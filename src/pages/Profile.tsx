import { useSelector, useDispatch } from "react-redux"
import { useState, useRef, useEffect } from "react"
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, pageStart, updateUserFailure, updateUserStart, updateUserSuccess } from "../slices/userSlice"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { Link, useNavigate } from "react-router-dom"
import { app } from "../firebase"
import axios from "axios"
import {toast} from 'react-toastify'
import { RootState, Listing } from "../types"

//Firebase Query for image storage
// allow read;
// allow write: if
// request.resource.size < 2 * 1024 * 1024 &&
// request.resource.contentType.matches('image/.*')

const url = 'http://localhost:8000/api'

const Profile: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user)
  const [userName, setUserName] = useState(currentUser?.username || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [password, setPassword] = useState("")
  const [file, setFile] = useState<File | undefined>(undefined)
  const [filePercent, setFilePercent] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("")
  const [userListings, setUserListings] = useState<Listing[]>([])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Get token from local storage
  const token = localStorage.getItem('token');

  // Set default headers for Axios
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if(file){
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file: File) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, `profile/${fileName}`)

    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed', (snapshot) =>{
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setFilePercent(Math.round(progress))
    },() => {
      setFileUploadError(true)
    },()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        setAvatarUrl(downloadUrl)
      })
    })
  }

  const handleSubmit = async (e: React.FormEvent) =>{
    e.preventDefault()
    if (!currentUser) return
    
    const updateData = {username: userName, email, avatar: avatarUrl}
    dispatch(updateUserStart())
    
    try {
      const response = await axios.put(`${url}/v1/user/update/${currentUser._id}`, updateData)
      dispatch(updateUserSuccess(response.data.user))
      toast.success(response.data.message)
      navigate("/")
    } catch (err: any) {
      dispatch(updateUserFailure(err.response?.data?.message || "Update failed"))
      toast.error(err.response?.data?.message || "Update failed")
    }
  }

  const handleDelete = async() => {
    if (!currentUser) return
    
    dispatch(deleteUserStart())
    try {
      const response = await axios.delete(`${url}/v1/user/delete/${currentUser._id}`)
      dispatch(deleteUserSuccess(response.data))
      toast.success(response.data.message)
      localStorage.clear()
      navigate("/sign-up")
    } catch (err: any) {
      dispatch(deleteUserFailure(err.response?.data?.message || "Delete failed"))
      toast.error(err.response?.data?.message || "Delete failed")
    }
  }

  const signUserOut = () => {
    localStorage.clear()
    toast.success("Log Out Successful")
    dispatch(pageStart())
    navigate("/sign-in")
  }

  const handleShowListings = async() => {
    if (!currentUser) return
    
    try {
      const response = await axios.get(`${url}/v1/user/listings/${currentUser._id}`)
      setUserListings(response.data.data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch listings")
    }
  }

  const handleDeleteListing = async (id: string) => {
    try {
      const response = await axios.delete(`${url}/v1/listing/delete-listing/${id}`)
      toast.success(response.data.message)
      setUserListings((prev) => prev.filter((listing) => listing._id !== id))
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete listing")
    }
  }

  if (!currentUser) {
    return <div>Please sign in to view your profile.</div>
  }
  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-center text-gray-900">Profile Settings</h1>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center space-y-4">
                        <input onChange={(e) => setFile(e.target.files?.[0])} type="file" ref={fileRef} accept="image/*" hidden />
                        <div className="relative group">
                            <img 
                                onClick={() => fileRef.current.click()} 
                                className="rounded-full w-32 h-32 object-cover cursor-pointer ring-4 ring-offset-4 ring-gray-100 transition duration-300 group-hover:ring-blue-100" 
                                src={avatarUrl || currentUser.avatar} 
                                alt="Profile Image" 
                            />
                            {/* <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300">
                                <span className="text-white text-sm">Change Photo</span>
                            </div> */}
                        </div>
                        
                        {fileUploadError ? (
                            <p className="text-red-600 text-sm font-medium">File Image Upload Error (Image must be less than 2mb)</p>
                        ) : filePercent > 0 && filePercent < 100 ? (
                            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${filePercent}%` }}></div>
                                <p className="text-sm text-gray-600 mt-2 text-center">{`Uploading ${filePercent}%`}</p>
                            </div>
                        ) : filePercent === 100 ? (
                            <p className="text-green-600 text-sm font-medium">Image Successfully Uploaded</p>
                        ) : null}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="userName">Username</label>
                            <input 
                                type="text" 
                                id="userName"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200" 
                                value={userName} 
                                onChange={(e) => setUserName(e.target.value)} 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email"
                                disabled="true"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                id="password"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button 
                            type="submit" 
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                        >
                            Update Profile
                        </button>
                        <Link 
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 text-center transition duration-200" 
                            to='/create-listing'
                        >
                            Create Listing
                        </Link>
                    </div>
                </form>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                    <button 
                        onClick={handleDelete} 
                        className="text-red-600 hover:text-red-800 font-medium transition duration-200"
                    >
                        Delete Account
                    </button>
                    <button 
                        onClick={signUserOut} 
                        className="text-red-600 hover:text-red-800 font-medium transition duration-200"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Listings</h2>
                    <button 
                        onClick={handleShowListings} 
                        className="px-4 py-2 text-green-600 hover:text-green-800 font-medium transition duration-200"
                    >
                        Refresh Listings
                    </button>
                </div>

                <div className="space-y-4">
                    {userListings && userListings.length > 0 ? (
                        userListings.map((listing) => (
                            <div 
                                key={listing._id} 
                                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition duration-200"
                            >
                                <Link to={`/listing/${listing._id}`} className="shrink-0">
                                    <img 
                                        src={listing.imageUrls[0]} 
                                        alt="listing cover" 
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                </Link>
                                
                                <div className="flex-1 min-w-0">
                                    <Link 
                                        to={`/listing/${listing._id}`} 
                                        className="block text-lg font-semibold text-gray-900 hover:text-blue-600 truncate transition duration-200"
                                    >
                                        {listing.name}
                                    </Link>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link 
                                        to={`/update-listing/${listing._id}`}
                                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-200"
                                    >
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDeleteListing(listing._id)}
                                        className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">No listings found</p>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile