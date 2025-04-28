import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Button, Tooltip, Popover } from "antd";
import {
    SearchOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    PushpinOutlined,
    PushpinFilled,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const EquityTradesTable = () => {
    const [equityTrades, setEquityTrades] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [globalSearchTerm, setGlobalSearchTerm] = useState("");
    const [searchInputValue, setSearchInputValue] = useState("");
    const [columnSettings, setColumnSettings] = useState({});
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const searchInput = useRef(null);

    // Fetch equity trades (supports global search)
    const fetchEquityTrades = async (page = 1, pageSize = 10, search = "") => {
        setLoading(true);
        try {
            const encoded = encodeURIComponent(search);
            const url = search
                ? `http://localhost:3000/api/search-equity-trades?search=${encoded}&limit=${pageSize}&page=${page}`
                : `http://localhost:3000/api/equity-trades?limit=${pageSize}&page=${page}`;
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(resp.statusText);
            const data = await resp.json();
            setEquityTrades(data.data || []);
            setPagination({ current: page, pageSize, total: data.total || 0 });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch for column search, resets to page 1 on new search
    const handleColumnSearch = async (field, value, page = 1, pageSize = pagination.pageSize) => {
        setLoading(true);
        try {
            const encoded = encodeURIComponent(value);
            const url = value
                ? `http://localhost:3000/api/equity-trades/search-by-field?field=${field}&search=${encoded}&limit=${pageSize}&page=${page}`
                : `http://localhost:3000/api/equity-trades?limit=${pageSize}&page=${page}`;
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(resp.statusText);
            const data = await resp.json();
            setEquityTrades(data.data || []);
            setPagination({ current: page, pageSize, total: data.total || 0 });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEquityTrades();
    }, []);

    // Global search handlers
    const handleGlobalSearch = () => {
        setGlobalSearchTerm(searchInputValue);
        fetchEquityTrades(1, pagination.pageSize, searchInputValue);
    };
    const handleClearSearch = () => {
        setSearchInputValue("");
        setGlobalSearchTerm("");
        fetchEquityTrades(1, pagination.pageSize, "");
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleGlobalSearch();
    };

    // Table change (pagination, sorting)
    const handleTableChange = (pag, filters, sorter) => {
        const { current, pageSize } = pag;
        setPagination((p) => ({ ...p, current, pageSize }));
        if (globalSearchTerm) {
            fetchEquityTrades(current, pageSize, globalSearchTerm);
        } else if (searchedColumn && searchText) {
            handleColumnSearch(searchedColumn, searchText, current, pageSize);
        } else {
            fetchEquityTrades(current, pageSize, "");
        }
    };

    // Column search props
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => {
                        const val = selectedKeys[0] || "";
                        setSearchText(val);
                        setSearchedColumn(dataIndex);
                        handleColumnSearch(dataIndex, val);
                        confirm();
                    }}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            clearFilters && clearFilters();
                            setSelectedKeys([]);
                            setSearchText("");
                            setSearchedColumn("");
                            handleColumnSearch(dataIndex, "");
                            confirm();
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        icon={<SearchOutlined />}
                        onClick={() => {
                            const val = selectedKeys[0] || "";
                            setSearchText(val);
                            setSearchedColumn(dataIndex);
                            handleColumnSearch(dataIndex, val);
                            confirm();
                        }}
                    >
                        Search
                    </Button>
                </div>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        render: (text) => {
            const highlights = [];
            if (globalSearchTerm) highlights.push(globalSearchTerm);
            if (searchedColumn === dataIndex && searchText) highlights.push(searchText);
            return highlights.length ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={highlights}
                    autoEscape
                    textToHighlight={text?.toString() || ""}
                />
            ) : (
                text
            );
        },
    });

    // Pin/unpin & visibility toggles
    const togglePin = (key) =>
        setColumnSettings((prev) => ({
            ...prev,
            [key]: { ...prev[key], fixed: prev[key]?.fixed === "left" ? undefined : "left" },
        }));
    const toggleVisibility = (key) =>
        setColumnSettings((prev) => ({
            ...prev,
            [key]: { ...prev[key], visible: !prev[key]?.visible },
        }));

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

    const enhanceColumns = (cols) =>
        cols
            .map((col) => {
                const settings = columnSettings[col.key] || {};
                if (settings.visible === false) return null;
                const searchable = baseEquityColumns.some((c) => c.dataIndex === col.dataIndex);
                return {
                    ...col,
                    ...(searchable ? getColumnSearchProps(col.dataIndex) : {}),
                    sorter: (a, b) => String(a[col.dataIndex]).localeCompare(String(b[col.dataIndex])),
                    fixed: settings.fixed,
                };
            })
            .filter(Boolean);

    const columns = enhanceColumns(baseEquityColumns);

    const renderColumnSettings = () => (
        <div style={{ display: "flex", flexDirection: "column", minWidth: 220 }}>
            {baseEquityColumns.map((col) => {
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
        <div style={{ padding: "1rem" }}>
            <div
                style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, marginBottom: 16 }}
            >
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    <Input
                        placeholder="Global Search"
                        value={searchInputValue}
                        onChange={(e) => setSearchInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        style={{ width: "60%", maxWidth: 300, minWidth: 50 }}
                        allowClear
                        onClear={handleClearSearch}
                    />
                    <Button type="primary" onClick={handleGlobalSearch} style={{ minWidth: 100 }}>
                        Search
                    </Button>
                </div>
                <Popover content={renderColumnSettings()} title="Select Primary Columns" trigger="click" placement="bottomRight">
                    <Button type="primary" style={{ backgroundColor: "green", borderColor: "green", minWidth: 160 }}>
                        Primary Column
                    </Button>
                </Popover>
            </div>

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
                sticky
                size="middle"
                style={{ backgroundColor: "#fff", borderRadius: 8 }}
                title={() => <h2 style={{ fontSize: "1.25rem" }}>Equity Trades</h2>}
                footer={() => <div style={{ fontWeight: 500 }}>Total {pagination.total} trades</div>}
                locale={{ emptyText: "No data available" }}
            />
        </div>
    );
};

export default EquityTradesTable;