import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const url = 'http://localhost:8000/api'

const Verification: React.FC = () => {
    const [token, setToken] = useState<string | null>(null)
    const [userName, setUserName] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    setToken(urlParams.get('token'))
    setUserName(urlParams.get('username'))
  }, [location.search])

  const verifyUser = async () => {
    if (!token || !userName) {
      toast.error("Invalid verification link")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${url}/v1/auth/verify-email`, {
        token,
        username: userName
      })
      toast.success(response.data.message || "Email verified successfully!")
      navigate("/sign-in")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg text-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Email Verification</h2>
          <p className="mt-4 text-gray-600">
            Hi {userName || "User"}, Thanks for joining Estate Listing. Click the button below to verify your email and complete your registration.
          </p>
        </div>
        
        <button 
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={verifyUser}
          disabled={loading || !token || !userName}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : 'Verify Email'}
        </button>

        {(!token || !userName) && (
          <p className="text-red-600 text-sm">
            Invalid verification link. Please check your email for the correct link.
          </p>
        )}
      </div>
    </div>
  )
}

export default Verification