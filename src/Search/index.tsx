import { useState, useEffect } from "react";
import "./index.css";
import { TokenState } from "../store";
import * as client from "../Spotify/client";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setToken } from "../Spotify/reducer";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Search() {
  const [search, setSearch] = useState("");
  const tokens = useSelector((state: TokenState) => state.tokenReducer.tokens);
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [searchType, setSearchType] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    if (pathSegments.length === 4 && pathSegments[1] === "search") {
      const type = pathSegments[2];
      const criteria = decodeURIComponent(pathSegments[3]);
      setSearch(criteria);
      setSearchType(type);
      handleSearch(type, criteria);
    }
  }, [location.pathname]);

  const handleSearch = async (type: string, criteria?: string) => {
    const searchTerm = criteria || search.trim();
    if (searchTerm !== "") {
      try {
        await client.refreshTokens();
        const tokens_from_db = await axios.get(client.TOKEN_API);
        const refreshedTokens = {
          access_token: tokens_from_db.data.access_token,
          refresh_token: tokens_from_db.data.refresh_token,
        };
        dispatch(setToken(refreshedTokens));

        const response: any = await client.search(refreshedTokens.access_token, searchTerm, type);
        if (type === "artist") {
          setArtists(response.artists.items);
          setAlbums([]);
        } else {
          setAlbums(response.albums.items);
          setArtists([]);
        }

        setSearchType(type);
        navigate(`/search/${type}/${encodeURIComponent(searchTerm)}`);
      } catch (error) {
        console.error("Error occurred during token refresh or search:", error);
      }
    }
  };

  return (
    <div>
      <h1 className="row wd-center">Search Artists and Albums!</h1>
      <div className="row wd-center">
        <input
          className="wd-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter search query"
        />
      </div>
      <div className="row wd-center">
        <button className="wd-button" onClick={() => handleSearch("artist")}>
          Artists
        </button>
        <button className="wd-button" onClick={() => handleSearch("album")}>
          Albums
        </button>
      </div>
      {searchType === "artist" && artists.length > 0 && (
        <div>
          {artists.map((artist) => (
            <Link
              key={artist.id}
              to={`/Details/${artist.id}/artist`}
              className="wd-search-row"
            >
              {artist.images && artist.images.length > 0 && (
                <img
                  className="wd-img"
                  src={`${artist.images[0].url}`}
                  alt={artist.name}
                />
              )}
              <div className="col">
                <h3>{artist.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
      {searchType === "album" && albums.length > 0 && (
        <div>
          {albums.map((album) => (
            <Link
              key={album.id}
              to={`/Details/${album.id}/album`}
              className="wd-search-row"
            >
              <img
                className="wd-img"
                src={`${album.images[0].url}`}
                alt={album.name}
              />
              <div className="col">
                <h3>{album.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
//   return (
//     <div>
//       <h1 className="row wd-center">Search Artists and Albums!</h1>
//       <div className="row wd-center">
//         <input
//           className="wd-search"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>
//       <div className="row wd-center">
//         <button className="wd-button" onClick={() => handleSearch("artist")}>
//           Artists
//         </button>
//         <button className="wd-button" onClick={() => handleSearch("album")}>
//           Albums
//         </button>
//       </div>
//       {searchType === "artist" && artists.length > 0 && (
//         <div>
//           {artists.map((artist) => (
//             <div key={artist.id} className="row wd-search-row">
//               {artist.images && artist.images.length > 0 && (
//                 <img className="col wd-img" src={`${artist.images[0].url}`} alt={artist.name} />
//               )}
//               <div className="col">{artist.name}</div>
//             </div>
//           ))}
//         </div>
//       )}
//       {searchType === "album" && albums.length > 0 && (
//         <div>
//           {albums.map((album) => (
//             <div key={album.id} className="row wd-search-row">
//               <img className="col wd-img" src={`${album.images[0].url}`} alt={album.name} />
//               <div className="col">{album.name}</div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
}

export default Search;


// function Search() {
    
//     const[search, setSearch] = useState("")
//     const tokens = useSelector((state: TokenState) => state.tokenReducer.tokens);
//     const [artists, setArtists] = useState<any[]>([]);
//     const [albums, setAlbums] = useState<any[]>([]);
//     const dispatch = useDispatch();
//     const handleSearch = async (type: string) => {
//         // //refresh the tokens
//         // const response = await client.refreshTokens();
//         // const tokens_from_db = await axios.get(client.TOKEN_API)
//         // dispatch(setToken({ "access_token": tokens_from_db.data.access_token, "refresh_token": tokens_from_db.data.refresh_token }));

//         // //set state variables with json response
//         // if (search.trim() !== "") {
//         //     const response : any = await client.search(tokens.access_token, search, type);
//         //     if (type === "artist") {
//         //         setAlbums([])
//         //         setArtists(response.artists.items)
//         //     } else {
//         //         setArtists([])
//         //         setAlbums(response.albums.items)
//         //     }
//         // }
//         if (search.trim() !== "") {
//             try {
//               // Refresh the tokens
//               await client.refreshTokens();
//               const tokens_from_db = await axios.get(client.TOKEN_API);
//               const refreshedTokens = {
//                 access_token: tokens_from_db.data.access_token,
//                 refresh_token: tokens_from_db.data.refresh_token,
//               };
//               dispatch(setToken(refreshedTokens));
        
//               // Make the search request with the refreshed tokens
//               const response: any = await client.search(refreshedTokens.access_token, search, type);
//               if (type === "artist") {
//                 setAlbums([]);
//                 setArtists(response.artists.items);
//               } else {
//                 setArtists([]);
//                 setAlbums(response.albums.items);
//               }
//             } catch (error) {
//               console.error("Error occurred during token refresh or search:", error);
//             }
//           }
//       };
//     return(
//         <div>
//             <h1 className="row wd-center">Search Artists and Albums!</h1>
//             <div className="row wd-center">
//                 <input className="wd-search" value={search} onChange={(e) => setSearch(e.target.value)}/>
//             </div>
//             <div className="row wd-center">
//             <button className="wd-button" onClick={() => handleSearch("artist")}><Link className="wd-link" to="/Search">Artists</Link></button>

//             <button className="wd-button" onClick={() => handleSearch("album")}><Link className="wd-link" to="/Search">Albums</Link></button> </div>
//             {albums ? 
//             (albums.map((album) => <div key={album.id} className= "row wd-search-row">
//                 <img className= "col wd-img" src={`${album.images[0].url}`} />
//                 <div className="col">
//                     {album.name}  
//                 </div>
//             </div>)
//             ) : (
//             <div></div>
//             )}
//             {artists ? 
//             (artists.map((artist) => 
//             <div key={artist.id} className= "row wd-search-row">
//                 {artist.images && artist.images.length > 0 && (<img className= "col wd-img" src={`${artist.images[0].url}`} />)}
//                 <div className="col">
//                     {artist.name}  
//                 </div>
//             </div>)
//             ) : (
//             <div></div>
//             )}
//         </div>
//     )
// }