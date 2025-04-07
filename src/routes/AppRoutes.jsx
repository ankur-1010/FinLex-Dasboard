import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Messages from "../pages/Messages";
import Endpoints from "../pages/Endpoints";
import STP from "../pages/STP";
import STPAdmin from "../pages/STPAdmin";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/endpoints" element={<Endpoints />} />
            <Route path="/stp" element={<STP />} />
            <Route path="/stpadmin" element={<STPAdmin />} />
        </Routes>
    );
};

export default AppRoutes;