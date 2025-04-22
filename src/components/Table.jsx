import React, { useState } from "react";
import { Button, Row, Col, Space } from "antd";
import FxTradesTable from "./FxTradesTable";
import EquityTradesTable from "./EquityTradesTable";

const DashboardTable = () => {
    const [activeTable, setActiveTable] = useState(null);
    console.log("Active Table:", activeTable); 
    return (
        <div style={{ padding: 16 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Space>
                        <Button
                            type={activeTable === "fxTrades" ? "primary" : "default"}
                            onClick={() => setActiveTable("fxTrades")}
                        >
                            FX Trades
                        </Button>
                        <Button
                            type={activeTable === "equityTrades" ? "primary" : "default"}
                            onClick={() => setActiveTable("equityTrades")}
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
