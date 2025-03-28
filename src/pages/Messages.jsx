import React from "react";
import { Layout } from "antd";

const { Content } = Layout;

const Messages = () => {
    return (
        <Content style={{ margin: "16px" }}>
            <h2>Messages</h2>
            <p>Message details will be displayed here.</p>
        </Content>
    );
};

export default Messages;
