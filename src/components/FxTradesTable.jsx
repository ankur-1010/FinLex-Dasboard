import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Button, Tooltip, Popover } from "antd";
import { SearchOutlined, EyeOutlined, EyeInvisibleOutlined, PushpinOutlined, PushpinFilled } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const FxTradesTable = () => {
    const [fxTrades, setFxTrades] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [globalSearchTerm, setGlobalSearchTerm] = useState(""); // State for global search term
    const [columnSettings, setColumnSettings] = useState({});
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const searchInput = useRef(null);

    const fetchFxTrades = async (page = 1, pageSize = 10, search = "") => {
        setLoading(true);
        try {
            const encodedSearchTerm = encodeURIComponent(search);
            console.log("Fetching FX trades with search term******:  ", encodedSearchTerm);
            const url = search
                ? `http://localhost:3000/api/search-fx-trades?search=${encodedSearchTerm}&limit=${pageSize}&page=${page}`
                : `http://localhost:3000/api/fx-trades?limit=${pageSize}&page=${page}`;
            const response = await fetch(url);
            console.log("Response from API:*** ", response);
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const data = await response.json();
            console.log("Data from API:*** ", data);

            setFxTrades(data.data || []); // Assuming the API returns `data` array
            setPagination((prev) => ({
                ...prev,
                total: data.total || 0, // Assuming the API returns `total` count
                current: page,
                pageSize,
            }));
        } catch (error) {
            console.error("Error fetching FX trades:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFxTrades(pagination.current, pagination.pageSize);
    }, []);

    const handleGlobalSearch = (value) => {
        setGlobalSearchTerm(value);
        fetchFxTrades(1, pagination.pageSize, value); 
    };

    const handleTableChange = (pagination) => {
        fetchFxTrades(pagination.current, pagination.pageSize, globalSearchTerm);
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSelectedKeys(value ? [value] : []);
                        handleSearch(value, dataIndex); 
                    }}
                    style={{ marginBottom: 8, display: "block" }}
                />
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

    const handleSearch = (value, dataIndex) => {
        setSearchText(value);
        setSearchedColumn(dataIndex);
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
                const isSearchable = [
                    "trade_id",
                    "trade_date",
                    "value_date",
                    "counterparty",
                    "product_type",
                    "buy_sell",
                    "notional",
                    "currency",
                    "rate",
                    "execution_venue",
                    "trader_name",
                    "currency_pair",
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

    const baseFxColumns = [
        { title: "Trade ID", dataIndex: "trade_id", key: "trade_id" },
        { title: "Trade Date", dataIndex: "trade_date", key: "trade_date" },
        { title: "Value Date", dataIndex: "value_date", key: "value_date" },
        { title: "Counterparty", dataIndex: "counterparty", key: "counterparty" },
        { title: "Product Type", dataIndex: "product_type", key: "product_type" },
        { title: "Buy/Sell", dataIndex: "buy_sell", key: "buy_sell" },
        { title: "Notional", dataIndex: "notional", key: "notional" },
        { title: "Currency", dataIndex: "currency", key: "currency" },
        { title: "Rate", dataIndex: "rate", key: "rate" },
        { title: "Execution Venue", dataIndex: "execution_venue", key: "execution_venue" },
        { title: "Trader Name", dataIndex: "trader_name", key: "trader_name" },
        { title: "Currency Pair", dataIndex: "currency_pair", key: "currency_pair" },
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <Input
                    placeholder="Global Search"
                    value={globalSearchTerm}
                    onChange={(e) => handleGlobalSearch(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
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
                className="custom-table"
                title={() => <h2>FX Trades</h2>}
                footer={() => <div>Total {pagination.total} trades</div>}
                locale={{ emptyText: "No data available" }}
            />
        </div>
    );
};

export default FxTradesTable;