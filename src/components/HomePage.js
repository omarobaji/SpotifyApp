import React, { useEffect } from "react"
import { useAuthenticator } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { BsSpotify } from "react-icons/bs";

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"

const HomePage = () => {
  const { updateAuthToken, loggedIn, errorMessage } = useAuthenticator();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem('authentication_token');
    if (token === null && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
        window.location.hash = ""
        updateAuthToken(token);
    }
  }, [updateAuthToken])

  useEffect(() => {
    // if a user isnt logged in keep them at the home page.
    // else send them to the search page instantly...
    if (!loggedIn) return;
    navigate('/search');
  }, [loggedIn, navigate]);

  return (
    <div className="centerScreen">
      <a className="loginAnchor"
      href={`${AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
       <div className="d-flex flex-row justify-content-between" style={{ width: '20rem'}}>
        <p style={{ flex: 1, color: '#131313', fontSize: 20 }} className="nomargin">Login</p>
        <div  style={{ alignItems: 'center'}}>
          <BsSpotify size={30} color="#1ED761" />
        </div>

       </div>
      </a>
      {errorMessage && <h1 style={{ color: 'red' }}>{errorMessage}</h1>}
    </div>
  );
};

export default HomePage;