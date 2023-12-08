import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

import { redirect } from "react-router-dom";

function Redirect() {
    const [user, loading] = useAuthState(auth);
    const [name, setName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const fetchUserName = async () => {
        try {
          console.log(user);
          const q = query(collection(db, "users"), where("uid", "==", user?.uid));
          const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setName(data.name);
      } catch (error) {
        console.log("An error occured while fetching user data");
      }
    };
    useEffect(() => {
      fetchUserName();
    }, [user, loading]);
    
    if (loading) return;
    if (!user) return navigate("/login");
    return navigate(`/user/${user!.uid}`);
}

export default Redirect;