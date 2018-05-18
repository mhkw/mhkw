import React from "react";
import { hashHistory } from "react-router";
import { Toast, NavBar, Icon, WhiteSpace, List, InputItem, TextareaItem } from "antd-mobile";

export default class Feedback extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            opinion: "",
            phone: '',
        }
        //发送完成意见反馈后的处理函数
        this.handleFeedback = (res) => {
            console.log(res);
            if (res.success) {
                //意见反馈成功
                Toast.success('意见反馈成功', 1, () => {
                    hashHistory.goBack();
                });
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
    }
    testOpinion(val) {
        if (!val.trim()) {
            Toast.info("请输入反馈内容！", 1);
            return false;
        } else {
            return true;
        }
    }
    //选填，判断是否有输入手机号，然后判断手机号是否正确
    testPhone(value) {
        let val = value.trim();
        if (val.length < 1) {
            //如果没有输入手机号
            return true;
        } else {
            //如果输入了手机号
            if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(val))) {
                Toast.info("请输入正确手机号！", 1);
                return false;
            } else {
                return true;
            }   
        }
    }
    onClickSubmit = () => {
        let { opinion, phone } = this.state;
        if (this.testOpinion(opinion) && this.testPhone(phone)) {
            //发送ajax完成意见反馈
            // runPromise("change_password", {
            //     "old_password": oldPassword,
            //     "new_password": newPassword,
            //     "confirm_password": confirmNewPassword,
            // }, this.handleFeedback);
        }
    }
    render() {
        return (
            <div className="change-password-page feedback-page" key="1">
                <NavBar
                    className="new-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                    rightContent={<span onClick={this.onClickSubmit }>提交</span> }
                >意见反馈</NavBar>
                <WhiteSpace size="sm" />
                <p className="title">问题和意见</p>
                <TextareaItem
                    rows={8}
                    // autoHeight
                    count={200}
                    placeholder="请简述您遇到的问题，或留下您的宝贵意见"
                    value={this.state.opinion}
                    onChange={(val) => { this.setState({ opinion: val }) }}
                />
                <p className="title">手机号</p>
                <InputItem
                    type="tel"
                    pattern="[0-9]*"
                    maxLength="11"
                    placeholder="选填，便于我们及时回复您"
                    value={this.state.phone}
                    onChange={(val) => { val = val.trim(); this.setState({ phone: val }) }}
                    clear
                />
            </div>
        )
    }
}