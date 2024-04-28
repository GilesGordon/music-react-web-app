import { useSelector, useDispatch } from "react-redux";
import { TokenState } from "../store";
import { setToken } from "../Spotify/reducer";
import * as client from "../Spotify/client";
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css"
import "../Assets/bootstrap/bootstrap.min.css"
import { Link } from "react-router-dom";

function Home() {
  const [albums, setAlbums] = useState<any[]>([]);
  const dispatch = useDispatch();
  const tokens = useSelector((state: TokenState) => state.tokenReducer.tokens);

  useEffect(() => {
    refresh()
  }, []);
  
  const handleAuth = async () => {
    const response = await client.spotifyAuth();
    refresh()
  };

  const refresh = async () => {
    const response = await client.refreshTokens();
    const tokens_from_db = await axios.get(client.TOKEN_API)
    dispatch(setToken({"access_token" : tokens_from_db.data.access_token, "refresh_token" : tokens_from_db.data.refresh_token}));

    //update state vars
    updateStates()
  };

  const updateStates = async () => {
    const response : any = await client.getAlbums(tokens.access_token)
    console.log(response)
    setAlbums(response.albums.items)

  }

  return (
    <div className="wd-max-width">
      <h1 className="row wd-center">WELCOME TO MONOLOG</h1>
      <h5 className="row wd-center">- Explore artists</h5>
      <h5 className="row wd-center">- Rate and review your favorite songs and albums</h5>
      <h5 className="row wd-center">- Customize and showcase your own music profile</h5>
      <h5 className="row wd-center">- Become friends with other music-lovers</h5>
      <h5 className="row wd-center">- Receive a tailored feed with music recommendations</h5>
      {/* <button onClick={() => console.log(tokens)}>print store</button> */}
      <h2 className="row wd-center">Check out these latest releases</h2>
      {/* <button onClick={() => console.log(client.getAlbums(tokens.access_token))}>getAlbums</button> */}
      <div className="row row-cols-auto wd-center">
      {albums ? (
          albums.map((album) => 
            <Link
          key={album.id}
          to={`/Details/${album.id}/album`}
        >
          <div key={album.id} className= "wd-card-padding">
              <div className= "col wd-album-width card">
                <img src={`${album.images[0].url}`} className="card-img-top wd-home-img" />
                <div className="card-body wd-card-body">
                  {album.name}  
                </div>
              </div>
            </div>
            </Link>
            )
        ) : (
          <div>No albums available</div>
        )}
      </div>
    </div>
  );
}

export default Home;