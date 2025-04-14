import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Row, Col, Spin, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const DashboardTable = () => {
    const [activeTable, setActiveTable] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fxTrades, setFxTrades] = useState([]);
    const [equityTrades, setEquityTrades] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [fxRes, eqRes] = await Promise.all([
                    fetch("http://localhost:3001/fxTrades"),
                    fetch("http://localhost:3001/equityTrades"),
                ]);
                const [fxData, eqData] = await Promise.all([fxRes.json(), eqRes.json()]);
                setFxTrades(fxData);
                setEquityTrades(eqData);
            } catch (err) {
                console.error("Error fetching data:", err);
                alert("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text?.toString() ?? ""}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const searchableAndSortableKeys = ["tradeID", "counterparty", "productType", "traderName"];

    const enhanceColumns = (cols) =>
        cols.map((col) => {
            const isSearchable = searchableAndSortableKeys.includes(col.dataIndex);
            return {
                ...col,
                ...(isSearchable ? getColumnSearchProps(col.dataIndex) : {}),
                sorter: (a, b) => a[col.dataIndex]?.toString().localeCompare(b[col.dataIndex]?.toString()),
            };
        });

    const fxColumns = enhanceColumns([
        { title: "Trade ID", dataIndex: "tradeID", key: "tradeID", fixed: "left" },
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
        { title: "Currency Pair", dataIndex: "currencyPair", key: "currencyPair", fixed: "right" },
    ]);

    const equityColumns = enhanceColumns([
        { title: "Trade ID", dataIndex: "tradeID", key: "tradeID", fixed: "left" },
        { title: "Trade Date", dataIndex: "tradeDate", key: "tradeDate" },
        { title: "Value Date", dataIndex: "valueDate", key: "valueDate" },
        { title: "Counterparty", dataIndex: "counterparty", key: "counterparty" },
        { title: "Product Type", dataIndex: "productType", key: "productType" },
        { title: "Buy/Sell", dataIndex: "buySell", key: "buySell" },
        { title: "Quantity", dataIndex: "quantity", key: "quantity" },
        { title: "Ticker", dataIndex: "ticker", key: "ticker" },
        { title: "Price", dataIndex: "price", key: "price" },
        { title: "Execution Venue", dataIndex: "executionVenue", key: "executionVenue" },
        { title: "Trader Name", dataIndex: "traderName", key: "traderName", fixed: "right" },
    ]);

    const columns = activeTable === "fxTrades" ? fxColumns : equityColumns;
    const dataSource = activeTable === "fxTrades" ? fxTrades : equityTrades;

    return (
        <div style={{ padding: 16 }}>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col>
                    <Button type={activeTable === "fxTrades" ? "primary" : "default"} onClick={() => setActiveTable("fxTrades")}>FX Trades</Button>
                </Col>
                <Col>
                    <Button type={activeTable === "equityTrades" ? "primary" : "default"} onClick={() => setActiveTable("equityTrades")}>Equity Trades</Button>
                </Col>
            </Row>

            {loading ? (
                <Spin />
            ) : activeTable ? (
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="tradeID"
                    scroll={{ x: 1500 }}
                    pagination={{ pageSize: 10 }}
                    bordered
                    sticky={true}
                    size="middle"
                    style={{ backgroundColor: "#fff", borderRadius: "8px" }}
                    className="custom-table"
                    title={() => <h2>{activeTable === "fxTrades" ? "FX Trades" : "Equity Trades"}</h2>}
                    footer={() => <div>Total {dataSource.length} trades</div>}
                    locale={{ emptyText: "No data available" }}
                />
            ) : (
                <p>Select a table to view its data.</p>
            )}
        </div>
    );
};

export default DashboardTable;
