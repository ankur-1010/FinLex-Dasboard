import React from "react";
import { Layout, Avatar, Dropdown, Menu, Button, } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AppHeader = () => {
    const menu = (
        <Menu>
            <Menu.Item>Profile</Menu.Item>
            <Menu.Item>Logout</Menu.Item>
        </Menu>
    );

    return (
        <Header className="header">
            <div className="title">
                <Button type="text" danger>
                    My Apps <DownOutlined />
                </Button>
                <Button>STPADMIN</Button>
                <Button>STP</Button>
            </div>
            <Dropdown overlay={menu} placement="bottomRight">
                <Avatar icon={<UserOutlined />} />
            </Dropdown>
        </Header>
    );
};

export default AppHeader;
