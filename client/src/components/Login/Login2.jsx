import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login2.css'; // Import the CSS file
import { StaffAdminLoginThunk } from "../redux/slices/StaffAdminSlice";
import axios from "axios";

function Login2() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const { currentUser, loginUserStatus } = useSelector((state) => state.StaffAdminLoginReducer);

  function onLoginFormSubmit(userCred) {
    console.log("from login", userCred);
    dispatch(StaffAdminLoginThunk(userCred));
    console.log("from login status", loginUserStatus);
  }
  const sendEmail = async (email) => {
    try {
      const res = await axios.post("http://localhost:4000/staff-api/sendemail", { email }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Email sent:', res.data);
    } catch (error) {
      console.error('Error sending email:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (loginUserStatus) {
      if (currentUser?.userType === "staff") {
        sendEmail(currentUser.email);
        navigate("/staff-profile");

      } else if (currentUser?.userType === "admin") {
        navigate("/admin-profile");
      }
    }
  }, [loginUserStatus, currentUser]);

  return (
    <div>
      <div className="login-outer-container">
        <div className="login-container">
          <div className="login-heading">Login</div>
          <form className="login-form" onSubmit={handleSubmit(onLoginFormSubmit)}>
            <div className="login-radio-container">
              <div className="login-radio">
                <p className="login-radio-label">Admin</p>
                <input
                  type="radio"
                  value="admin"
                  {...register("userType")}
                  name="userType" // Add name attribute
                />
              </div>
              <div className="login-radio">
                <p className="login-radio-label">Staff</p>
                <input
                  type="radio"
                  value="staff"
                  {...register("userType")}
                  name="userType" // Add name attribute
                />
              </div>
            </div>
            <input
              required
              className="login-input"
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              {...register("username")}
            />
            <input
              required
              className="login-input"
              type="password"
              id="password"
              {...register("password")}
              placeholder="Password"
            />
            <button className="loginn-button" type="submit">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login2;
