import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

import { BsPencil } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../../components/Shop/Navbar";
import SubNav from "../../components/Shop/SubNav";
import Footer from "../../components/Footer";
import Styles from "../ShopStyles/Bookings.module.css";
import { logoutShop } from "../../globelContext/clientSlice";
import EmployeeFormModal from "../../components/ModalComponent/EmployeeFormModal";
import EmployeeFormModalForDate from "../../components/ModalComponent/EmployeeFormModalForDate";
import EmployeeFormModalLeave from "../../components/ModalComponent/EmloyeeLeave";
import api from "../../utils/axiosInstance"; // Axios instance with baseURL

const Bookings = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const shop = useSelector((state) => state.client.shop);
  const rehydrated = useSelector((state) => state._persist?.rehydrated);

  // Redirect if shop is not logged in
  useEffect(() => {
    if (!rehydrated) return; // wait for Redux Persist
    if (!shop) Navigate("/s/sLogin");
  }, [shop, rehydrated, Navigate]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalForDateOpen, setIsModalForDateOpen] = useState(false);
  const [isModalForLeave, setIsModalForLeave] = useState(false);
  const [id, setId] = useState("");
  const [records, setRecords] = useState([]);
  const [filterRecords, setFilterRecords] = useState([]);

  // Fetch bookings only if shop exists and is rehydrated
  useEffect(() => {
    if (!rehydrated || !shop) return;

    const fetchData = async () => {
      try {
        const { data } = await api.get("/s/sBookings");
        if (data.message) {
          toast.error("Something went wrong, please re-login");
          dispatch(logoutShop());
          Navigate("/s/sLogin");
        } else {
          setRecords(data);
          setFilterRecords(data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    };

    fetchData();
  }, [rehydrated, shop, Navigate, dispatch, isModalOpen, id]);

  const handleFilter = (event) => {
    const newData = filterRecords.filter(
      (row) =>
        row.employeeName.toLowerCase().includes(event.target.value.toLowerCase()) ||
        row.date.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setRecords(newData);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openModalForDate = (id) => {
    setId(id);
    setIsModalForDateOpen(true);
  };
  const openModalForLeave = (id) => {
    setId(id);
    setIsModalForLeave(true);
  };
  const closeModalForDate = () => {
    setIsModalForDateOpen(false);
    setIsModalForLeave(false);
  };

  const renderDateWithEditIcon = (row) => {
    const date = new Date(row.date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return (
      <div>
        <span>{date}</span>
        <button onClick={() => openModalForDate(row._id)} style={{ marginLeft: "5px", background: "none", border: "none", cursor: "pointer" }}>
          <BsPencil />
        </button>
      </div>
    );
  };

  const takeLeave = (row) => {
    const date = new Date(row.leave).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return (
      <div>
        <span>{date}</span>
        <button onClick={() => openModalForLeave(row._id)} style={{ marginLeft: "5px", background: "none", border: "none", cursor: "pointer" }}>
          <BsPencil />
        </button>
      </div>
    );
  };

  const column = [
    { name: "Employee Name", selector: (row) => row.employeeName, sortable: true },
    { name: "Time", selector: (row) => <ul>{row.Time.map((t, i) => <li key={i}>{t}</li>)}</ul>, sortable: true },
    { name: "Services", selector: (row) => <ul>{row.service.map((s, i) => <li key={i}>{s}</li>)}</ul>, sortable: true },
    { name: "Date", selector: "date", sortable: true, cell: renderDateWithEditIcon },
    {
      name: "Access",
      cell: (row) => (
        <div className={Styles.btnTrash}>
          <button className={row.access ? Styles.redButton : Styles.greenButton} onClick={() => handleAccessClick(row._id)}>
            {row.access ? "Hide" : "UnHide"}
          </button>
          <div><FaTrash onClick={() => deleteEmployee(row._id)} /></div>
        </div>
      ),
    },
    { name: "Leave Date", cell: takeLeave },
  ];

  const deleteEmployee = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Do you want to Delete?",
        showCancelButton: true,
        confirmButtonText: "Delete",
      });
      if (result.isConfirmed) {
        const { data } = await api.delete(`/s/delEm/${id}`);
        setRecords(data);
        Swal.fire("Deleted!", "", "success");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleAccessClick = async (id) => {
    try {
      const { data } = await api.post("/s/sEditAccess", { id });
      if (data.error) toast.error(data.error);
      else setRecords(data);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const customStyles = {
    headRow: { style: { backgroundColor: "black", color: "white" } },
    headCells: { style: { fontSize: "16px", fontWeight: "600", textTransform: "uppercase" } },
    cells: { style: { fontSize: "15px" } },
  };

  return (
    <>
      <Navbar />
      <SubNav />
      <div className={Styles.body}>
        <div style={{ padding: "50px 10%", paddingBottom: "6rem" }}>
          <div style={{ display: "flex", justifyContent: "right" }}>
            <input type="text" placeholder="🔍Search..." className={Styles.inputSearch} onChange={handleFilter} style={{ padding: "6px 10px" }} />
          </div>
          <button className={Styles.btn} onClick={openModal}>ADD EMPLOYEE</button>
          <DataTable columns={column} data={records} customStyles={customStyles} pagination />
        </div>
      </div>
      <Footer />
      <EmployeeFormModal isOpen={isModalOpen} onRequestClose={closeModal} />
      <EmployeeFormModalForDate isOpen={isModalForDateOpen} onRequestClose={closeModalForDate} empId={id} onDateUpdate={setRecords} />
      <EmployeeFormModalLeave isOpen={isModalForLeave} onRequestClose={closeModalForDate} empId={id} onDateUpdate={setRecords} />
    </>
  );
};

export default Bookings;
