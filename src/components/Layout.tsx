import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import "./Layout.scss";

function Layout() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (error) {
      console.log("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    fetchUserName();
  }, [user, loading]);
  return (
    <div id="layout">
      <nav id="navbar">
        {/* <div>{name}</div>
        <div>{user?.email}</div> */}
        <img
          className="navbar-logo"
          src="/logo192.png"
          alt='website logo'
        />
        <Link className="page-link navbar-group" to={`user/${user?.uid}/gallery`}>
          <div onClick={() => setShowModal(false)}>Browse Plants</div>
        </Link>
        <div onClick={() => setShowModal(!showModal)} className="user-details navbar-group">
          <p className="navbar-name">{name}</p>
          {/* TODO: Replace this with acutal user pfp */}
          <img 
            className="navbar-pfp pfp"
            src='/default_pfp.svg'
            alt='profile picture'
          />
        </div>
      </nav>
      {showModal?
      <div className="user-modal">
        <div className="modal-group user-overview">
          <div className='modal-user-details'>
            <p><b>{name}</b></p>
            <p>placeholder@gmail.com</p>
          </div>
          <img className="modal-pfp pfp" src='/default_pfp.svg' alt='profile picture'/>
        </div>
        <Link className="modal-group page-link modal-btn" to={`user/${user?.uid}`} onClick={() => setShowModal(false)}>
            My Dashboard
        </Link>
        <div className="modal-group logout-btn modal-btn" onClick={logout}>
          Logout
        </div>
      </div>
      :
      null
      }
      <Outlet />
    </div>
  );
}

export default Layout;
