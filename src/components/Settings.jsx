import React from "react";
import { hashHistory } from "react-router";
import { Toast, NavBar, Icon, WhiteSpace, List, Modal } from "antd-mobile";

export default class Settings extends React.Component{
    constructor(props) {
        super(props);
        this.state = {}
        this.handleSignOut = (res) => {
            if (res.success) {
                //如果没登录，跳转到登录页
                validate.setCookie('user_id', '');
                hashHistory.push({
                    pathname: '/login',
                    query: { form: 'Settings' }
                });
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
    }
    //修改密码
    changePassword = () => {
        // console.log("changePassword")
        hashHistory.push({
            pathname: '/changePassword',
            query: { form: 'Settings' }
        });
    }
    //退出登录
    SignOut = () => {
        // console.log("SignOut");
        Modal.alert('退出登录', '', [
            { text: '取消', onPress: () => {}, style: 'default' },
            { text: '确定', onPress: () => this.ajaxSignOut() },
        ]);
    }
    ajaxSignOut = () => {
        //调用退出登录的接口
        runPromise('logout', {}, this.handleSignOut, false, 'get');
    }
    //意见反馈
    Feedback = () => {
        // console.log("Feedback")
        hashHistory.push({
            pathname: '/feedback',
            query: { form: 'Settings' }
        });
    }
    //我要评价
    Reviews = () => {
        console.log("Reviews")
    }
    //关于我们
    AboutUs = () => {
        // console.log("AboutUs")
        hashHistory.push({
            pathname: '/aboutUs',
            query: { form: 'Settings' }
        });
    }
    //清理缓存
    ClearCache = () => {
        console.log("ClearCache")
    }
    render() {
        return (
            <div className="settings-page" key="1">
                <NavBar
                    className="new-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                >设置</NavBar>
                <WhiteSpace size="sm" />
                <List>
                    <List.Item arrow="horizontal" onClick={this.changePassword}>修改密码</List.Item>
                </List>
                <WhiteSpace size="xl" />
                <List className="settings-more">
                    <List.Item arrow="horizontal" onClick={this.Feedback}>意见反馈</List.Item>    
                    <List.Item arrow="horizontal" onClick={this.Reviews}>我要评价</List.Item>    
                    <List.Item arrow="horizontal" onClick={this.AboutUs}>关于我们</List.Item>    
                    <List.Item arrow="horizontal" onClick={this.ClearCache}>清理缓存</List.Item>    
                </List>
                <WhiteSpace size="xl" />
                <List className="settings-sign-out">
                    <List.Item onClick={this.SignOut}>退出登录</List.Item>
                </List>
            </div>
        )
    }
}