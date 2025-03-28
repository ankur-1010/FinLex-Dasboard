import React from "react";
import { Table, Tag } from "antd";

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
    const columns = [
        {
            title: "Message Date",
            dataIndex: "messageDate",
            key: "messageDate",
        },
        {
            title: "Response ID",
            dataIndex: "responseID",
            key: "responseID",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "FAILED" ? "red" : "green"}>{status}</Tag>
            ),
        },
        {
            title: "Product Type",
            dataIndex: "productType",
            key: "productType",
        },
    ];

    return <Table columns={columns} dataSource={data} />;
};

export default DashboardTable;
