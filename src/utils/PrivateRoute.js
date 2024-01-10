import {Route, Redirect} from 'react-router-dom';
import AuthContext from 'contexts/AuthContext';
import { useContext } from 'react';

const PrivateRoute = ({childeren, ...rest}) => {
    let {username} = useContext(AuthContext);

    let authenticated = username ? true : false;

    console.log("Private Route Entered.", "Authenticated: ", authenticated)


    return (
        <div>
            <Route {...rest}/>
            {!authenticated ? (<Redirect to="/auth/login"/>) : childeren }
        </div>
    )


}

export default PrivateRoute;