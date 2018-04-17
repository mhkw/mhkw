import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, InputItem, List, Modal, WhiteSpace, WingBlank, Tag } from "antd-mobile";

export default class AuthWorks extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="auth-works-page designer-auth-page" key="1">
                <NavBar
                    className="new-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                >上传作品</NavBar>
            </div>
        )
    }
}