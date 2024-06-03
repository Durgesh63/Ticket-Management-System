import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './components/Login/Login'
import { Register } from './components/Register/Register'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard/Dashboard'
import { RemoveTools } from './components/Dashboard/RemoveTools/RemoveTools'
import UserForm from './components/UserForm/UserForm'

function App() {
  // const location = useLocation()
  // const navigate = useNavigate()
  // useEffect(() => {
  //   if ((location.pathname = "/dashboard" && localStorage.getItem("auth"))) {
  //     navigate("/dashboard")
  //   }
  // }, [location])

  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/dashboard' element={<Layout />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path='/user' element={<Layout />}>
        <Route index element={<RemoveTools />} />
      </Route>
      <Route path='/add-tool' element={<Layout />}>
        <Route index element={<UserForm />} />
      </Route>

    </Routes>
  )
}

export default App
