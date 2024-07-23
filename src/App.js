import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookingForm from "./components/BookingForm";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<BookingForm />} />
        </Routes>
        <ToastContainer />
    </Router>
  );
}

export default App;
