import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Style from "../ModalComponent/Styles/NotificationModal.module.css"; 
import { useSelector, useDispatch } from "react-redux";
import { Notification } from "../../globelContext/clientSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";

const NotificationModal = ({ isOpen, onRequestClose }) => {
  const user = useSelector((state) => state.client.user);
  const dispatch = useDispatch();
  const [noti, setNoti] = useState([]);
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    const getNotification = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/getNotification", {
          params: { userId: user.id },
        });

        setNoti(Array.isArray(data) ? data : []); // Safely handle response
        dispatch(Notification(Array.isArray(data) ? data.length : 0));
      } catch (error) {
        console.log("Notification fetch error:", error);
        toast.error("Something went wrong, please re-login");
        setNoti([]);
        dispatch(Notification(0));
      } finally {
        setLoading(false);
      }
    };

    getNotification();
  }, [user, dispatch]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Notification Modal"
      className={Style.notification_modal}
      overlayClassName={Style.notification_modal_overlay}
    >
      <h2 className={Style.modalHeader}>Notifications</h2>

      {loading ? (
        <p>Loading notifications...</p>
      ) : noti.length > 0 ? (
        <ul className={Style.notificationList}>
          {noti.map((item, index) => (
            <li
              key={index}
              className={Style.bordered}
              onClick={() => Navigate("/details")}
            >
              ⏰ <i>{item.message}</i>{" "}
              {item.time && <b>{item.time}</b>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications</p>
      )}

      <button className={Style.clearButton} onClick={onRequestClose}>
        Close
      </button>
    </Modal>
  );
};

export default NotificationModal;
