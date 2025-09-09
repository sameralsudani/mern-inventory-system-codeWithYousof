import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api`
})

export default axiosInstance