import React, { useState } from "react";
import { Layout, Avatar, Dropdown, Menu, Button, Grid, Drawer } from "antd";
import {
    UserOutlined,
    DownCircleFilled,
    MenuOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { useBreakpoint } = Grid;

const AppHeader = () => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [drawerVisible, setDrawerVisible] = useState(false);

    const myAppsMenu = (
        <Menu>
            <Menu.Item key="app1" onClick={() => navigate("/app1")}>
                App 1
            </Menu.Item>
            <Menu.Item key="app2" onClick={() => navigate("/app2")}>
                App 2
            </Menu.Item>
        </Menu>
    );

    const userMenu = (
        <Menu>
            <Menu.Item key="profile" onClick={() => navigate("/profile")}>
                Profile
            </Menu.Item>
            <Menu.Item key="logout" onClick={() => navigate("/logout")}>
                Logout
            </Menu.Item>
        </Menu>
    );

    const navItems = (
        <Menu mode="inline" selectable={false}>
            <Menu.SubMenu key="myapps" title="My Apps">
                <Menu.Item key="1" onClick={() => navigate("/app1")}>
                    App 1
                </Menu.Item>
                <Menu.Item key="2" onClick={() => navigate("/app2")}>
                    App 2
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="stpadmin" onClick={() => navigate("/stpadmin")}>
                DATA WRAPPER
            </Menu.Item>
            <Menu.Item key="stp" onClick={() => navigate("/stp")}>
                STP
            </Menu.Item>
            <Menu.Divider />
            <Menu.SubMenu key="user" title="User">
                <Menu.Item key="profile2" onClick={() => navigate("/profile")}>
                    Profile
                </Menu.Item>
                <Menu.Item key="logout2" onClick={() => navigate("/logout")}>
                    Logout
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    );

    return (
        <>
            <Header
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 16px",
                    background: "#fff",
                }}
            >
                {isMobile ? (
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={() => setDrawerVisible(true)}
                    />
                ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Dropdown overlay={myAppsMenu} trigger={["click"]}>
                            <Button type="text" color="blue" variant="filled">
                                My Apps <DownCircleFilled />
                            </Button>
                        </Dropdown>
                        <Button
                            color="black"
                            variant="text"
                            onClick={() => navigate("/stpadmin")}
                            style={{ marginLeft: 24 }}
                        >
                            DATA WRAPPER
                        </Button>
                        <Button
                            color="black"
                            variant="text"
                            onClick={() => navigate("/stp")}
                            style={{ marginLeft: 16 }}
                        >
                            STP
                        </Button>
                    </div>
                )}

                <Dropdown
                    overlay={userMenu}
                    placement="bottomRight"
                    trigger={["click"]}
                >
                    <Avatar
                        size={40}
                        style={{ backgroundColor: "#1677ff" }}
                        icon={<UserOutlined />}
                    />
                </Dropdown>
            </Header>

            <Drawer
                title="Navigation"
                placement="left"
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
                bodyStyle={{ padding: 0 }}
            >
                {navItems}
            </Drawer>
        </>
    );
};

export default AppHeader;
