import axios from "axios"
import { createContext, useState } from "react"
import { toast } from "react-toastify"

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const [admintoken, setAdminToken] = useState(localStorage.getItem('admintoken') ? localStorage.getItem('admintoken') : '')
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashboardData, setDashboardData] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { admintoken } })
            if (data.success) {
                setDoctors(data.doctors)
                console.log(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.put(backendUrl + '/api/admin/change-availability', { docId }, { headers: { admintoken } })
            if(data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAllAppointments = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/appointments', {headers: {admintoken}})

            if(data.success) {
                setAppointments(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment', {appointmentId}, {headers: {admintoken}})

            if(data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDashboardData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/dashboard', {headers: {admintoken}})

            if(data.success) {
                setDashboardData(data.dashboardData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        admintoken, setAdminToken,
        backendUrl,
        doctors, getAllDoctors,
        changeAvailability,
        appointments, setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashboardData, getDashboardData,
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider