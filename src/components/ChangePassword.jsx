import React from "react";
import { hashHistory } from "react-router";
import { Toast, NavBar, Icon, WhiteSpace, List, InputItem, Button } from "antd-mobile";

export default class ChangePassword extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        }
        //发送完成修改密码后的处理函数
        this.handleChangePassword = (res) => {
            console.log(res);
            if (res.success) {
                //修改密码成功
                Toast.success('修改密码成功', 1, () => {
                    hashHistory.goBack();
                });
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
    }
    testOldPassword(val) {
        let value = val.replace(" ", "");
        if (value.length < 6) {
            Toast.info("登陆密码不得少于6位", 1);
            return false;
        }
        if (!(/^.{1,20}$/.test(value))) {
            Toast.info("请输入正确密码", 1);
            return false;
        } else {
            return true;
        }
    }
    testNewPassword(val) {
        let value = val.replace(" ", "");
        if (value.length < 6) {
            Toast.info("登陆密码不得少于6位", 1);
            return false;
        }
        if (!(/^.{1,20}$/.test(value))) {
            Toast.info("请输入正确密码", 1);
            return false;
        } else {
            return true;
        }
    }
    testConfirmNewPassword(val) {
        let value = val.replace(" ", "");
        //判断两次密码是否相等
        if (!(val === this.state.newPassword)) {
            Toast.info("两次输入密码不相同", 1);
            return false;
        } else {
            return true;
        }
    }
    handleConfirmChange = () => {
        let { oldPassword, newPassword, confirmNewPassword } = this.state;
        if (this.testOldPassword(oldPassword) && this.testNewPassword(newPassword) && this.testConfirmNewPassword(confirmNewPassword)) {
            //发送ajax完成修改密码
            runPromise("change_password", {
                "old_password": oldPassword,
                "new_password": newPassword,
                "confirm_password": confirmNewPassword,
            }, this.handleChangePassword);
        }
    }
    render() {
        return (
            <div className="change-password-page" key="1">
                <NavBar
                    className="new-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                >修改密码</NavBar>
                <WhiteSpace size="sm" />
                <List className="change-password-list">
                    <InputItem
                        type="password"
                        placeholder="请输入原密码"
                        maxLength="20"
                        value={this.state.oldPassword}
                        onChange={(val) => { val = val.trim(); this.setState({ oldPassword: val }) }}
                        onBlur={(val) => { this.testOldPassword(val) }}
                    >
                        <i className="iconfont icon-icon-test"></i>
                    </InputItem>
                    <InputItem
                        type="password"
                        placeholder="设置新密码"
                        maxLength="20"
                        value={this.state.newPassword}
                        onChange={(val) => { val = val.trim(); this.setState({ newPassword: val }) }}
                        onBlur={(val) => { this.testNewPassword(val) }}
                    >
                        <i className="iconfont icon-icon-test"></i>
                    </InputItem>
                    <InputItem
                        type="password"
                        placeholder="确认新密码"
                        maxLength="20"
                        value={this.state.confirmNewPassword}
                        onChange={(val) => { val = val.trim(); this.setState({ confirmNewPassword: val }) }}
                        onBlur={(val) => { this.testConfirmNewPassword(val) }}
                    >
                        <i className="iconfont icon-icon-test"></i>
                    </InputItem>
                </List>
                <WhiteSpace size="xl" />
                <List className="settings-sign-out">
                    <List.Item onClick={this.handleConfirmChange}>确认修改</List.Item>
                </List>
            </div>
        )
    }
}