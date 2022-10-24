import React, { useEffect, useReducer } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthenticator } from "../../contexts/AuthContext";
import UISpinner from "../UI/Spinner";

const reducer = (state, action) => {
  switch (action.type) {
    case 'start-loading': return { ...state, artist: null, loading: true };
    case 'load-albums-success': return { ...state, artist: action.artist, loading: false };
    case 'load-albums-failure': return { ...state, loading: false, errorMessage: action.message };
    default: throw new Error('Unhandled action type: ' + action.type);
  }
};

const SpecificArtistPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    artist: null,
    loading: false
  });
  const { artist, loading } = state;
  const { authToken, updateAuthToken } = useAuthenticator();
  const { id, artistName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id == null) {
        navigate('/search');
        return;
    }
    async function getArtists() {
      try {
        dispatch({ type: 'start-loading' });
      const {data} = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`, {
          headers: {
              Authorization: `Bearer ${authToken}`
          },
          params: { }
        });
        dispatch({ type: 'load-albums-success', artist: data.items });
        // setArtist(data.items);
      } catch (err) {
        if (err.response.status === 401) {
          dispatch({ type: 'load-albums-failure', errorMessage: 'Failed to load albums...' });
          // token expired...
          // usually, a token is validated onLoad of the website.
          updateAuthToken(null);
          navigate('/');
        }
      }
    }
    getArtists();
  }, [updateAuthToken, authToken, id, navigate]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ paddingLeft: 18 }}>
        <p className="specificArtistName">{artistName}</p>
        <p style={{ color: '#808080', fontSize: 18 }}>Albums</p>
      </div>
        
      <div className="d-flex flex-row mb-3 justify-content-around flex-wrap">
      {loading
        ? <UISpinner />
        : artist?.length > 0
            ? artist.map((album) => {
                return (
                <div className="cardContainer d-flex flex-column" key={album.id}>
                  <div style={{ height: '16rem' }}>
                    <img src={album?.images[0]?.url} alt={`${album.name}`} />
                  </div>
                  <div className="d-flex flex-column justify-content-between flex-grow-1">
                    <div className="cardBody">
                      <p className="albumName">{album.name}</p>
                      <div>
                        <p className="graytext"> 
                          {album?.artists.map(artist => (
                              `${artist.name} `
                          ))}
                        </p>
                      </div>
                      <div style={{ paddingTop: 6 }}>
                        <p className="nomargin graytext">{album.release_date}</p>
                        <p className="nomargin graytext">{album.total_tracks} tracks</p>
                      </div>
                    </div>
                      <div className="spotifyRedirect">
                        <a href={album.external_urls?.spotify}>
                            Preview on Spotify
                        </a>
                      </div>
                  </div>
                </div>
                );
              })
            : <div><p>No albums found...</p></div>}
      </div>
    </div>
  );
};

export default SpecificArtistPage;
