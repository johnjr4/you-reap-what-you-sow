import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import "./Layout.scss";
import { User } from "firebase/auth";
import axios from "axios";
import UserObject from "../types/UserObject";

function Layout(props: { user: User | undefined | null }) {
  // const [user, loading] = useAuthState(auth);
  const [ourUser, setOurUser] = useState<UserObject>();
  const [loading, setLoading] = useState<boolean>(true);
  const user = props.user;
  const email = user?.email;
  console.log(user);
  console.log(email);
  // const name = user?.displayName;
  const photo = String(user?.photoURL ? user.photoURL : "/default_pfp.svg");

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (loading) return;
  //   if (!user) return navigate("/login");
  // }, [user, loading]);

  useEffect(() => {
    async function fetchOurUser() {
      if (user) {
        try {
          let userRes = await axios.get(`http://localhost:4001/api/userstemp/${email}`)
          setOurUser(userRes.data.data);
          setLoading(false);
        } catch (error) {
          console.log(`error loading user data in layout: ${error}`);
        }
      }
    }
    fetchOurUser();

  }, [email, user])

  if (loading || !ourUser) {
    console.log("Returning loading");
    return (
    <div id="layout">
      <nav id="navbar"/>
      <Outlet/>
    </div>
    )
  }

  console.log(ourUser);

  return (
    <div id="layout">
      <nav id="navbar">
        {/* <div>{name}</div>
        <div>{user?.email}</div> */}
        <img
          className="navbar-logo"
          src="/logo.png"
          alt='website logo'
        />
        <Link className="page-link navbar-group" to={`user/${user?.uid}/gallery`}>
          <div onClick={() => setShowModal(false)}>Browse Plants</div>
        </Link>
        <div
          onClick={() => setShowModal(!showModal)}
          className="user-details navbar-group"
        >
          <p className="navbar-name">{ourUser.name}</p>
          <img
            className="navbar-pfp pfp"
            src={ourUser.picture_path ? ourUser.picture_path : photo}
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
                <b>{ourUser.name}</b>
              </p>
              <p>{ourUser.email}</p>
            </div>
            <img
              className="modal-pfp pfp"
              src={ourUser.picture_path ? ourUser.picture_path : photo}
              alt="profile picture"
              referrerPolicy="no-referrer"
            />
          </div>
          <Link
            className="modal-group page-link modal-btn"
            to={`user/${String(user?.uid)}`}
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
