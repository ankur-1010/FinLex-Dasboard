import React from "react";
import { Layout, Table } from "antd";

const { Content } = Layout;

const data = [
    { key: "1", name: "John Doe", age: 32, address: "10 Downing Street" },
    { key: "2", name: "Jane Smith", age: 28, address: "20 Oxford Street" },
    { key: "3", name: "Sam Wilson", age: 45, address: "30 Baker Street" },
];

const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Address", dataIndex: "address", key: "address" },
];

const STP = () => {
    return (
        <Content style={{ margin: "16px" }}>
            <h2>STP Page</h2>
            <Table dataSource={data} columns={columns} />
        </Content>
    );
};

export default STP;