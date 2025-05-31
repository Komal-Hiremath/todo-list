import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/login', { email, password })
      .then(result => {
        console.log(result);
        if (result.data === "Success") {
          navigate('/home'); // ✅ Go to home page
        } else {
          alert("Invalid credentials");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Login failed");
      });
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw",
          backgroundImage: "url('/nature.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
          zIndex: -1,
        }}
      />
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="bg-white p-3 rounded w-25">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label><strong>Email</strong></label>
              <input
                type="email"
                placeholder="Enter Email"
                autoComplete="off"
                className="form-control rounded-0"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label><strong>Password</strong></label>
              <input
                type="password"
                placeholder="Enter Password"
                className="form-control rounded-0"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-success w-100 rounded-0">
              Login
            </button>
          </form>

          <p>Don't have an account? Create One!!</p>
          <Link to="/signup" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
