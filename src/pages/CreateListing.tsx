import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useState } from "react"
import { app } from "../firebase"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const url = 'http://localhost:8000/api'

const CreateListing = () => {
    const { currentUser } = useSelector(state => state.user)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [address, setAddress] = useState("")
    const [type, setType] = useState("rent")
    const [bedrooms, setBedrooms] = useState(1)
    const [bathrooms, setBathrooms] = useState(1)
    const [regularPrice, setRegularPrice] = useState(5000)
    const [discountPrice, setDiscountPrice] = useState(1000)
    const [offer, setOffer] = useState(Boolean)
    const [parking, setParking] = useState(Boolean)
    const [furnished, setFurnished] = useState(Boolean)
    const [fileImages, setFileImages] = useState([])
    const [filePerc, setFilePerc] = useState(null)
    const [imageUrls, setImageUrls] = useState([])
    const [imageUploadError, setImageUploadError] = useState(Boolean)
    const [uploading, setUploading] = useState(false)

    const navigate = useNavigate()

      //Get token from local storage
     const token = localStorage.getItem('token');

      //Set default headers for Axios
     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const handleUploadImage = () => {
        if(fileImages.length > 0 && fileImages.length <= 6){
            setUploading(true)
            const promises = []

            for (let index = 0; index < fileImages.length; index++) {
                promises.push(saveImage(fileImages[index]))
            }

            Promise.all(promises).then((urls) => {
                console.log(urls)
                setImageUrls(existingUrls => existingUrls.concat(urls));
                setImageUploadError(false)
            }).catch((err) => {
                console.log(err)
                setImageUploadError(true)
                setUploading(false)
                toast.error("File size should be less than 2mb")
            })
            setUploading(false)
        }else{
            toast.error("You shouldn't upload more than 6 files")
        }
    }

    const saveImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                "state_changed",
                (snapshot) =>{
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setFilePerc(Math.round(progress))
                    console.log("Upload is " + progress + "% done")
                },
                (error) => {
                    reject(error)
                    console.log(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        console.log(downloadUrl)
                        resolve(downloadUrl)
                    })
                }
            )
        })
    }

    const handleDeleteImage = (index) => {
        setImageUrls(imageUrls.filter((url, i) => i !== index))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(imageUrls.length < 1){
            toast.error("You need to upload an image for a listing to be created")
            return
        }
        if(discountPrice > regularPrice){
            toast.error("Discount price cannot be greater than the Regular price")
            return
        }
        offer? discountPrice : null
        const formData = { name, description, address, type, parking, furnished, offer, bathrooms, imageUrls, bedrooms, regularPrice, userRef: currentUser._id}
        if(offer) formData.discountPrice = discountPrice
        await axios.post(`${url}/v1/listing/create-listing`, formData).then(response => {
             toast.success(response.data.message)
             navigate("/")
         }).catch(err => {
            console.log(err)
             toast.error(err.response.data.message)
         })
    }
  return (
    <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Create Listing</h1>
        <form className="flex flex-col gap-4 sm:flex-row" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 flex-1">
                <input type="text" placeholder="Name" className="border p-3 rounded-lg" name="name" id="name" onChange={(e) => setName(e.target.value)} value={name} maxLength="62" minLength="10" required/>
                <textarea type="text" placeholder="Description" className="border p-3 rounded-lg" name="description" onChange={(e) => setDescription(e.target.value)} value={description} id="description" required/>
                <input type="text" placeholder="Address" className="border p-3 rounded-lg" name="address" id="address" onChange={(e) => setAddress(e.target.value)} value={address} required/>
                <div className="flex gap-5 flex-wrap mt-3">
                    <div className="flex gap-2">
                        <input type="checkbox" name="type" id="sale" className="w-5" onChange={(e) => setType(e.target.id)} checked={type == 'sale'}/>
                        <span>Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" name="type" id="rent" className="w-5" onChange={(e) => setType(e.target.id)} checked={type == 'rent'}/>
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" name="" id="parking" className="w-5" onChange={(e) => setParking(e.target.checked)} checked={parking}/>
                        <span>Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" name="" id="furnished" className="w-5" onChange={(e) => setFurnished(e.target.checked)} checked={furnished}/>
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" name="" id="offer" className="w-5" onChange={(e) => setOffer(e.target.checked)} checked={offer}/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-5 flex-wrap mt-3">
                    <div className="flex items-center gap-2">
                        <input type="number" name="" id="bedrooms" min='1' max='10' required className="p-3 border border-gray-300 rounded-lg" onChange={(e) => setBedrooms(e.target.value)} value={bedrooms}/>
                        <span>Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" name="" id="baths" min='1' max='10' required className="p-3 border border-gray-300 rounded-lg" onChange={(e) =>setBathrooms(e.target.value)} value={bathrooms}/>
                        <span>Bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" name="" id="regularPrice" min='5000' max='1000000' required className="p-3 border border-gray-300 rounded-lg" onChange={(e) => setRegularPrice(e.target.value)} value={regularPrice}/>
                        <span>Regular Price</span>
                    </div>
                    {offer && <div className="flex items-center gap-2">
                        <input type="number" name="" id="discountPrice" min='1000' max={regularPrice} required className="p-3 border border-gray-300 rounded-lg" onChange={(e) => setDiscountPrice(e.target.value)} value={discountPrice}/>
                        <span>Discount Price</span>
                    </div>}
                </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
                <p className="font-semibold">Images: <span className="font-normal text-gray-600 ml-2">The first image will be the cover(max 6)</span></p>
                <div className="flex gap-4">
                    <input onChange={(e) => setFileImages(e.target.files)} className="p-3 border border-gray-300 rounded w-full" type="file" name="" id="images" accept="image/*" multiple />
                    <button type="button" onClick={handleUploadImage} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">{uploading ? 'Uploading' : 'Upload'}</button>
                    <p>
                        {filePerc > 0 && filePerc < 100 ? (<span className="text-slate-700 self-center">{`Uploading ${filePerc}%`}</span>) :
                        filePerc == 100 ? (<span className="text-green-700 self-center">Image Successfully Uploaded</span>) : ""
                        }
                    </p>
                </div>
                {
                    imageUrls.length > 0 && imageUrls.map((url, index) => (
                        <div key={index} className="flex justify-between p-3 border items-center">
                            <img src={url} alt="listing-image" className="w-20 h-20 object-contain rounded-lg"/>
                            <button type="button" onClick={() => handleDeleteImage(index)} className="p-3 text-red-700 rounded-lg uppercase hover: opacity-95">Delete</button>
                        </div>
                    ))
                }
                <button type="submit" className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Create Listing</button>
            </div>
        </form>
    </main>
  )
}

export default CreateListing