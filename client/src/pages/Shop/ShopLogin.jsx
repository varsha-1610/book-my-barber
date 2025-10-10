import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import Navbar from "../../components/Shop/Navbar";
import Footer from "../../components/Footer";
import styles from "../ShopStyles/Login.module.css";

import { loginShop } from "../../globelContext/clientSlice";
import { useUserData } from "../../contexts/userContexts";
import api from "../../utils/axiosInstance"; // Axios instance with baseURL

const ShopLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setUserData: setUserDataContext } = useUserData();

  // ✅ Get shop from Redux persist
  const shop = useSelector((state) => state.client.shop);
  const rehydrated = useSelector((state) => state._persist?.rehydrated);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // ✅ Redirect if already logged in (after rehydration)
  useEffect(() => {
    if (!rehydrated) return; // wait until Redux Persist rehydrates

    if (shop) {
      navigate("/s/sBookings");
    }
  }, [shop, rehydrated, navigate]);

  // ✅ Login handler
  const shopLogin = async (e) => {
    e.preventDefault();
    const { email, password } = data;

    try {
      const { data: res } = await api.post("/s/sLogin", { email, password });

      if (res.error) return toast.error(res.error);

      // ✅ Save shop data to Redux (Redux Persist will handle localStorage automatically)
      dispatch(loginShop(res));

      toast.success("Login successful!");
      navigate("/s/sBookings");
    } catch (error) {
      console.error("Shop Login Error:", error);
      toast.error("Something went wrong");
    }
  };

  // ✅ Forgot password handler
  const forgotPassword = async () => {
    if (!data.email) return toast.error("Enter your email");

    try {
      const { data: res } = await api.post("/s/chPassword", { email: data.email });

      if (res.error) return toast.error(res.error);

      setUserDataContext({ email: res.email });
      navigate("/s/sChOTP");
    } catch (error) {
      console.error("Forgot Password Error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.login}>
        <div className={styles.Login_Container}>
          <div className={styles.Login_sub}>
            <h1 className={styles.Login_text}>Shop Login</h1>
            <hr className={styles.divider} />
            <br />
            <form onSubmit={shopLogin}>
              <div className={styles.form_group}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  type="text"
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
                <p className={styles.forgot_p} onClick={forgotPassword}>
                  Forgot Password
                </p>
                <hr className={styles.divider} />
                <br />
                <button type="submit" className={styles.LoginButton}>
                  Login
                </button>
                <br />
                <h6 style={{ color: "black" }}>don’t have any account?</h6>
                <button
                  type="button"
                  onClick={() => navigate("/s/sRegister")}
                  className={styles.signUpbtn}
                >
                  Signup Now
                </button>
              </div>
            </form>
            <button className={styles.btn1} onClick={() => navigate("/s/sLogin")}>
              Beautician Login
            </button>
            <button className={styles.btn2} onClick={() => navigate("/login")}>
              Client Login
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShopLogin;
