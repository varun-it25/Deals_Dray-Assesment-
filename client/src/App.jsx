import Login from './pages/Login'
import DashBoard from './pages/DashBoard'
import UpdateEmp from './pages/UpdateEmp'
import CreateEmp from './pages/CreateEmp'
import Not_Found from './pages/Not_Found'
import Welcome from './pages/Welcome'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App(){
    return (
        <Router>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/' element={<Welcome />} />
                <Route path='/employees' element={<DashBoard />} />
                <Route path='/create-employee' element={<CreateEmp />} />
                <Route path='/update-employee/:id' element={<UpdateEmp />} />
                <Route path='*' element={<Not_Found />} />
            </Routes>
        </Router>
    )
}

export default App