import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Button, Tooltip, Popover } from "antd";
import { SearchOutlined, EyeOutlined, EyeInvisibleOutlined, PushpinOutlined, PushpinFilled } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const EquityTradesTable = () => {
    const [equityTrades, setEquityTrades] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [globalSearchTerm, setGlobalSearchTerm] = useState("");
    const [searchInputValue, setSearchInputValue] = useState("");
    const [columnSettings, setColumnSettings] = useState({});
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const searchInput = useRef(null);

    // Fetch data (with optional search)
    const fetchEquityTrades = async (page = 1, pageSize = 10, search = "") => {
        setLoading(true);
        try {
            const encodedSearchTerm = encodeURIComponent(search);
            const url = search
                ? `http://localhost:3000/api/search-equity-trades?search=${encodedSearchTerm}&limit=${pageSize}&page=${page}`
                : `http://localhost:3000/api/equity-trades?limit=${pageSize}&page=${page}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const data = await response.json();

            setEquityTrades(data.data || []); // Assuming the API returns `data` array
            setPagination((prev) => ({
                ...prev,
                total: data.total || 0,
                current: page,
                pageSize,
            }));
        } catch (error) {
            console.error("Error fetching Equity trades:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchEquityTrades(pagination.current, pagination.pageSize);
    }, []);

    // Global search handlers
    const handleGlobalSearch = () => {
        console.log("Global search triggered with value:", searchInputValue);
        setGlobalSearchTerm(searchInputValue);
        fetchEquityTrades(1, pagination.pageSize, searchInputValue);
    };
    const handleClearSearch = () => {
        setSearchInputValue("");
        setGlobalSearchTerm("");
        fetchEquityTrades(1, pagination.pageSize, "");
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter"){
            console.log("Enter key pressed, triggering search");
            handleGlobalSearch(); // Trigger search on "Enter" key press
        } 
    };

    const handleTableChange = (pagination) => {
        fetchEquityTrades(pagination.current, pagination.pageSize, globalSearchTerm);
    };

    // Column-level search
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => {
                        setSearchText(selectedKeys[0] || "");
                        setSearchedColumn(dataIndex);
                    }}
                    style={{ marginBottom: 8, display: "block" }}
                />
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ?.toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text?.toString() || ""}
                />
            ) : (
                text
            ),
    });

    // Pin/unpin columns
    const togglePin = (key) =>{
        setColumnSettings((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                fixed: prev[key]?.fixed === "left" ? undefined : "left",
            },
        }));
    };
       
    // Show/hide columns
    const toggleVisibility = (key) =>{ 
        setColumnSettings((prev) => ({
            ...prev,
            [key]: { ...prev[key], visible: !prev[key]?.visible,

            },
        }));
    };

    // Apply settings & add search/sort
    const enhanceColumns = (cols) =>
        cols
            .map((col) => {
                const settings = columnSettings[col.key] || {};
                const isVisible = settings.visible !== false;
                const isSearchable = [
                    "trade_id",
                        "trade_date",
                        "value_date",
                        "counterparty",
                        "product_type",
                        "buy_sell",
                        "quantity",
                        "ticker",
                        "price",
                        "execution_venue",
                    "trader_name",
                ].includes(col.dataIndex);

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

    const baseEquityColumns = [
        { title: "Trade ID", dataIndex: "trade_id", key: "trade_id" },
        { title: "Trade Date", dataIndex: "trade_date", key: "trade_date" },
        { title: "Value Date", dataIndex: "value_date", key: "value_date" },
        { title: "Counterparty", dataIndex: "counterparty", key: "counterparty" },
        { title: "Product Type", dataIndex: "product_type", key: "product_type" },
        { title: "Buy/Sell", dataIndex: "buy_sell", key: "buy_sell" },
        { title: "Quantity", dataIndex: "quantity", key: "quantity" },
        { title: "Ticker", dataIndex: "ticker", key: "ticker" },
        { title: "Price", dataIndex: "price", key: "price" },
        { title: "Execution Venue", dataIndex: "execution_venue", key: "execution_venue" },
        { title: "Trader Name", dataIndex: "trader_name", key: "trader_name" },
    ];

    const columns = enhanceColumns(baseEquityColumns);

    // Column settings popover content
    const renderColumnSettings = () => (
        <div style={{ display: "flex", flexDirection: "column", minWidth: 220 }}>
            {baseEquityColumns.map((col) => {
                const key = col.key;
                const visible = columnSettings[key]?.visible !== false;
                const pinned = columnSettings[key]?.fixed === "left";
                return (
                    <div
                        key={key}
                        style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
                    >
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
        <div style={{ padding: "1rem" }}>
            {/* Top controls */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginBottom: 16,
                }}
            >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    <Input
                        placeholder="Global Search"
                        value={searchInputValue}
                        onChange={(e) => setSearchInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        style={{ width: "100%", maxWidth: 300, minWidth: 200 }}
                        allowClear
                        onClear={handleClearSearch}
                    />
                    <Button
                        type="primary"
                        onClick={handleGlobalSearch}
                        style={{ minWidth: 100 }}
                    >
                        Search
                    </Button>
                </div>
                <Popover
                    content={renderColumnSettings()}
                    title="Select Primary Columns"
                    trigger="click"
                    placement="bottomRight"
                >
                    <Button
                        type="primary"
                        style={{ backgroundColor: "green", borderColor: "green", minWidth: 160 }}
                    >
                        Primary Column
                    </Button>
                </Popover>
            </div>

            {/* Trades table */}
            <Table
                dataSource={equityTrades}
                columns={columns}
                rowKey="trade_id"
                loading={loading}
                scroll={{ x: 1700 }}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: [10, 20, 50],
                }}
                onChange={handleTableChange}
                bordered
                sticky={true}
                size="middle"
                style={{ backgroundColor: "#fff", borderRadius: "8px" }}
                title={() => <h2 style={{ fontSize: "1.25rem" }}>Equity Trades</h2>}
                footer={() => (
                    <div style={{ fontWeight: 500 }}>Total {pagination.total} trades</div>
                )}
                locale={{ emptyText: "No data available" }}
            />
        </div>
    );
};

export default EquityTradesTable;
