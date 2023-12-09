import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import "./Layout.scss";
import { User } from "firebase/auth";

function Layout(props: { user: User | undefined | null }) {
  // const [user, loading] = useAuthState(auth);
  const user = props.user;
  const email = user?.email;
  const name = user?.displayName;
  const photo = String(user ? user.photoURL : "/default_pfp.svg");

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (loading) return;
  //   if (!user) return navigate("/login");
  // }, [user, loading]);
  return (
    <div id="layout">
      <nav id="navbar">
<<<<<<< HEAD
        <img className="navbar-logo" src="/logo192.png" alt="website logo" />
        <Link
          className="page-link navbar-group"
          to={`user/${user?.getIdToken()}/gallery`}
        >
=======
        {/* <div>{name}</div>
        <div>{user?.email}</div> */}
        <img
          className="navbar-logo"
          src="/logo.png"
          alt='website logo'
        />
        <Link className="page-link navbar-group" to={`user/${user?.uid}/gallery`}>
>>>>>>> a674d3e4343035baf1f662afd99b0ef4890386d8
          <div onClick={() => setShowModal(false)}>Browse Plants</div>
        </Link>
        <div
          onClick={() => setShowModal(!showModal)}
          className="user-details navbar-group"
        >
          <p className="navbar-name">{name}</p>
          <img
            className="modal-pfp pfp"
            src={photo}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      </nav>
      {showModal ? (
        <div className="user-modal">
          <div className="modal-group user-overview">
            <div className="modal-user-details">
              <p>
                <b>{name}</b>
              </p>
              <p>{email}</p>
            </div>
            <img
              className="modal-pfp pfp"
              src={photo}
              alt="profile picture"
              referrerPolicy="no-referrer"
            />
          </div>
          <Link
            className="modal-group page-link modal-btn"
            to={`user/${user?.getIdToken()}`}
            onClick={() => setShowModal(false)}
          >
            My Dashboard
          </Link>
          <div className="modal-group logout-btn modal-btn" onClick={logout}>
            Logout
          </div>
        </div>
      ) : null}
      <Outlet />
    </div>
  );
}

export default Layout;
