import { createContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {

    const history = useHistory();

    let localAuthTokens = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null ;

    if (localAuthTokens) {
        const refreshInfo = jwtDecode(localAuthTokens.refresh);
        let isRefreshTokenExpired = dayjs.unix(refreshInfo.exp).diff(dayjs()) < 1;

        if (isRefreshTokenExpired) {
            localAuthTokens = null
        }
    }
    
    const [username, setUsername] = useState(() => localAuthTokens ? jwtDecode(localStorage.getItem('authToken')).username : null);
    const [authTokens, setAuthTokens] = useState(() => localAuthTokens ? JSON.parse(localStorage.getItem('authToken')) : null);    
    const [loading, setLoading] = useState(true);

    let loginUser = async (e) => {
        e.preventDefault();
        
        console.log("Login User Function Entered.")
        
        let username = e.target.username.value;
        let password = e.target.password.value;
        let response = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });

        let data = await response.json();

        if (response.ok) {
            setUsername(jwtDecode(data.access).username);
            setAuthTokens(data);
            console.log("Login Successful.");
            localStorage.setItem('authToken', JSON.stringify(data)); // Data has access and refresh tokens
            history.push('/');
        } else {
            alert("Login Failed.");
        }

        console.log(response);
    }

    let logoutUser = () => {
        setUsername(null);
        setAuthTokens(null);
        localStorage.removeItem('authToken');
        history.push('/auth/login');
    }

    let contextData = {
        username: username,
        authTokens: authTokens,
        setAuthTokens: setAuthTokens,
        setUsername: setUsername,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}