import logo from './logo.svg';
import './App.scss';
import React from 'react';
import { Routes, Route, Link, Outlet} from 'react-router-dom';

import Dashboard from './pages/Dashboard.tsx';
import Gallery from './pages/Gallery.tsx';
import PlantDetail from './pages/PlantDetail.tsx';

import Layout from './components/Layout.tsx';

function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path="gallery" element={<Gallery/>}/>
          <Route path="detail/:id" element={<PlantDetail/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
