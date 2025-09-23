import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../../utils/axiosInstance";  // ✅ our axios instance
import styles from "../ClientStyles/Otp.module.css";

import Navbar from "../../components/users/Navbar";
import Footer from "../../components/Footer";
import { useUserData } from "../../contexts/userContexts";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const { userData, setUserData } = useUserData();
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const Navigate = useNavigate();

  const otpSubmit = async (e) => {
    e.preventDefault();
    userData.userOtp = otp;
    const { userName, email, password, cPassword, userOtp } = userData;

    try {
      const { data } = await api.post("/submit-otp", {
        userName, email, password, cPassword, userOtp,
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        setOtp("");
        setUserData({});
        Navigate("/login");
        toast.success("Registration successful");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (!userData.email) {
      Navigate("/register");
    }

    if (timer > 0 && resendDisabled) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [timer, resendDisabled]);

  const resendOtp = async () => {
    try {
      setResendDisabled(true);
      setTimer(60);

      const { data } = await api.post("/resend-otp", { email: userData.email });
      if (data.error) {
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.login}>
        <div className={styles.Login_Container}>
          <div className={styles.Login_sub}>
            <h1 className={styles.Login_text}>OTP</h1>
            <hr className={styles.divider} />
            <form onSubmit={otpSubmit}>
              <div className={styles.form_group}>
                <label>Enter OTP</label>
                <input
                  className={styles.input}
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button type="submit" className={styles.LoginButton}>
                  Confirm
                </button>
              </div>
            </form>
            <button
              className={styles.resend}
              disabled={resendDisabled}
              onClick={resendOtp}
            >
              {resendDisabled ? `Resend in ${timer} seconds` : "Resend"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Otp;
