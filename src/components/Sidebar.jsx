import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { MailOutlined, BarChartOutlined, SettingOutlined } from "@ant-design/icons";




const { Sider } = Layout;

const Sidebar = () => {
    return (
        <Sider collapsible breakpoint="md" collapsedWidth="80">
            <div className="logo">FinLex</div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
                <Menu.Item key="1" icon={<BarChartOutlined />}>
                    <Link to="/">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<MailOutlined />}>
                    <Link to="/messages">Messages</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<SettingOutlined />}>
                    <Link to="/endpoints">Endpoints</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
