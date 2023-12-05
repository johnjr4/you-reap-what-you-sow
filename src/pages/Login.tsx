import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, emailSignIn, googleSignIn } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.scss";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate("/");
  }, [user]);
  return (
    <div className="login">
      <div className="container">
        <div> Log In</div>
        <br />
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
        <button className="btn" onClick={() => emailSignIn(email, password)}>
          Login
        </button>
        <button className="btn google" onClick={googleSignIn}>
          Login with Google
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          <Link to="/register">Register here.</Link>
        </div>
      </div>
    </div>
  );
}
export default Login;
