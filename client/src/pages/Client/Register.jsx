// src/pages/Client/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

import Navbar from "../../components/users/Navbar";
import Footer from "../../components/Footer";
import styles from "../ClientStyles/Register.module.css";
import { useUserData } from "../../contexts/userContexts";
import api from "../../utils/axiosInstance"; // Axios instance with baseURL

// ------------------- Google OAuth Component -------------------
const GoogleAuthComponent = () => {
  const Navigate = useNavigate();

  const onSuccess = async (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      const gName = decoded.name;
      const gEmail = decoded.email;

      const { data } = await api.post("/googleLogin", { gName, gEmail });

      if (data.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem("userData", JSON.stringify(data));
        Navigate("/");
        toast.success("Login successful");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const onError = () => {
    console.log("Google Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId="815839922134-9i576f0a2fcpt2bje8vpjo1gs1o8gk6s.apps.googleusercontent.com">
      <GoogleLogin onSuccess={onSuccess} onError={onError} />
    </GoogleOAuthProvider>
  );
};

// ------------------- Register Component -------------------
const Register = () => {
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
    cPassword: "",
  });

  const Navigate = useNavigate();
  const { setUserData: setUserDataContext } = useUserData();

  const registerUser = async (e) => {
    e.preventDefault();
    const { userName, email, password, cPassword } = userData;

    try {
      const { data } = await api.post("/register", {
        userName,
        email,
        password,
        cPassword,
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        // Save user data to context
        setUserDataContext({ userName, email, password, cPassword });
        // Reset form
        setUserData({ userName: "", email: "", password: "", cPassword: "" });
        // Navigate to OTP page, passing email
        Navigate("/clientOTP", { state: { email } });
        toast.success("Registration successful, please verify OTP");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error during registration");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.login}>
        <div className={styles.Login_Container}>
          <div className={styles.Login_sub}>
            <h1 className={styles.Login_text}>Client Sign Up</h1>
            <hr className={styles.divider} />
            <br />
            <form onSubmit={registerUser}>
              <div className={styles.form_group}>
                <label>Username</label>
                <input
                  className={styles.input}
                  type="text"
                  value={userData.userName}
                  onChange={(e) => setUserData({ ...userData, userName: e.target.value })}
                  required
                />
                <label>Email</label>
                <input
                  className={styles.input}
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  required
                />
                <label>Password</label>
                <input
                  className={styles.input}
                  type="password"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  required
                />
                <label>Confirm Password</label>
                <input
                  className={styles.input}
                  type="password"
                  value={userData.cPassword}
                  onChange={(e) => setUserData({ ...userData, cPassword: e.target.value })}
                  required
                />

                <hr className={styles.divider} />
                <br />
                <button type="submit" className={styles.LoginButton}>
                  Submit
                </button>

                <br />
                <div className={styles.google}>
                  <GoogleAuthComponent />
                </div>

                <h6 style={{ color: "black" }}>Already have an account?</h6>
                <button
                  type="button"
                  onClick={() => Navigate("/login")}
                  className={styles.signUpbtn}
                >
                  Login Here
                </button>
              </div>
            </form>

            <button
              className={styles.btn1}
              onClick={() => Navigate("/s/sRegister")}
            >
              Beautician Sign Up
            </button>
            <button
              className={styles.btn2}
              onClick={() => Navigate("/register")}
            >
              Client Sign Up
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
