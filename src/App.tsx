import logo from "./logo.svg";
import "./App.scss";
import { Routes, Route, Link, Outlet } from "react-router-dom";

import Redirect from "./pages/Redirect.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Gallery from "./pages/Gallery.tsx";
import PlantDetail from "./pages/PlantDetail.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Reset from "./pages/Reset.tsx";

import Layout from "./components/Layout.tsx";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";

function App() {
  const [user, loading] = useAuthState(auth);

  const email = user?.email;
  const name = user?.displayName;
  const photo = String(user ? user.photoURL : "/default_pfp.svg");
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading]);
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/" element={<Layout user={user} />}>
          <Route index element={<Redirect />} />
          <Route path="user/:userId" element={<Dashboard user={user} />} />
          <Route path="user/:userId/gallery" element={<Gallery />} />
          {/* <Route path="/detail/:id" element={<PlantDetail />} /> */}
          <Route
            path="user/:userId/detail/:plantId"
            element={<PlantDetail />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
