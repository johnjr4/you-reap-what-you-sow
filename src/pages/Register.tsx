import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, emailRegister, googleSignIn } from "../firebase.js";
import "./Login.scss";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setUsername] = useState("");
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const register = () => {
    if (!name) alert("Please enter name");
    emailRegister(name, email, password);
  };
  useEffect(() => {
    if (user) navigate("/");
  }, [user]);
  return (
    <div className="login">
      <div className="container">
        <div>Register</div>
        <br></br>
        <input
          type="text"
          className="textInput"
          value={name}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="text"
          className="textInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="textInput"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="btn" onClick={register}>
          Register
        </button>
        <button className="btn google" onClick={googleSignIn}>
          Register with Google
        </button>
        <div>
          Already have an account? <Link to="/login">Login</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Register;
