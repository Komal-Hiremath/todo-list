import React from 'react'
import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function SignUp(){
    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/register' , {name, email, password})
        .then(result => {
            console.log(result)
            navigate('/login')
     } )
        .catch(err => console.log(err))
    }

    return(
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
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Name</strong>
                        </label>                        
                        <input
                        type="text"
                        placeholder="Enter Name"
                        autoComplete="off"
                        className="form-control rounded-0"
                        onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>                        
                        <input
                        type="email"
                        placeholder="Enter Email"
                        autoComplete="off"
                        className="form-control rounded-0"
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Password</strong>
                        </label>                        
                        <input
                        type="password"
                        placeholder="Enter Password"
                        name="password" 
                        className="form-control rounded-0"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Register
                        </button>
                     </form>

                    <p>Already Have an account!!</p>

                    <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SignUp