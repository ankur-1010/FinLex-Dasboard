import React, { useState } from "react";
import { Table, Tag, Dropdown, Menu, Button, Checkbox } from "antd";
import { DownOutlined } from "@ant-design/icons";

const data = [
    {
        key: "1",
        messageDate: "2025-03-25 11:43:40",
        responseID: "BLOM_919970221T",
        status: "FAILED",
        productType: "MM Deposit",
    },
    {
        key: "2",
        messageDate: "2025-03-25 11:48:20",
        responseID: "BLOM_919970221T",
        status: "SUCCESS",
        productType: "FX Swap",
    },
    {
        key: "3",
        messageDate: "2025-03-20 11:08:20",
        responseID: "BLOM_9199704421T",
        status: "SUCCESS",
        productType: "BX Swap",
    },
];

const DashboardTable = () => {
    const [visibleColumns, setVisibleColumns] = useState({
        messageDate: true,
        responseID: true,
        status: true,
        productType: true,
    });

    const columns = [
        {
            title: "Message Date",
            dataIndex: "messageDate",
            key: "messageDate",
            visible: visibleColumns.messageDate,
        },
        {
            title: "Response ID",
            dataIndex: "responseID",
            key: "responseID",
            visible: visibleColumns.responseID,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            visible: visibleColumns.status,
            render: (status) => (
                <Tag color={status === "FAILED" ? "red" : "green"}>{status}</Tag>
            ),
        },
        {
            title: "Product Type",
            dataIndex: "productType",
            key: "productType",
            visible: visibleColumns.productType,
        },
    ];

    const handleCheckboxChange = (columnKey) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [columnKey]: !prev[columnKey],
        }));
    };

    const menu = (
        <Menu>
            {Object.keys(visibleColumns).map((columnKey) => (
                <Menu.Item key={columnKey}>
                    <Checkbox
                        checked={visibleColumns[columnKey]}
                        onChange={() => handleCheckboxChange(columnKey)}
                    >
                        {columnKey}
                    </Checkbox>
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <div>
            <Dropdown overlay={menu} trigger={['click']}>
                <Button>
                    Select Columns <DownOutlined />
                </Button>
            </Dropdown>
            <Table
                columns={columns.filter((col) => visibleColumns[col.key])}
                dataSource={data}
                style={{ marginTop: 16 }}
            />
        </div>
    );
};

export default DashboardTable;