import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./components/Sidebar";
import AppHeader from "./components/Header";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <AppHeader />
          <AppRoutes />
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
