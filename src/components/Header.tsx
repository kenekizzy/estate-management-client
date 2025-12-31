import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { RootState } from '../types'

const Header: React.FC = () => {
    const { currentUser } = useSelector((state: RootState) => state.user)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set("searchTerm", searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    useEffect(() => {
       const urlParams = new URLSearchParams(location.search)
       const searchTermFromUrl = urlParams.get("searchTerm")
       if(searchTermFromUrl){
        setSearchTerm(searchTermFromUrl)
       } 
    }, [location.search])
  return (

    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm py-4 border-b">
    <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6">
        <Link to='/' className="transform hover:scale-105 transition-transform duration-200">
            <h1 className="font-extrabold text-lg sm:text-2xl flex items-center space-x-1">
                <span className="bg-gradient-to-r from-slate-600 to-slate-800 text-transparent bg-clip-text">Estate</span>
                <span className="text-slate-700">Listing</span>
            </h1>
        </Link>
        
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search properties..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition-all duration-200 text-sm"
                />
                <button type='submit'>
                    <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors duration-200"/>
                </button>
            </div>
        </form>
        
        <nav>
            <ul className='flex items-center space-x-6'>
                <Link to='/'>
                    <li className='text-slate-600 font-medium hidden hover:text-slate-900 transition-colors duration-200 sm:inline'>Home</li>
                </Link>
                <Link to='/about'>
                    <li className='text-slate-600 font-medium hidden hover:text-slate-900 transition-colors duration-200 sm:inline'>About</li>
                </Link>
                <Link to='/profile' className="transform hover:scale-105 transition-transform duration-200">
                    {currentUser ? (
                        <img 
                            className='rounded-full h-8 w-8 object-cover ring-2 ring-offset-2 ring-slate-200' 
                            src={currentUser.avatar} 
                            alt='Profile'
                        />
                    ) : (
                        <li className='text-slate-600 font-medium hover:text-slate-900 transition-colors duration-200'>Sign In</li>
                    )}
                </Link>              
            </ul>
        </nav>
    </div>
</header>
  )
}

export default Header