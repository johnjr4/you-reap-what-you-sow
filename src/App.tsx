import logo from "./logo.svg";
import "./App.scss";
import React from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";

import Redirect from './pages/Redirect.tsx'
import Dashboard from "./pages/Dashboard.tsx";
import Gallery from "./pages/Gallery.tsx";
import PlantDetail from "./pages/PlantDetail.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Reset from "./pages/Reset.tsx";

import Layout from "./components/Layout.tsx";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Redirect/>}/>
          <Route path="user/:userId" element={<Dashboard />} />
          <Route path="user/:userId/gallery" element={<Gallery />} />
          {/* <Route path="/detail/:id" element={<PlantDetail />} /> */}
          <Route path="user/:userId/detail/:plantId" element={<PlantDetail />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
