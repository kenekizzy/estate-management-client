import { useState,useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FaEye, FaEyeSlash} from 'react-icons/fa'
import { signInStart, signInSuccess, signInFailure, pageStart } from "../slices/userSlice"
import axios from "axios"
import { toast } from "react-toastify"
import Oauth from "../components/Oauth"
import { RootState, FormData } from "../types"

const url = 'http://localhost:8000/api/v1'

const SignIn: React.FC = () => {
    const { loading} = useSelector((state: RootState) => state.user)
    const [showPassword, setShowPassword] = useState(false)
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
      dispatch(pageStart())
    }, [dispatch])

    const submitForm = async (data: FormData) => {
      const { email, password} = data
      dispatch(signInStart())
      try {
        const response = await axios.post(`${url}/auth/login`, {email, password})
        localStorage.setItem("token", response.data.token)
        dispatch(signInSuccess(response.data.user))
        toast.success("Sign In Successful")
        navigate("/profile")
      } catch (err: any) {
        dispatch(signInFailure(err.response?.data?.message || "Sign in failed"))
        toast.error(err.response?.data?.message || "Sign in failed")
      }
    }
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
            <div className="w-full max-w-lg space-y-8 bg-white p-8 rounded-2xl shadow-lg">
                <div>
                    <h2 className="text-4xl font-bold text-center text-gray-900 tracking-tight">Welcome Back</h2>
                    <p className="mt-2 text-center text-gray-600">Sign in to your account</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit((data) => submitForm(data))}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-400 focus:border-transparent transition duration-200 ease-in-out"
                                    {...register("email", {
                                        required: "Email Address is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Please enter a valid email address"
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-400 focus:border-transparent transition duration-200 ease-in-out"
                                    {...register("password", {required: "Password is required"})}
                                />
                                <div
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-gray-600 hover:text-gray-900"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition duration-200 ease-in-out transform hover:-translate-y-1"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : 'Sign in'}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <Oauth />
                </form>

                <div className="text-center text-sm">
                    <p className="text-gray-600">
                        Don&apos;t have an account?{' '}
                        <Link to="/sign-up" className="font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200">
                            Sign up now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
  )
}

export default SignIn