import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, InputItem, List, WhiteSpace  } from "antd-mobile";

const defaultAvatar = [require('../images/avatar.png')]

export default class PerfectInfo extends React.Component {
    constructor(props){
        super(props)
        this.state = {}
    }
    render() {
        return (
            <div className="perfect-info-page" key="1">
                <NavBar
                    className="new-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                >完善资料</NavBar>
                <WhiteSpace size="md" />
                <List>
                    <List.Item 
                        className="avatar-list"
                        extra={<img src={defaultAvatar} className="perfect-info-avatar" />}
                        arrow="horizontal" 
                    >头像</List.Item>
                </List>
            </div>
        )
    }
}