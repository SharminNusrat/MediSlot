import React, { useContext } from 'react'
import Login from './pages/login'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import {AdminContext} from './context/AdminContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorsList from './pages/Admin/DoctorsList'
import { DoctorContext } from './context/DoctorContext'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorProfile from './pages/Doctor/DoctorProfile'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'

const App = () => {
  const {admintoken} = useContext(AdminContext)
  const {doctortoken} = useContext(DoctorContext)

  return admintoken || doctortoken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/* Admin Routes */}
          <Route path='/' element={<></>} />
          <Route path='admin-dashboard' element={<Dashboard />} />
          <Route path='all-appointments' element={<AllAppointments />} />
          <Route path='add-doctor' element={<AddDoctor />} />
          <Route path='doctor-list' element={<DoctorsList />} />

          {/* Doctor Routes */}
          <Route path='doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='doctor-appointments' element={<DoctorAppointments />} />
          <Route path='doctor-profile' element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App  