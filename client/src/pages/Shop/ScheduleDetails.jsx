import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../utils/axiosInstance";

import Navbar from "../../components/Shop/Navbar";
import SubNav from "../../components/Shop/SubNav";
import Footer from "../../components/Footer";
import Styles from "../ShopStyles/Bookings.module.css";
import { toast } from "react-hot-toast";

const ScheduleDetails = () => {
  const Navigate = useNavigate();
  const shop = useSelector((state) => state.client.shop);
  const rehydrated = useSelector((state) => state._persist?.rehydrated);

  const [records, setRecords] = useState([]);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!rehydrated) return; // wait for Redux persist
    if (!shop) Navigate("/s/sLogin");
  }, [shop, rehydrated, Navigate]);

  // ✅ Fetch schedule only if shop exists
  useEffect(() => {
    if (!rehydrated || !shop) return;

    async function getSlots() {
      try {
        const { data } = await api.get("/s/sSchedule");
        if (data.message) {
          toast.error("Something went wrong, please re-login");
        } else {
          setRecords(data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    }

    getSlots();
  }, [shop, rehydrated]);

  const customStyles = {
    headRow: { style: { backgroundColor: "black", color: "white" } },
    headCells: { style: { fontSize: "16px", fontWeight: "600", textTransform: "uppercase" } },
    cells: { style: { fontSize: "15px" } },
  };

  const column = [
    { name: "Employee Name", selector: (row) => row.employeeName, sortable: true },
    { name: "Time", selector: (row) => row.time, sortable: true },
    { name: "Services", selector: (row) => row.service.join(","), sortable: true },
    { name: "User Name", selector: (row) => row.userName, sortable: true },
    {
      name: "Date",
      selector: (row) => {
        const date = new Date(row.date);
        return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
      },
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.status ? <span style={{ color: "green" }}>Active</span> : <span style={{ color: "red" }}>Cancelled</span>,
    },
  ];

  return (
    <>
      <Navbar />
      <SubNav />
      <div className={Styles.body}>
        <div style={{ padding: "50px 10%" }}>
          <DataTable columns={column} data={records} customStyles={customStyles} pagination />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ScheduleDetails;
