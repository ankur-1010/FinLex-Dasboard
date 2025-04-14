import React, { useEffect, useState, useRef } from "react";
import {
    Table,
    Button,
    Row,
    Col,
    Spin,
    Input,
    Space,
    Popover,
    Tooltip,
} from "antd";
import {
    SearchOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    PushpinOutlined,
    PushpinFilled,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const DashboardTable = () => {
    const [activeTable, setActiveTable] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fxTrades, setFxTrades] = useState([]);
    const [equityTrades, setEquityTrades] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [columnSettings, setColumnSettings] = useState({});
    const searchInput = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [fxRes, eqRes] = await Promise.all([
                    fetch("http://localhost:3001/fxTrades"),
                    fetch("http://localhost:3001/equityTrades"),
                ]);
                const [fxData, eqData] = await Promise.all([
                    fxRes.json(),
                    eqRes.json(),
                ]);
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
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
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
            <SearchOutlined style={{ color: filtered ? " #a2250a " : undefined }} />
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

    const togglePin = (key) => {
        setColumnSettings((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                fixed: prev[key]?.fixed === "left" ? undefined : "left",
            },
        }));
    };

    const toggleVisibility = (key) => {
        setColumnSettings((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                visible: !prev[key]?.visible,
            },
        }));
    };

    const enhanceColumns = (cols) =>
        cols
            .map((col) => {
                const settings = columnSettings[col.key] || {};
                const isVisible = settings.visible !== false;
                const isSearchable = ["tradeID", "counterparty", "productType", "traderName"].includes(col.dataIndex);

                return isVisible
                    ? {
                        ...col,
                        ...(isSearchable ? getColumnSearchProps(col.dataIndex) : {}),
                        sorter: (a, b) =>
                            a[col.dataIndex]?.toString().localeCompare(
                                b[col.dataIndex]?.toString()
                            ),
                        fixed: settings.fixed,
                    }
                    : null;
            })
            .filter(Boolean);

    const baseFxColumns = [
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

    const baseEquityColumns = [
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

    const columns = enhanceColumns(
        activeTable === "fxTrades" ? baseFxColumns : baseEquityColumns
    );
    const dataSource = activeTable === "fxTrades" ? fxTrades : equityTrades;
    const currentBaseColumns = activeTable === "fxTrades" ? baseFxColumns : baseEquityColumns;

    const renderColumnSettings = () => (
        <div style={{ display: "flex", flexDirection: "column", minWidth: 200 }}>
            {currentBaseColumns.map((col) => {
                const key = col.key;
                const visible = columnSettings[key]?.visible !== false;
                const pinned = columnSettings[key]?.fixed === "left";

                return (
                    <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                        <Tooltip title={visible ? "Hide" : "Show"}>
                            <Button
                                type="text"
                                icon={visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                onClick={() => toggleVisibility(key)}
                            />
                        </Tooltip>
                        <Tooltip title={pinned ? "Unpin" : "Pin to left"}>
                            <Button
                                type="text"
                                icon={pinned ? <PushpinFilled /> : <PushpinOutlined />}
                                onClick={() => togglePin(key)}
                            />
                        </Tooltip>
                        <span style={{ marginLeft: 8 }}>{col.title}</span>
                    </div>
                );
            })}
        </div>
    );

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
                {activeTable && (
                    <Col>
                        <Popover
                            content={renderColumnSettings()}
                            title="Select Primary Columns"
                            trigger="click"
                            placement="bottomRight"
                        >
                            <Button
                                type="primary"
                                style={{ backgroundColor: "green", borderColor: "green" }}
                            >
                                Primary Column
                            </Button>
                        </Popover>
                    </Col>
                )}
            </Row>

            {loading ? (
                <Spin />
            ) : activeTable ? (
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="tradeID"
                    scroll={{ x: 1500 }}
                    pagination={{ position: ["bottomCenter"], showSizeChanger: true, showQuickJumper: true, defaultPageSize: 10, pageSizeOptions: [10, 20, 50] }}
                    bordered
                    sticky={true}
                    size="middle"
                    style={{ backgroundColor: "#fff", borderRadius: "8px" }}
                    className="custom-table"
                    title={() => (
                        <h2>
                            {activeTable === "fxTrades" ? "FX Trades" : "Equity Trades"}
                        </h2>
                    )}
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
