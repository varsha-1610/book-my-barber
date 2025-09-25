import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

import styles from "../ClientStyles/Login.module.css";
import api from "../../utils/axiosInstance"; // Axios instance with baseURL

import Navbar from "../../components/users/Navbar";
import Footer from "../../components/Footer";
import { loginClient } from "../../globelContext/clientSlice";
import { useUserData } from "../../contexts/userContexts";
import { jsonParseUserDataString } from "../../../helpers/JSONparse.js";

// ------------------ Google Auth ------------------
const GoogleAuthComponent = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const onSuccess = async (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      const gName = decoded.name;
      const gEmail = decoded.email;

      const { data } = await api.post("/googleLogin", { gName, gEmail });

      if (data.error) {
        toast.error(data.error);
      } else {
        dispatch(loginClient(data));
        Navigate("/search");
        toast.success("Login successful");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in Google login");
    }
  };

  const onError = () => {
    console.log("Google Login Failed");
    toast.error("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId="815839922134-9i576f0a2fcpt2bje8vpjo1gs1o8gk6s.apps.googleusercontent.com">
      <GoogleLogin onSuccess={onSuccess} onError={onError} />
    </GoogleOAuthProvider>
  );
};

// ------------------ Main Login ------------------
const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const Navigate = useNavigate();
  const { setUserData: setUserDataContext } = useUserData();
  const dispatch = useDispatch();

  // ------------------ Login ------------------
  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;

    try {
      const { data: res } = await api.post("/login", { email, password });

      if (res.error) {
        toast.error(res.error);
      } else {
        dispatch(loginClient(res));
        Navigate("/search");
        toast.success("Login successful");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // ------------------ Forgot Password ------------------
  const forgotPassword = async () => {
    const email = data.email;
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    try {
      const { data: res } = await api.post("/changePassword", { email });

      if (res.error) {
        toast.error(res.error);
      } else {
        setUserDataContext({ email: res.email });
        Navigate("/fClOtp"); // <-- Navigate to OTP verification page
        toast.success("OTP sent to your email");
      }
    } catch (error) {
      console.log(error, "Error in forgotPassword");
      toast.error("Something went wrong in Forgot Password");
    }
  };

  // ------------------ Auto redirect if logged in ------------------
  useEffect(() => {
    let user = jsonParseUserDataString();
    if (user) {
      Navigate("/search");
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.login}>
        <div className={styles.Login_Container}>
          <div className={styles.Login_sub}>
            <h1 className={styles.Login_text}>Client Login</h1>
            <hr className={styles.divider} />
            <br />

            <form onSubmit={loginUser}>
              <div className={styles.form_group}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />

                <label className={styles.label}>Password</label>
                <input
                  className={styles.input}
                  type="password"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />

                <p onClick={forgotPassword} className={styles.forgot_p}>
                  Forgot Password
                </p>

                <hr className={styles.divider} />
                <br />

                <button type="submit" className={styles.LoginButton}>
                  Login
                </button>
                <br />

                <div className={styles.google}>
                  <GoogleAuthComponent />
                </div>

                <h6 className={styles.didnt} style={{ color: "black" }}>
                  Don’t have an account?
                </h6>
                <button
                  type="button"
                  onClick={() => Navigate("/register")}
                  className={styles.signUpbtn}
                >
                  Signup Now
                </button>
              </div>
            </form>

            <button className={styles.btn1} onClick={() => Navigate("/s/sLogin")}>
              Beautician Login
            </button>
            <button className={styles.btn2} onClick={() => Navigate("/login")}>
              Client Login
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
