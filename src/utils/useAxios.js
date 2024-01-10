import AuthContext from "contexts/AuthContext";
import { useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";


const baseUrl = "http://localhost:8000"

// TODO: Handle refresh token expiry
const useAxios = () => {
    const {authTokens, setUsername, setAuthTokens, logoutUser} = useContext(AuthContext)


    const axiosInstance = axios.create({
        baseURL: baseUrl,
        headers: {Authorization: `Bearer ${authTokens?.access}`}
    })

    axiosInstance.interceptors.request.use(async req => {
       
        const info = jwtDecode(authTokens.access)
        const isAccessTokenExpired = dayjs.unix(info.exp).diff(dayjs()) < 1;

        if (!isAccessTokenExpired){
            return req;
        }

        let refreshInfo = jwtDecode(authTokens.refresh)
        const isRefreshTokenExpired = dayjs.unix(refreshInfo.exp).diff(dayjs()) < 1;

        //logout user if refresh is expired.
        if (isRefreshTokenExpired){
            alert("Access Expired. Please Login Again.");
            logoutUser();
            return req; //call will fail as it is unauthorized.
        }

        //Get new Access token if current Access token is expired, but refresh is valid.
        const response = await axios.post(`${baseUrl}/api/token/refresh/`, {
            refresh: authTokens.refresh
        })

        let data = response.data
        if (response.status == 200){
            localStorage.setItem('authTokens', data);
            setUsername(jwtDecode(data.access).username);
            setAuthTokens(data);  
            req.headers.Authorization = `Bearer ${data.access}`
            return req
        }else{
            //Occurs if there is an issue getting new access token. It is valid to log user out, hence.
            alert(`Error: ${response.statusText}`)
            logoutUser();
            return req
        }

    })


    return axiosInstance;
}


export default useAxios;