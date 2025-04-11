import React from "react";
import { Layout, Avatar, Dropdown, Menu, Button } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();

    const myAppsMenu = (
        <Menu>
            <Menu.Item key="1">App 1</Menu.Item>
            <Menu.Item key="2">App 2</Menu.Item>
        </Menu>
    );

    const handleNavigation = (path) => {
        navigate(path);
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile">Profile</Menu.Item>
            <Menu.Item key="logout">Logout</Menu.Item>
        </Menu>
    );

    return (
        <Header className="header">
            <div className="title">
                <Dropdown overlay={myAppsMenu} trigger={['click']}>
                    <Button type="text" danger>
                        My Apps <DownOutlined />
                    </Button>
                </Dropdown>
                <Button onClick={() => handleNavigation("/stpadmin")} style={{ marginLeft: "30px" }}>STPADMIN</Button>
                <Button onClick={() => handleNavigation("/stp")} style={{ marginLeft: "15px" }}>STP</Button>
            </div>
            <Dropdown overlay={userMenu} placement="bottomRight">
                <Avatar icon={<UserOutlined />} />
            </Dropdown>
        </Header>
    );
};

export default AppHeader;