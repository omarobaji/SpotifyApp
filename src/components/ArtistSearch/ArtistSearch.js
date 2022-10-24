import React, { useState, useEffect } from "react";
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import { BsSearch } from 'react-icons/bs';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthenticator } from "../../contexts/AuthContext";

const calculateArtistRating = (artistPopularity) => {
  // artist popularity is a % from 0-100
  // we calculate them over 5 stars which means 100/20 = 5;
  return artistPopularity / 20;

};
const ArtistSearch = () => {
  const { authToken, updateAuthToken } = useAuthenticator();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState(null);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    if (searchText === null){
      setArtists([]);
      return;
    }
    async function getArtists(){
      try {
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
          headers: {
              Authorization: `Bearer ${authToken}`
          },
          params: {
              q: searchText,
              type: "artist"
          }
        });
        setArtists(data.artists.items);
      } catch (err) {
        if (err.response.status === 401) {
          // token expired...
          // usually, a token is validated onLoad of the website.
          updateAuthToken(null);
          navigate('/');
        }
      }
    }
    getArtists();
  }, [updateAuthToken, authToken, searchText, navigate]);

  return (
    <div style={{ padding: 16 }}>
      <div className="d-flex parentSearchContainer">
        <div className="d-flex flex-row childSearchContainer">
          <input type="search" placeholder="Search for an artist..."
            onChange={e => setSearchText(e.target.value)} className="searchInputBox"/>
              <div style={{ display: 'flex', alignSelf: 'center', padding: 16}}>
                <BsSearch size={22} color="#D0D0D0"/>
              </div>
        </div>
      </div>
      <div>
        <div className="d-flex flex-row mb-3 justify-content-center flex-wrap gap" >
          {artists.map((artist) => {
            return (
              <Link key={artist?.id} to={`/artist/${artist?.name}/${artist?.id}`} className="artistAnchor">
                <div className="cardContainer">
                  <div style={{ height: '16rem' }}>
                  <img src={artist?.images[0]?.url} alt={`${artist.name}`} />
                  </div>
                  <div className="cardBody">
                    <p className="artistName">{artist.name}</p>
                    <p className="graytext">
                      {artist.followers.total === 1
                        ? `${artist.followers.total} follower`
                        : `${artist.followers.total.toLocaleString("en-US")} followers`} 
                    </p>
                    <StarRatings
                      rating={calculateArtistRating(artist.popularity)}
                      starDimension="25px"
                      starRatedColor="#ffd700"
                      starSpacing="0px"
                      starEmptyColor="#FFFFFF"
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default ArtistSearch;
