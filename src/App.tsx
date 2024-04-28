import React from 'react';
import logo from './logo.svg';
import './App.css';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Nav from './Nav';
import store from "./store";
import { Provider } from "react-redux";
import Search from './Search';
import Details from './Details';

function App() {
  return (
    <Provider store={store}>
    <HashRouter>
      <div className="App"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/Assets/imgs/background.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              minHeight: '100vh',
              maxWidth: '100vw',
              width: '100%',
              height: '100%',
              // position: 'fixed',
              // top: 0,
              // left: 0,
              padding: 0,
              color: '#D3D3D3',
              overflow: 'hidden'
            }}>
        <Nav/>
        <Routes>
          <Route path="/"         element={<Navigate to="/Home"/>}/>
          <Route path="/Home/*"   element={<Home/>}/>
          <Route path="/Search/*" element={<Search/>}/>
          <Route path="/Details/*" element={<Details/>}/>
        </Routes>
      </div>
    </HashRouter>
    </Provider>
  );
}

export default App;
