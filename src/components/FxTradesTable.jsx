import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Button, Space, Tooltip, Popover } from "antd";
import { SearchOutlined, EyeOutlined, EyeInvisibleOutlined, PushpinOutlined, PushpinFilled } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const FxTradesTable = () => {
    const [fxTrades, setFxTrades] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [columnSettings, setColumnSettings] = useState({});
    const [loading, setLoading] = useState(false);
    const searchInput = useRef(null);

    useEffect(() => {
        const fetchFxTrades = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:3001/fxTrades");
                const data = await response.json();
                setFxTrades(data);
            } catch (error) {
                console.error("Error fetching FX trades:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFxTrades();
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
            <SearchOutlined style={{ color: filtered ? "#a2250a" : undefined }} />
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

    const columns = enhanceColumns(baseFxColumns);

    const renderColumnSettings = () => (
        <div style={{ display: "flex", flexDirection: "column", minWidth: 200 }}>
            {baseFxColumns.map((col) => {
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
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 5 }}>
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
            </div>
            
            <Table
                dataSource={fxTrades}
                columns={columns}
                rowKey="tradeID"
                loading={loading}
                scroll={{ x: 1500 }}
                pagination={{ position: ["bottomCenter"], showSizeChanger: true, showQuickJumper: true, defaultPageSize: 10, pageSizeOptions: [10, 20, 50] }}
                bordered
                sticky={true}
                size="middle"
                style={{ backgroundColor: "#fff", borderRadius: "8px" }}
                className="custom-table"
                title={() => <h2>FX Trades</h2>}
                footer={() => <div>Total {fxTrades.length} trades</div>}
                locale={{ emptyText: "No data available" }}
            />
        </div>
    );
};

export default FxTradesTable;