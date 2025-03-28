import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Messages from "../pages/Messages";
import Endpoints from "../pages/Endpoints";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/endpoints" element={<Endpoints />} />
        </Routes>
    );
};

export default AppRoutes;
