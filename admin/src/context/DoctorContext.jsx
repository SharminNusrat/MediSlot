import { useState } from "react"
import { createContext } from "react"
import axios from 'axios'
import {toast} from 'react-toastify'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctortoken, setDoctortoken] = useState(localStorage.getItem('doctortoken') ? localStorage.getItem('doctortoken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashboardData, setDashboardData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    const getAppointments = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/appointments', {headers: {doctortoken}})
            if(data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/doctor/complete-appointment', {appointmentId}, {headers: {doctortoken}})

            if(data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/doctor/cancel-appointment', {appointmentId}, {headers: {doctortoken}})

            if(data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getDashboardData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/dashboard', {headers: {doctortoken}})
            if(data.success) {
                setDashboardData(data.dashboardData)
                console.log(data.dashboardData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getProfileData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/profile', {headers: {doctortoken}})
            if(data.success) {
                setProfileData(data.profileData)
                console.log(data.profileData)
            } 
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        doctortoken, setDoctortoken,
        backendUrl,
        appointments, setAppointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        dashboardData, setDashboardData,
        getDashboardData,
        profileData, setProfileData,
        getProfileData, 
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider