import React from 'react';
import { NavBar, Icon, InputItem, Toast, List, Button, WingBlank, NoticeBar } from 'antd-mobile';
import { hashHistory } from 'react-router';
import QueueAnim from 'rc-queue-anim';

const loadingGif = require('../images/loading.gif'); //图形验证码加载中的GIG动图

export default class Withdraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: validate.getCookie('user_phone') ? validate.getCookie('user_phone') : '',
            code: "",
            alipay_account: "",
            alipay_user_name: "",
            amount: "",
            balance: 0,
            picCode: "", //确认验收的图形验证码
            codeNum: 2, //确认验收的图形验证码图片地址后缀
            SMSCode: "", //确认验收的短信验证码
            SMSCodeTxt: "获取验证码", //确认验收的短信验证码上的文字
            withdrawInfo: 0, //正在提现中的金额，提现有延迟，可能需要等待
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
        this.handleWithdraw = (res) => {
            if (res.success) {
                Toast.info(res.message, 1, ()=>{
                    hashHistory.goBack();
                });
            } else {
                Toast.info(res.message, 1.5);
            }
        }
        this.handleWithdrawInfo = (res) => {
            if (res.success) {
                this.setState({
                    withdrawInfo: res.data.amount
                })
            }
        }
    }
    componentWillMount() {
        let balance = this.props.location.query.blance;
        if (balance) {
            this.setState({ balance });
        }
    }
    componentDidMount() {
        this.ajaxWithdrawInfo();
    }
    numPlus(e) {     //图形验证码刷新
        e.currentTarget.setAttribute("src", loadingGif);
        setTimeout(() => {
            this.setState({
                codeNum: ++this.state.codeNum
            })
        }, 200)
    }
    //校验支付宝账号
    testAccount(val) {
        if (!(/^.{1,20}$/.test(val))) {
            Toast.info("支付宝账号错误！", 1);
            return false;
        } else {
            return true;
        }
    }
    //校验支付宝姓名
    testName(val) {
        if (!(/^.{1,20}$/.test(val))) {
            Toast.info("支付宝姓名错误！", 1);
            return false;
        } else {
            return true;
        }
    }
    //校验提现金额
    testPrice(val) {
        if (!(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val))) {
            Toast.info("输入金额错误！", 1, () => {
                this.setState({ amount: "" })
            });
            return false;
        } else if (val > this.state.balance){
            Toast.info("超过可提现余额！", 1, ()=>{
                this.setState({ amount: this.state.balance })
            });
            return false;
        } else {
            return true;
        }
    }
    //校验手机号
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
            Toast.info("输入4位图形验证码", 1);
            return false;
        } else {
            return true;
        }
    }
    testSMSCode(val, noLimitSMSCode = false) {
        if (this.state.SMSCodeTxt == "获取验证码" || noLimitSMSCode) {
            if (!(/^\d{1,6}$/.test(val))) {
                Toast.info("输入4位短信验证码", 1);
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
        let phoneValue = this.state.phone;
        let picCode = this.state.picCode;
        if (this.testPhone(phoneValue) && this.testPicCode(picCode) && this.state.SMSCodeTxt == "获取验证码") {
            this.sendMessage(picCode, phoneValue);
        }
    }
    //发送短信验证码
    sendMessage(secode, phone) {
        runPromise('get_reg_sms_code', {
            "type": "withdraw",
            "mobile": phone,
            "tokeen": secode
        }, this.handleMsgSend, false, "post");
    }
    onClickPay = () => {
        //如果今天不是周三,不让提现
        if ((new Date()).getDay() != 3) {
            Toast.info("每周三开通提现功能！", 1.5);
            return false
        }
        let { phone, alipay_account, alipay_user_name, amount, SMSCode } = this.state;
        if (amount < 500 || amount > 200000) {
            Toast.info("提现金额区间为500元-20万元！", 1.5);
            return false
        }
        if (this.testAccount(alipay_account) && this.testName(alipay_user_name) && this.testPrice(amount) && this.testPhone(phone) && this.testSMSCode(SMSCode)) {
            this.ajaxWithdraw();
        }
    }
    ajaxWithdraw = () => {
        let { phone, alipay_account, alipay_user_name, amount, SMSCode: code } = this.state;
        runPromise('applay_for_withdraw', {
            phone,
            code,
            alipay_account,
            alipay_user_name,
            amount
        }, this.handleWithdraw);
    }
    ajaxWithdrawInfo = () => {
        runPromise('get_withdraw_info', {}, this.handleWithdrawInfo);
    }
    render() {
        let withdrawInfoSpan = <span className="withdraw-Info" style={{ "font-size": "12px", "color": "#fd4d65"}}>(有￥{this.state.withdrawInfo}元正在提现)</span>
        return (
            <QueueAnim className="demo-content" leaveReverse
                animConfig={[
                    { opacity: [1, 0], translateX: [0, 50] }
                ]}>
                <div className="withdraw-page" key="0">
                    <NavBar
                        mode="light"
                        icon={<Icon type="left" size="lg" color="#333" />}
                        onLeftClick={() => hashHistory.goBack()}
                    >申请提现{this.state.withdrawInfo ? withdrawInfoSpan : null }</NavBar>
                    <div className="input-form">
                        <NoticeBar mode="closable" marqueeProps={{ loop: true, leading: 500, trailing: 800, fps: 30 }}>
                            每周三开通提现功能，每次提现金额区间为500元-20万元
                        </NoticeBar>
                        <List renderHeader={() => <span><i className="iconfont icon-zhifubao1"></i>支付宝</span> } className="withdraw-list">
                            <InputItem
                                type="string"
                                value={this.state.alipay_account}
                                onChange={(val) => { this.setState({ alipay_account: val}) }}
                                placeholder="请输入支付宝账号"
                                maxLength="20"
                                clear
                            >账号</InputItem>
                            <InputItem
                                type="string"
                                value={this.state.alipay_user_name}
                                onChange={(val) => { this.setState({ alipay_user_name: val }) }}
                                placeholder="请输入支付宝姓名"
                                maxLength="20"
                                clear
                            >姓名</InputItem>
                        </List>
                        <List renderHeader={() => <span><i className="iconfont icon-qian"></i>可提现余额：<span className="balance">{this.state.balance}</span> 元</span>} className="withdraw-list">
                            <InputItem
                                type="money"
                                moneyKeyboardAlign="left" 
                                value={this.state.amount}
                                onChange={(val) => { this.setState({ amount: val }) }}
                                onBlur={() => { this.testPrice(this.state.amount) }}
                                placeholder="请输入提现金额"
                                maxLength="10"
                                clear
                            >金额</InputItem>
                            <InputItem
                                className="withdraw-phone"
                                type="number"
                                value={this.state.phone}
                                onChange={(val) => { this.setState({ phone: val }) }}
                                editable={false}
                                onClick={() => { Toast.offline("手机端无法修改", 1) }}
                                placeholder=""
                                maxLength="15"
                                clear
                            >手机号</InputItem>
                        </List>
                        <List renderHeader={() => <span><i className="iconfont icon-duanxin"></i>验证码</span>} className="withdraw-list-end">
                            <div className="verification-phone-box">
                                <InputItem
                                    className="verification-code h5offerInput"
                                    type="text"
                                    placeholder="图形验证码"
                                    maxLength={4}
                                    value={this.state.picCode}
                                    onChange={(val) => { this.setState({ picCode: val.toUpperCase() })}}
                                ></InputItem>
                                <span className="code allow codeH5offerSheet">
                                    <img
                                        className="codePouup"
                                        src={'https://www.huakewang.com/index.php/verifycode/index/' + this.state.codeNum}
                                        onClick={(e) => { this.numPlus(e) }}
                                    />
                                </span>
                            </div>
                            <div className="verification-phone-box two">
                                <InputItem
                                    className="verification-code"
                                    type="tel"
                                    pattern="[0-9]*"
                                    placeholder="短信验证码"
                                    maxLength={4}
                                    value={this.state.SMSCode}
                                    onChange={(val) => { this.setState({ SMSCode: val })}}
                                ></InputItem>
                                <span
                                    className="code allow h5offerSpan"
                                    onClick={this.handleSMSCode}
                                >{this.state.SMSCodeTxt}</span>
                            </div>
                        </List>
                    </div>
                    <p className="withdraw-time">
                        <span className="left">到账时间</span>
                        <span className="right">预计<span className="day">3-7</span>个工作日<span className="fees">（平台承担手续费）</span></span>
                    </p>
                    <WingBlank size="lg">
                        <Button
                            onClick={this.onClickPay}
                            className="pay-button"
                            activeClassName="pay-button-active"
                        >立即提现</Button>
                    </WingBlank>
                </div>
            </QueueAnim>
        )
    }
}