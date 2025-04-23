import React, { useState } from "react";
import { Button, Row, Col, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom"; // Import hooks from React Router
import FxTradesTable from "./FxTradesTable";
import EquityTradesTable from "./EquityTradesTable";

const DashboardTable = () => {
    const navigate = useNavigate(); // Hook to navigate programmatically
    const location = useLocation(); // Hook to get the current location
    const [activeTable, setActiveTable] = useState(() => {
        // Set the initial active table based on the URL
        if (location.pathname.includes("fx-trades")) return "fxTrades";
        if (location.pathname.includes("equity-trades")) return "equityTrades";
        return null;
    });

    const handleTableChange = (table) => {
        setActiveTable(table);
        if (table === "fxTrades") {
            navigate("/fx-trades"); // Update the URL for FX Trades
        } else if (table === "equityTrades") {
            navigate("/equity-trades"); // Update the URL for Equity Trades
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Space>
                        <Button
                            type={activeTable === "fxTrades" ? "primary" : "default"}
                            onClick={() => handleTableChange("fxTrades")}
                        >
                            FX Trades
                        </Button>
                        <Button
                            type={activeTable === "equityTrades" ? "primary" : "default"}
                            onClick={() => handleTableChange("equityTrades")}
                        >
                            Equity Trades
                        </Button>
                    </Space>
                </Col>
            </Row>

            {activeTable === "fxTrades" && <FxTradesTable />}
            {activeTable === "equityTrades" && <EquityTradesTable />}
            {!activeTable && <p>Select a table to view its data.</p>}
        </div>
    );
};

export default DashboardTable;