import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col } from "antd";
import "./Table.css";

const DashboardTable = () => {
    const [activeTable, setActiveTable] = useState(null);
    const [fxTradesData, setFxTradesData] = useState([]);
    const [equityTradesData, setEquityTradesData] = useState([]);

    const fxTradesColumns = [
        { title: "Trade ID", dataIndex: "tradeID", key: "tradeID" },
        { title: "Trade Date", dataIndex: "tradeDate", key: "tradeDate" },
        { title: "Value Date", dataIndex: "valueDate", key: "valueDate" },
        { title: "Counterparty", dataIndex: "counterparty", key: "counterparty" },
        { title: "Product Type", dataIndex: "productType", key: "productType" },
        { title: "Buy/Sell", dataIndex: "buySell", key: "buySell" },
        { title: "Notional", dataIndex: "notional", key: "notional" },
        { title: "Currency", dataIndex: "currency", key: "currency" },
        { title: "Rate", dataIndex: "rate", key: "rate" },
        { title: "Execution Venue", dataIndex: "executionVenue", key: "executionVenue" },
        { title: "Trader Name", dataIndex: "traderName", key: "traderName" },
        { title: "Currency Pair", dataIndex: "currencyPair", key: "currencyPair" },
    ];

    const equityTradesColumns = [
        { title: "Trade ID", dataIndex: "tradeID", key: "tradeID" },
        { title: "Trade Date", dataIndex: "tradeDate", key: "tradeDate" },
        { title: "Value Date", dataIndex: "valueDate", key: "valueDate" },
        { title: "Counterparty", dataIndex: "counterparty", key: "counterparty" },
        { title: "Product Type", dataIndex: "productType", key: "productType" },
        { title: "Buy/Sell", dataIndex: "buySell", key: "buySell" },
        { title: "Quantity", dataIndex: "quantity", key: "quantity" },
        { title: "Ticker", dataIndex: "ticker", key: "ticker" },
        { title: "Price", dataIndex: "price", key: "price" },
        { title: "Execution Venue", dataIndex: "executionVenue", key: "executionVenue" },
        { title: "Trader Name", dataIndex: "traderName", key: "traderName" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch FX Trades data
                const fxResponse = await fetch("http://localhost:3001/fxTrades");
                const fxData = await fxResponse.json();
                setFxTradesData(fxData);

                // Fetch Equity Trades data
                const equityResponse = await fetch("http://localhost:3001/equityTrades");
                const equityData = await equityResponse.json();
                setEquityTradesData(equityData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleButtonClick = (table) => {
        setActiveTable(table);
    };

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                <Col>
                    <Button
                        type={activeTable === "fxTrades" ? "primary" : "default"}
                        onClick={() => handleButtonClick("fxTrades")}
                    >
                        FX Trades
                    </Button>
                </Col>
                <Col>
                    <Button
                        type={activeTable === "equityTrades" ? "primary" : "default"}
                        onClick={() => handleButtonClick("equityTrades")}
                    >
                        Equity Trades
                    </Button>
                </Col>
            </Row>

            {activeTable === "fxTrades" && (
                <Table
                    dataSource={fxTradesData}
                    columns={fxTradesColumns}
                    style={{ marginTop: 16 }}
                    scroll={{ x: 1000 }} // Enables horizontal scrolling
                />
            )}

            {activeTable === "equityTrades" && (
                <Table
                    dataSource={equityTradesData}
                    columns={equityTradesColumns}
                    style={{ marginTop: 16 }}
                    scroll={{ x: 1000 }} // Enables horizontal scrolling
                />
            )}
        </div>
    );
};

export default DashboardTable;