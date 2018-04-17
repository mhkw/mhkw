import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, InputItem, List, Modal, WhiteSpace, Switch  } from "antd-mobile";
import { Motion, spring } from 'react-motion';

const loadingGif = require('../images/loading.gif'); //图形验证码加载中的GIG动图

export default class SetUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            phone: '',
            showConfirmOrder: false, //是否显示确认验收的Modal弹窗
            picCode: "", //确认验收的图形验证码
            codeNum: 2, //确认验收的图形验证码图片地址后缀
            SMSCode: "", //确认验收的短信验证码
            SMSCodeTxt: "获取验证码", //确认验收的短信验证码上的文字
            confirmOrderPhone: "", //弹窗输入信息
            ModalType:'phone', //弹窗类型
            user: '0', //以下都是具体的每项设置
            gustbook: '0',
            comment: '0', 
            work: '0',
            project: '0',
            visit_home_page: '0',
            show_love_users: '1',
            show_love_works: '1',
            display: '0', //是否关闭个人主页,3为关闭
        }
        //获取到个人基本信息后的执行函数
        this.handleUserBaseInfo = (res) => {
            if (res.success) {
                let { email, mobile: phone, display } = res.data;
                this.setState({
                    email,
                    phone,
                    display,
                })
            } else {
                Toast.info(res.message, 1.5);
            }
        }
        this.handleGetNoticeSetList = (res) => {
            if (res.success) {
                let { comment, gustbook, project, user, visit_home_page, work } = res.data;
                this.setState({ comment, gustbook, project, user, visit_home_page, work });
            } else {
                Toast.info(res.message, 1.5);
            }
        }
        this.handleGetPrivacySetList = (res) => {
            if (res.success) {
                let { show_love_users, show_love_works } = res.data;
                this.setState({ show_love_users, show_love_works });
            } else {
                Toast.info(res.message, 1.5);
            }
        }
        this.handleChangeNoticeSet = (res) => {
            if (!res.success) {
                Toast.info(res.message, 1.5);
            }
        }
        this.handleChangePrivacySet = (res) => {
            if (!res.success) {
                Toast.info(res.message, 1.5);
            }
        }
        this.handleChangeUserInfo = (res) => {
            if (!res.success) {
                Toast.info(res.message, 1.5);
            }
        }
        //图形验证码发送成功后的执行函数
        this.handlePicSend = (res, param) => {
            console.log(res);
            if (res.success) {
                //发送短信验证码
                this.sendMessage(param.phone, param.secode);
            } else {
                Toast.info('图形验证码不正确', 2, null, false);
                this.setState({ codeNum: ++this.state.codeNum });
            }
        }
        //短信验证码发送成功后的执行函数
        this.handleMsgSend = (res) => {
            if (res.success) {
                this.SMSCountdown();
            } else {
                this.setState({ codeNum: ++this.state.codeNum });
            }
            Toast.info(res.message, 1.5);
        }
        //确认验收发送成功后的执行函数
        this.handleConfirmOrder = (res) => {
            if (res.success) {
                Toast.info(res.message, 1.5, () => {
                    this.changeShowConfirmOrder(false);
                });
                if (this.state.ModalType == "phone") {
                    this.setState({ phone: this.state.confirmOrderPhone},()=>{
                        this.setState({confirmOrderPhone: ""})
                    })
                } else {
                    this.setState({ email: this.state.confirmOrderPhone},()=>{
                        this.setState({confirmOrderPhone: ""})
                    })
                }
            } else {
                Toast.info(res.message, 1.5);
            }
        }
    }
    clickEmail = () => {
        this.setState({ ModalType: "email" }, () => {
            this.changeShowConfirmOrder(true);
        })
    }
    clickPhone = () => {
        this.setState({ ModalType: "phone"},()=>{
            this.changeShowConfirmOrder(true);
        })
    }
    //修改密码
    changePassword = () => {
        // console.log("changePassword")
        hashHistory.push({
            pathname: '/changePassword',
            query: { form: 'SetUp' }
        });
    }
    //判断是打开还是关闭确认验收的弹窗 此时应该是修改手机号的弹窗
    changeShowConfirmOrder = (isShow) => {
        this.setState({ showConfirmOrder: isShow });
        //如果是关闭，则清空图形验证码和短信验证码
        if (!isShow) {
            this.setState({
                picCode: "", //确认验收的图形验证码
                SMSCode: "", //确认验收的短信验证码
            })
        }
    }
    //发送确认验收的请求,此时应该是发送修改手机号的请求
    ConfirmOrder() {
        let { confirmOrderPhone, picCode, SMSCode } = this.state;
        if (this.testPhone(confirmOrderPhone) && this.testPicCode(picCode) && this.testSMSCode(SMSCode)) {
            //发送确认验收的请求,报价订单，同意验收
            runPromise('change_self_important_info', {
                "info": confirmOrderPhone,
                "type": "phone",
                "code": SMSCode
            }, this.handleConfirmOrder, true, "post");
        }
        return 0;
    }
    //发送修改邮箱的请求
    ConfirmEmail() {
        let { confirmOrderPhone, SMSCode } = this.state;
        if (this.testEmail(confirmOrderPhone) && this.testSMSCode(SMSCode)) {
            //发送确认验收的请求,报价订单，同意验收
            runPromise('change_self_important_info', {
                "info": confirmOrderPhone,
                "type": "email",
                "code": SMSCode
            }, this.handleConfirmOrder, true, "post");
        }
        return 0;
    }
    //图形验证码输入
    onChangeYzm = (value) => {
        this.setState({
            picCode: value.toUpperCase()
        })
    }
    //短信验证码输入
    onChangeSMSCode = (value) => {
        this.setState({
            SMSCode: value
        })
    }
    numPlus(e) {     //图形验证码刷新
        e.currentTarget.setAttribute("src", loadingGif);
        setTimeout(() => {
            this.setState({
                codeNum: ++this.state.codeNum
            })
        }, 200)
    }
    //验证邮箱地址是否正确
    testEmail(val) {
        if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val))) {
            Toast.info("邮箱账号错误！", 1);
            return false;
        } else {
            return true;
        }
    }
    //验证手机号
    testPhone(val) {
        if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(val))) {
            Toast.info("手机号错误！", 1);
            return false;
        } else {
            return true;
        }
    }
    //验证图形验证码是否输入
    testPicCode(val) {
        let value = val.replace(" ", "");
        if (!(/^.{4}$/.test(value))) {
            Toast.info("请输入4位图形验证码", 1);
            return false;
        } else {
            return true;
        }
    }
    testSMSCode(val, noLimitSMSCode = false) {
        if (this.state.SMSCodeTxt == "获取验证码" || noLimitSMSCode) {
            if (!(/^\d{1,6}$/.test(val))) {
                let text = "请输入4位短信验证码";
                if (this.state.ModalType != "phone") {
                    text = "请输入邮箱验证码";
                }
                Toast.info(text, 1);
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
    SMSCountdown() {
        let second = 60;
        let then = this;
        var value = second + "S后重试";
        then.setState({ SMSCodeTxt: value });
        function render() {
            var value = second + "S后重试";
            then.setState({ SMSCodeTxt: value });
            second--;
            if (second === 0) {
                window.clearInterval(token);
                then.setState({ SMSCodeTxt: "获取验证码" });
            }
        }
        let token = window.setInterval(render, 1000);
    }
    //点击获取短信验证码按钮
    handleSMSCode = () => {
        let phoneValue = this.state.confirmOrderPhone;
        let picCode = this.state.picCode;
        if (this.testPhone(phoneValue) && this.testPicCode(picCode) && this.state.SMSCodeTxt == "获取验证码") {
            //发送ajax验证图形验证码
            // this.onPicCode(picCode, phoneValue);
            //发送ajax获取短信验证码
            this.sendMessage(picCode, phoneValue);
        }
    }
    //发送请求验证图形验证码
    onPicCode(secode, phone) {
        runPromise("check", {
            secode: secode
        }, this.handlePicSend, false, "post", { phone: phone, secode: secode });
    }
    //发送短信验证码
    sendMessage(secode, phone) {
        runPromise('get_reg_sms_code', {
            "type": "change",
            "mobile": phone,
            "tokeen": secode
        }, this.handleMsgSend, false, "post");
    }
    //点击修改邮箱账号时，获取邮箱验证码
    handleEmailCode = () => {
        let phoneValue = this.state.confirmOrderPhone; //此时输入的是邮箱
        if (this.testEmail(phoneValue) && this.state.SMSCodeTxt == "获取验证码") {
            //发送ajax验证图形验证码
            // this.onPicCode(picCode, phoneValue);
            //发送ajax获取短信验证码
            this.sendEmail(phoneValue);
        }
    }
    //获取邮件验证码
    sendEmail(email) {
        runPromise('get_validate_code_by_email', {
            email,
        }, this.handleMsgSend, false, "post");
    }
    componentDidMount() {
        this.ajaxGetUserBaseInfo();
        this.ajaxGetNoticeSetList();
        this.ajaxGetPrivacySetList();

        //页面跳到顶端
        let hoc = document.querySelector(".hoc-max-box");
        hoc.scrollIntoView(true);
    }
    //ajax获取个人基本信息，用来查看邮箱，手机，隐私设置关闭个人主页
    ajaxGetUserBaseInfo = () => {
        runPromise('get_user_base_info', {}, this.handleUserBaseInfo);
    }
    //获取通知设置列表
    ajaxGetNoticeSetList = () => {
        runPromise('get_notice_set_list', {}, this.handleGetNoticeSetList);
    }
    //获取隐私设置列表
    ajaxGetPrivacySetList = () => {
        runPromise('get_privacy_set_list', {}, this.handleGetPrivacySetList);
    }
    //设置通知设置的某一项
    ajaxChangeNoticeSet = (notice_type, isChecked) => {
        let is_set = isChecked ? 1 : 0;
        runPromise('change_notice_set', {
            notice_type,
            is_set,
        }, this.handleChangeNoticeSet);
        this.setState({
            [notice_type]: isChecked ? "1" : "0"
        })
    }
    //设置隐私设置的某一项，不包括关闭个人主页
    ajaxChangePrivacySet = (privacy_type, isChecked) => {
        let is_set = isChecked ? 0 : 1;
        runPromise('change_privacy_set', {
            privacy_type,
            is_set
        }, this.handleChangePrivacySet);
        this.setState({
            [privacy_type]: isChecked ? "0" : "1"
        })
    }
    //设置我的主页是否显示
    ajaxChangeUserInfo = (isChecked) => {
        var display = isChecked ? 3 : 1;
        runPromise('change_user_info', {
            display,
        }, this.handleChangeUserInfo);
        this.setState({
            display: isChecked ? "3" : "1"
        })
    }
    render() {
        return (
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div className="set-up-page" style={{ ...interpolatingStyle, position: "relative" }}>
                        <NavBar
                            className="new-nav-bar"
                            mode="light"
                            icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                            onLeftClick={() => hashHistory.goBack()}
                        >个人设置</NavBar>
                        <List renderHeader={() => '账号设置：'} className="account-settings">
                            <List.Item
                                thumb={<span className="settings-thumb">邮箱</span>}
                                extra={<i className="iconfont icon-bianji"></i>}
                                onClick={this.clickEmail}
                            >{this.state.email}</List.Item>
                            <List.Item
                                thumb={<span className="settings-thumb">手机</span>}
                                extra={<i className="iconfont icon-bianji"></i>}
                                onClick={this.clickPhone}
                            >{this.state.phone}</List.Item>
                            <List.Item arrow="horizontal" onClick={this.changePassword}>修改密码</List.Item>
                        </List>
                        <List renderHeader={() => '通知设置：'} className="account-settings">
                            <List.Item
                                extra={<Switch
                                    checked={this.state.user != "0" ? true : false}
                                    onClick={(change) => { this.ajaxChangeNoticeSet("user", change) }}
                                />}
                            >有人收藏了我</List.Item>
                            <List.Item
                                extra={<Switch
                                    checked={this.state.gustbook != "0" ? true : false}
                                    onClick={(change) => { this.ajaxChangeNoticeSet("gustbook", change) }}
                                />}
                            >有人给我留言</List.Item>
                            <List.Item
                                extra={<Switch
                                    checked={this.state.comment != "0" ? true : false}
                                    onClick={(change) => { this.ajaxChangeNoticeSet("comment", change) }}
                                />}
                            >有人评论了我的作品</List.Item>
                            <List.Item
                                extra={<Switch
                                    checked={this.state.work != "0" ? true : false}
                                    onClick={(change) => { this.ajaxChangeNoticeSet("work", change) }}
                                />}
                            >有人收藏了我的作品</List.Item>
                            <List.Item
                                extra={<Switch
                                    checked={this.state.project != "0" ? true : false}
                                    onClick={(change) => { this.ajaxChangeNoticeSet("project", change) }}
                                />}
                            >有人收藏了我的需求</List.Item>
                            <List.Item
                                extra={<Switch
                                    checked={this.state.visit_home_page != "0" ? true : false}
                                    onClick={(change) => { this.ajaxChangeNoticeSet("visit_home_page", change) }}
                                />}
                            >有人访问了我的主页</List.Item>
                        </List>
                        <List renderHeader={() => '隐私设置：'} className="account-settings">
                            <List.Item
                                extra={<Switch
                                    checked={this.state.show_love_users != "0" ? false : true}
                                    onClick={(change) => { this.ajaxChangePrivacySet("show_love_users", change) }}
                                />}
                            >隐藏我喜欢的设计师</List.Item>
                            <List.Item
                                extra={<Switch
                                    checked={this.state.show_love_works != "0" ? false : true}
                                    onClick={(change) => { this.ajaxChangePrivacySet("show_love_works", change) }}
                                />}
                            >隐藏我喜欢的作品</List.Item>
                            <List.Item
                                extra={<Switch
                                    checked={this.state.display != "3" ? false : true}
                                    onClick={(change) => { this.ajaxChangeUserInfo(change) }}
                                />}
                            >关闭个人主页</List.Item>
                        </List>
                        <Modal
                            className="Confirm-order-modal set-up-modal"
                            visible={this.state.showConfirmOrder}
                            transparent
                            maskClosable={false}
                            closable={true}
                            onClose={() => { this.changeShowConfirmOrder(false), this.setState({ confirmOrderPhone: "" }) }}
                            title={this.state.ModalType == "phone" ? "修改手机" : "修改邮箱"}
                            footer={[
                                { text: '取消', onPress: () => { this.changeShowConfirmOrder(false), this.setState({confirmOrderPhone: ""}) } },
                                { text: '确定', onPress: () => { this.state.ModalType == "phone" ? this.ConfirmOrder() : this.ConfirmEmail() } }
                            ]}
                        >
                            <InputItem
                                className="self-important-info"
                                type="text"
                                maxLength={20}
                                placeholder={this.state.ModalType == "phone" ? "新手机" : "新邮箱"}
                                value={this.state.confirmOrderPhone}
                                onChange={(value) => { this.setState({ confirmOrderPhone: value}) }}
                            ></InputItem>
                            <div className="verification-phone-box" style={{ "margin-bottom": "0.3rem", "display": this.state.ModalType != "phone" ? "none" : null }}>
                                {/* <input type="text" value="" className="verification-code h5offerInput"/> */}
                                <InputItem
                                    className="verification-code h5offerInput"
                                    type="text"
                                    placeholder="图形验证码"
                                    maxLength={4}
                                    value={this.state.picCode}
                                    onChange={this.onChangeYzm}
                                ></InputItem>
                                <span className="code allow codeH5offerSheet">
                                    <img
                                        className="codePouup"
                                        src={'https://www.huakewang.com/index.php/verifycode/index/' + this.state.codeNum}
                                        onClick={(e) => { this.numPlus(e) }}
                                    />
                                </span>
                            </div>
                            <div className="verification-phone-box">
                                {/* <input type="number" value="" className="verification-code"/> */}
                                <InputItem
                                    className="verification-code"
                                    type="tel"
                                    pattern="[0-9]*"
                                    placeholder={this.state.ModalType == "phone" ? "短信验证码" : "邮箱验证码"}
                                    maxLength={4}
                                    value={this.state.SMSCode}
                                    onChange={this.onChangeSMSCode}
                                ></InputItem>
                                <span
                                    className="code allow h5offerSpan"
                                    onClick={this.state.ModalType == "phone" ? this.handleSMSCode : this.handleEmailCode}
                                >{this.state.SMSCodeTxt}</span>
                            </div>
                        </Modal>
                    </div>
                }
            </Motion>
        )
    } 
}