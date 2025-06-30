import axios from "axios"
import { createContext, useState } from "react"
import { toast } from "react-toastify"

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const [admintoken, setAdminToken] = useState(localStorage.getItem('admintoken') ? localStorage.getItem('admintoken') : '')
    const [doctors, setDoctors] = useState([])

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

    const value = {
        admintoken, setAdminToken,
        backendUrl,
        doctors, getAllDoctors,
        changeAvailability,
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider