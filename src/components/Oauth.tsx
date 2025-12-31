import { GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { FaGoogle } from 'react-icons/fa6'
import { app } from '../firebase'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../slices/userSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const url = 'http://localhost:8000/api'

const Oauth: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const handleWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)
            
            const response = await axios.post(`${url}/v1/auth/googleSignIn`, {
                name: result.user.displayName, 
                email: result.user.email, 
                photo: result.user.photoURL
            })
            
            localStorage.setItem("token", response.data.token)
            dispatch(signInSuccess(response.data.user))
            toast.success(response.data.message)
            navigate("/profile")
        } catch (error: any) {
            toast.error("Error signing in with Google")
            console.log(error.response?.data || error.message)
        }
    }
  return (
    <button type="button" className="bg-red-700 w-full flex items-center justify-center gap-4 p-3 text-white rounded-lg hover:opacity-90 cursor-pointer" onClick={handleWithGoogle}> <FaGoogle /> Continue With Google</button>
  )
}

export default Oauth