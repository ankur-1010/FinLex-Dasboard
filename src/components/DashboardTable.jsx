import React, { useState } from "react";
import { Button, Row, Col, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import FxTradesTable from "./FxTradesTable";
import EquityTradesTable from "./EquityTradesTable";

const DashboardTable = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTable, setActiveTable] = useState(() => {
        if (location.pathname.includes("fx-trades")) return "fxTrades";
        if (location.pathname.includes("equity-trades")) return "equityTrades";
        return null;
    });

    const handleTableChange = (table) => {
        setActiveTable(table);
        if (table === "fxTrades") {
            navigate("/fx-trades");
        } else if (table === "equityTrades") {
            navigate("/equity-trades");
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <Row
                justify="space-between"
                align="middle"
                gutter={[16, 16]}
                style={{ marginBottom: 16 }}
            >
                <Col xs={24} sm={24} md={12}>
                    <Space
                        direction="horizontal"
                        size="middle"
                        wrap
                        style={{ width: "100%", justifyContent: "start" }}
                    >
                        <Button
                            block={window.innerWidth < 576}
                            type={activeTable === "fxTrades" ? "primary" : "default"}
                            onClick={() => handleTableChange("fxTrades")}
                        >
                            FX Trades
                        </Button>
                        <Button
                            block={window.innerWidth < 576}
                            type={activeTable === "equityTrades" ? "primary" : "default"}
                            onClick={() => handleTableChange("equityTrades")}
                        >
                            Equity Trades
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    {activeTable === "fxTrades" && <FxTradesTable />}
                    {activeTable === "equityTrades" && <EquityTradesTable />}
                    {!activeTable && <p>Select a table to view its data.</p>}
                </Col>
            </Row>
        </div>
    );
};

export default DashboardTable;
