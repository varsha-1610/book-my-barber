import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import client from "../../../public/contentImages/Group21.png";
import beautician from "../../../public/contentImages/Group22.png";
import iphone from "../../../public/contentImages/phonegif.gif";

import style from "../ClientStyles/Home.module.css";
import Navbar from "../../components/CommonNav";
import Footer from "../../components/Footer";
import Loader from "../../components/HelpingComponents/Loader";
import { logoutUser } from "../../globelContext/shopSlice";
import { useUserData } from "../../contexts/userContexts";

// Create axios instance (so you don’t hardcode URLs everywhere)
const api = axios.create({
  baseURL: "http://localhost:3000", // adjust if backend runs on 4000
  withCredentials: true,
});

const Home = () => {
  const dispatch = useDispatch();
  const [scrolling, setScrolling] = useState(false);
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();

  useEffect(() => {
    async function ifUser() {
      try {
        const { data } = await api.get("/");

        if (data.message) {
          dispatch(logoutUser());
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    }

    ifUser();

    const handleScroll = () => {
      setScrolling(window.scrollY > 0);
    };

    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(delay);
    };
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar scrolling={scrolling} />
          <div className={style.body}></div>
          <div className={style.fade}></div>
          <div className={style.subBody}>
            <div className={style.abovebody}>
              <div className={style.container}>
                <h1 className={style.explore}>Explore</h1>
              </div>
              <div className={style.image}>
                <img
                  onClick={() => Navigate("/login")}
                  className={`${style.image1} ${
                    scrolling ? style["fade-in"] : ""
                  }`}
                  src={client}
                  alt="Client Login"
                />
                <img
                  onClick={() => Navigate("/s/sLogin")}
                  className={`${style.image2} ${
                    scrolling ? style["fade-in"] : ""
                  }`}
                  src={beautician}
                  alt="Shop Login"
                />
              </div>
            </div>

            {/* FOR CLIENT */}
            <div className={style.subContainer}>
              <div className={style.maskedImage}></div>
              <h1
                className={style.h1}
                style={{ color: "black", textDecoration: "underline" }}
              >
                FOR CLIENT
              </h1>

              <div className={style.textDiv}>
                <div className={style.text}>
                  <p className={style.p}>
                    More Than Just An Appointment Booking App, It’s Life Made
                    Easy!
                  </p>
                  <h3 className={style.featuresTitle}>Features</h3>
                  <ul className={style.featureList}>
                    <li>Free access from the web to your barbers’</li>
                    <li>
                      Free access from the web to your barbers’ profile Book
                      your appointments
                    </li>
                    <li>No need to call your barber for Confirm, Decline</li>
                    <li>
                      Reschedule appointments, pay online for services, receive
                      reminders
                    </li>
                    <li>
                      Never miss your appointment — review services & rate your
                      barber
                    </li>
                  </ul>
                </div>
                <div className={style.iphoneImage}>
                  <img className={style.iphone} src={iphone} alt="iPhone" />
                </div>
              </div>
            </div>

            {/* FOR SHOP */}
            <div className={style.subSubContainer}>
              <div className={style.maskedImage}></div>
              <h1
                className={style.h1}
                style={{ color: "black", textDecoration: "underline" }}
              >
                FOR SHOP
              </h1>

              <div className={style.textDiv}>
                <div className={style.text}>
                  <p className={style.p}>
                    Welcome to our Book My Barber website! As a barber, this
                    platform is designed to make your life easier and your
                    business more successful. With our user-friendly dashboard,
                    you can effortlessly manage your schedule, services, and
                    availability. Update your working hours, set your prices,
                    and add or edit services to showcase your unique skills.
                    Join our community of barbers and let our website streamline
                    your booking process, so you can focus on doing what you do
                    best – delivering top-notch haircuts and services to your
                    clients!
                  </p>
                </div>
                <div className={style.iphoneImage}>
                  <img className={style.iphone} src={iphone} alt="iPhone" />
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default Home;
