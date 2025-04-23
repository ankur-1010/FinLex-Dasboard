import React from "react";
import { Layout } from "antd";
import DashboardTable from "../components/DashboardTable";

const { Content } = Layout;

const Dashboard = () => {
    return (
        <Content style={{ margin: "16px" }}>
            <h2>Dashboard</h2>
            <DashboardTable />
        </Content>
    );
};

export default Dashboard;
