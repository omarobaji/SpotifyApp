import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthenticator } from "../../contexts/AuthContext";

const SpecificArtistPage = () => {
  const { authToken, updateAuthToken } = useAuthenticator();
  const { id, artistName } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    if (id == null) {
        navigate('/search');
        return;
    }
    async function getArtists() {
      try {
      const {data} = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`, {
          headers: {
              Authorization: `Bearer ${authToken}`
          },
          params: { }
        });
        console.log(data.items);
        setArtist(data.items);
      } catch (err) {
        if (err.response.status === 401) {
          // token expired...
          // usually, a token is validated onLoad of the website.
          updateAuthToken(null, null);
          navigate('/');
        }
      }
    }
    getArtists();
  }, [updateAuthToken, authToken, id, navigate]);

  console.log(artist?.length, ' artist');
  return (
    <div style={{ padding: 16 }}>
      <div style={{ paddingLeft: 18 }}>
        <p className="specificArtistName">{artistName}</p>
        <p style={{ color: '#808080', fontSize: 18 }}>Albums</p>
      </div>
      <div className="d-flex flex-row mb-3 justify-content-around flex-wrap">
      {artist && artist.length > 0
        ? artist?.map((album) => {
          return (
            <div className="cardContainer d-flex flex-column" key={album.id}>
              <div style={{ height: '16rem' }}>
                <img src={album?.images[0]?.url} />
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
          )
        })
        : <div><p>No albums found...</p></div>}
      </div>
    </div>
  );
};

export default SpecificArtistPage;
