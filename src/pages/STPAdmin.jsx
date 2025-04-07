import React from "react";
import { Layout, Table } from "antd";

const { Content } = Layout;

const data = [
    { key: "1", id: "A001", role: "Admin", status: "Active" },
    { key: "2", id: "A002", role: "User", status: "Inactive" },
    { key: "3", id: "A003", role: "Moderator", status: "Active" },
];

const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Status", dataIndex: "status", key: "status" },
];

const STPAdmin = () => {
    return (
        <Content style={{ margin: "16px" }}>
            <h2>STPAdmin Page</h2>
            <Table dataSource={data} columns={columns} />
        </Content>
    );
};

export default STPAdmin;