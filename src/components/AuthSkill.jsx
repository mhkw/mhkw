import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, InputItem, List, Modal, WhiteSpace, WingBlank, Tag } from "antd-mobile";

export default class AuthSkill extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="auth-skill-page designer-auth-page" key="1">
                <NavBar
                    className="new-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                >擅长技能</NavBar>
            </div>
        )
    }
}