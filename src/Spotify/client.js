import axios from "axios";
import queryString from 'query-string';
import { TokenState } from "../store";
import { useSelector } from "react-redux";

export const BASE_API = process.env.REACT_APP_API_BASE;
export const TOKEN_API = `${BASE_API}/api/token`;
var client_id = '552d2761f7514c2184a90bb472f069eb';
var client_secret = '2da744e1d8fe44269ab5badec02ad673';
var redirect_uri = 'http://localhost:3000';
const TOKEN = 'https://accounts.spotify.com/api/token';

export const spotifyAuth = async () => {
  var state = "ABCDEFGHABCDEFGH";
  var scope = 'user-read-private user-read-email';

  // Check if the authorization code is already in the URL
  const str = window.location.search;
  const code = new URLSearchParams(str).get('code');

  if (!code) {
    // If the code is not in the URL, redirect to the Spotify authorization page
    window.location.href = ('https://accounts.spotify.com/authorize?' + queryString.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
      // show_dialog: true
    }));
  } else {
    // If the code is in the URL, proceed with the token exchange
    console.log(code);

    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;

    const response = await new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", TOKEN, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));

      xhr.onload = function() {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            console.log("access token request:");
            console.log(response);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error('Request failed. Status: ' + xhr.status));
        }
      };

      xhr.onerror = function() {
        reject(new Error('Request failed. Network error.'));
      };

      xhr.send(body);
    });

    await axios.put(TOKEN_API, {
      access_token: response.access_token,
      refresh_token: response.refresh_token
    });
  }
};

export const refreshTokens = async () =>{
  try {
    // Fetch the current tokens
    const bothTokens = await axios.get(TOKEN_API);
    const refreshToken = bothTokens.data.refresh_token;
    console.log(refreshToken);

    // Prepare the request body
    // let body = "grant_type=refresh_token";
    // body += "&refresh_token=" + refreshToken;
    // body += "&client_id=" + client_id;

    const payload = new URLSearchParams();
    payload.append('grant_type', 'refresh_token');
    payload.append('refresh_token', refreshToken);
    payload.append('client_id', client_id);

    // Create a new promise to handle the token refresh request
    const refreshResponse = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", TOKEN, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
      xhr.onload = function() {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            console.log("refresh response:");
            console.log(response);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error('Request failed. Status: ' + xhr.status));
        }
      };

      xhr.onerror = function() {
        reject(new Error('Request failed. Network error.'));
      };

      xhr.send(payload);
    });

    // Update the tokens in the database
    await axios.put(TOKEN_API, {
      "access_token": refreshResponse.access_token,
      "refresh_token": refreshResponse.refresh_token
    });

    console.log("Tokens updated successfully");
  } catch (error) {
    console.error("Error refreshing tokens:", error);
  }
}

export const getAlbums = async (access_token) =>{
  const url = "https://api.spotify.com/v1/search?q=tag%3Anew&type=album&limit=5";

  const payload = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer '+ `${access_token}`,
    },
  }
  const fetch_data = await fetch(url, payload);
  return fetch_data.json()
}

export const search = async (access_token, searchParam, type) =>{
  const url = `https://api.spotify.com/v1/search?q=`+`${searchParam}`+`&limit=30`+`&type=`+`${type}`;

  const payload = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer '+ `${access_token}`,
    },
  }
  const fetch_data = await fetch(url, payload);
  return fetch_data.json()
}

export async function getAlbumDetails(access_token, id) {
  const url = `https://api.spotify.com/v1/albums/${id}`;
  const payload = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer '+ `${access_token}`,
    },
  }
  const fetch_data = await fetch(url, payload);
  return fetch_data.json()
}

export async function getArtistDetails(access_token, id) {
  const url = `https://api.spotify.com/v1/artists/${id}`;
  const payload = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer '+ `${access_token}`,
    },
  }
  const fetch_data = await fetch(url, payload);
  return fetch_data.json()
}

