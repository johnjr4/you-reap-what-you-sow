import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

function Layout() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch () {
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
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
        {/* <div>{name}</div>
        <div>{user?.email}</div> */}

        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/gallery">Gallery</Link>
          </li>
          <li>
            <Link to="detail/1">Plant Detail</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export default Layout;
