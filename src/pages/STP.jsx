import React, { useState } from "react";
import { Layout, Table, Button, Row, Col } from "antd";

const { Content } = Layout;

const tablesData = [
    {
        key: "1",
        data: [
            { key: "1", name: "John Doe", age: 32, address: "10 Downing Street" },
            { key: "2", name: "Jane Smith", age: 28, address: "20 Oxford Street" },
        ],
        columns: [
            { title: "Name", dataIndex: "name", key: "name" },
            { title: "Age", dataIndex: "age", key: "age" },
            { title: "Address", dataIndex: "address", key: "address" },
        ],
    },
    {
        key: "2",
        data: [
            { key: "1", product: "Laptop", price: "$1000" },
            { key: "2", product: "Phone", price: "$500" },
        ],
        columns: [
            { title: "Product", dataIndex: "product", key: "product" },
            { title: "Price", dataIndex: "price", key: "price" },
        ],
    },
    {
        key: "3",
        data: [
            { key: "1", id: "A001", status: "Active" },
            { key: "2", id: "A002", status: "Inactive" },
        ],
        columns: [
            { title: "ID", dataIndex: "id", key: "id" },
            { title: "Status", dataIndex: "status", key: "status" },
        ],
    },
    // Add more tables as needed for buttons 4 to 7
];

const STP = () => {
    const [activeTable, setActiveTable] = useState(null);

    const handleButtonClick = (index) => {
        setActiveTable(index);
    };

    return (
        <Content style={{ margin: "16px" }}>
            <div style={{ marginBottom: "16px" }}>
                <Row gutter={[16, 16]}>
                    {Array.from({ length: 7 }, (_, index) => (
                        <Col key={index}>
                            <Button
                                type="primary"
                                onClick={() => handleButtonClick(index)}
                            >
                                Button {index + 1}
                            </Button>
                        </Col>
                    ))}
                </Row>
            </div>
            
            {activeTable !== null && activeTable < tablesData.length && (
                <Table
                    dataSource={tablesData[activeTable].data}
                    columns={tablesData[activeTable].columns}
                />
            )}
        </Content>
    );
};

export default STP;