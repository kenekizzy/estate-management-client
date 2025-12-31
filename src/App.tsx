import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import About from './pages/About'
import CreateListing from './pages/CreateListing';
import Home from './pages/Home'
import Header from './components/Header'
import Search from './pages/Search';
import Listing from './pages/Listing';
import UpdateListing from './pages/UpdateListing';
import Verification from './pages/Verification';
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <>
      <Router>
      <Header />
      <ToastContainer />
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/about' element={<About />}/>
            <Route path='/sign-in' element={<SignIn />}/>
            <Route path='/sign-up' element={<SignUp />}/>
            <Route path='/search' element={<Search />}/>
            <Route path='/listing/:id' element={<Listing />}/>
            <Route path='/verify-email' element={<Verification />}/>
            <Route element={<PrivateRoute />}>
              <Route path='/profile' element={<Profile />}/>
              <Route path='/create-listing' element={<CreateListing />}/>
              <Route path='/update-listing/:id' element={<UpdateListing />}/>
            </Route>
          </Routes>
      </Router>
    </>
  )
}

export default App
