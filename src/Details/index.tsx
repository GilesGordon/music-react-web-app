import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { TokenState } from "../store";
import * as client from "../Spotify/client";
import { setToken } from "../Spotify/reducer";

function Details() {
  const [details, setDetails] = useState<any>(null);
  const [id, setId] = useState<any>(null)
  const [type, setType] = useState<any>(null)
  const tokens = useSelector((state: TokenState) => state.tokenReducer.tokens);
  const dispatch = useDispatch();
  const location = useLocation();
  
  const fetchDetails = async () => {
    await refresh()
    const pathSegments = location.pathname.split("/");
    setId(pathSegments[2]);
    setType(pathSegments[3]);
    try {
        const response = pathSegments[3]==="album" ? 
        await client.getAlbumDetails(tokens.access_token, pathSegments[2]) : 
        await client.getArtistDetails(tokens.access_token, pathSegments[2]);
        setDetails(response);
    } catch (error) {
        console.error("Error fetching details:", error);
    }
    };
  useEffect(() => {
    fetchDetails();
  }, []);

  const refresh = async () => {
    await client.refreshTokens();
    const tokens_from_db = await axios.get(client.TOKEN_API);
    const refreshedTokens = {
      access_token: tokens_from_db.data.access_token,
      refresh_token: tokens_from_db.data.refresh_token,
    };
    dispatch(setToken(refreshedTokens));
  }

  

  return (
    <div className="container">
        {details && (
        <div className="wd-center"> 
            {details.images && details.images.length > 0 && (
                <img
                  className="wd-img"
                  src={`${details.images[0].url}`}
                  alt={details.name}
                />
              )}
                <h1>Name: {details.name}</h1>

      </div>
        )}
  </div>
  )
}

export default Details;