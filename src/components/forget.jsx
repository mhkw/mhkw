import React from 'react'
import { List, InputItem, Toast, Button, WhiteSpace, Modal, NavBar, Icon } from 'antd-mobile';
import { Link,hashHistory} from 'react-router';
import QueueAnim from 'rc-queue-anim';

import '../css/font/iconfont.css'

const loginUrl = [
    require('../images/login_logo.png'),
    require('../images/loading.gif'),
]
let timeOut = 60;
export default class ForgetView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: true,
            hasError: false,
            error: false,
            checked: true,
            value: '15657185156',
            keywords: 'luolei1992',
            message: "",       //短信验证码
            code: "",             //图形验证码
            maskClosable: true,
            modal: false,
            codeNum: 2,          //图形验证码改变的参数
            text: "获取验证码",
        };
        this.handleLoginSend = (res) => {   //修改密码
            console.log(res, '修改密码');
            if (res.success) {
                hashHistory.goBack();
                
                // validate.setCookie('user_id', res.data.id);
            } else {
                Toast.info(res.message, 2, null, false);
            }
        }
        this.handlePicSend = (res) => {     //图形验证码
            console.log(res);
            if (res.success) {
                this.sendMessage();
                this.onClose('modal')();
            } else {
                Toast.info('图形验证码不正确', 2, null, false);
                this.setState({ codeNum: ++this.state.codeNum });
            }
        }
        this.handleMsgSend = (res) => {      //短信发送
            if (res.success) {
                Toast.info('短信验证码已发出，请注意查收', 2, null, false);
                let interval = setInterval(() => {
                    if (timeOut === 0) {
                        this.setState({
                            text: "获取验证码"
                        })
                        clearInterval(interval);
                    } else {
                        this.setState({
                            text: timeOut + 's'
                        })
                        timeOut--;
                    }
                },1000)
            } else {
                Toast.info(res.message, 2, null, false);
            }
        }
    }
    componentDidMount (){
        
    }
    onRegister() {   //确认修改密码
        if (this.state.message.length !== 4) {
            Toast.info('请输入四位验证码', 2, null, false);
        } else {
            runPromise('get_pass', {
                username: this.state.value,
                passwd: this.state.keywords,
                code: this.state.message,     //短信验证码
                secode: this.state.code        //图形验证码
            }, this.handleLoginSend, false, "post");
        }
    }
    onPicCode() {   //验证图形验证码
        runPromise("check", {
            secode: this.state.code
        }, this.handlePicSend, false, "post");
    }
    sendMessage() {     //发送短信验证码
        runPromise('get_reg_sms_code', {
            "type": "get_pass",
            "mobile": this.state.value,
            "tokeen": this.state.code
        }, this.handleMsgSend, false, "post");
    }
    showModal = key => (e) => {  //弹窗提示输入验证码
        e.preventDefault(); // 修复 Android 上点击穿透
        if(this.state.text == "获取验证码") {
            if (this.state.value.replace(/(^\s*)|(\s*$)/g, '') === "" || this.state.keywords.replace(/(^\s*)|(\s*$)/g, '') === "") {
                Toast.info('用户名或者密码不能为空', 2, null, false);
            } else if (this.state.hasError === true || this.state.error === true) {
                Toast.info('请输入正确格式的用户名和密码', 2, null, false);
            } else if (this.state.checked === false) {
                Toast.info('请先同意画客网隐私政策和使用条款', 2, null, false);
            } else {
                this.setState({
                    [key]: true,
                });
            }
        }
    }
    onClose = key => () => {    //关闭图形验证码弹窗
        this.setState({
            [key]: false,
            // code: ""
        });
    }
    numPlus(e) {     //图形验证码刷新
        e.currentTarget.setAttribute("src", loginUrl[1]);
        setTimeout(() => {
            this.setState({
                codeNum: ++this.state.codeNum
            })
        }, 200)
    }
    onErrorClick = (val) => {     //验证错误回调
        if (this.state.hasError) {
            Toast.info(val, 1, null, false);
        } else if (this.state.error) {
            Toast.info(val, 1, null, false);
        }
    }
    onChange = (value) => {    //用户名输入
        this.setState({
            hasError: validate.CheckPhone(value).hasError,
            value: value
        });
    }
    onChangeKeyword = (value) => {   //密码输入
        this.setState({
            error: validate.CheckKeywords(value).hasError,
            keywords: value
        })
    }
    onChangeYzm = (value) => {      //图形验证码输入
        this.setState({
            code: value
        })
    }
    onchangeMessage = (value) => {
        this.setState({
            message: value       //手机验证码输入
        })
    }
    render() {
        return (
            <QueueAnim className="topMargin"
                animConfig={[
                    { opacity: [1, 0], translateX: [0, 150] }
                ]}>
                {this.state.show ? [ 
                    <div className="forgetNav">
                        <NavBar
                            mode="light"
                            icon={<Icon type="left" size="md" color="#707070" />}
                            onLeftClick={() => hashHistory.goBack()}
                        >找回密码</NavBar>
                    </div>,
                    <WhiteSpace size="lg" />,
                    <WhiteSpace size="lg" />,
                    <div className="loginWrap" key="1">
                        <div className="loginIn">
                            <div className="loginCenter">
                                <div className="loginIpt">
                                    <List>
                                        <InputItem
                                            type="text"
                                            placeholder="请输入手机号"
                                            maxLength={11}
                                            error={this.state.hasError}
                                            onErrorClick={() => {
                                                this.onErrorClick(validate.CheckPhone(this.state.value).errorMessage);
                                            }}
                                            onChange={this.onChange}
                                            value={this.state.value}
                                        ><i className="phone iconfont icon-shouji1"></i></InputItem>
                                        
                                        <InputItem className="yzm"
                                            type="number"
                                            maxLength={4}
                                            onChange={this.onchangeMessage}
                                            value={this.state.message}
                                            placeholder="短信验证码"
                                        ><i className="pwd iconfont icon-shoujiyanzhengma"></i>
                                            <Button 
                                                type="ghost" 
                                                inline size="small" 
                                                className="getCode"
                                                onClick={this.showModal('modal')}
                                            >{this.state.text}</Button>
                                        </InputItem>

                                        <InputItem
                                            type="password"
                                            placeholder="请输入新密码"
                                            error={this.state.error}
                                            maxLength={18}
                                            value={this.state.keywords}
                                            onErrorClick={() => {
                                                this.onErrorClick(validate.CheckKeywords(this.state.keywords).errorMessage);
                                            }}
                                            onChange={this.onChangeKeyword}
                                        ><i className="pwd iconfont icon-icon-test"></i></InputItem>
                                    </List>
                                </div>
                                <div>
                                    <Button type="primary" onClick={() => {this.onRegister();}}>确认并登陆</Button>
                                    <Modal
                                        visible={this.state.modal}
                                        transparent
                                        maskClosable={false}
                                        closable={true}
                                        onClose={this.onClose('modal')}
                                        title={
                                            <div style={{ textAlign: 'left', lineHeight: '24px', fontSize: '16px' }}>
                                                <p>输入图形验证码</p>
                                                <p>证明你不是机器人</p>
                                            </div>
                                        }
                                        footer={[
                                            { text: '取消', onPress: () => { this.onClose('modal')(); } },
                                            { text: '确定', onPress: () => { this.onPicCode() } }
                                        ]}
                                    >
                                        <div className="pressYzmWrap">
                                            <InputItem
                                                className="pressYzm fn-left"
                                                type="text"
                                                placeholder="图形验证码"
                                                maxLength={4}
                                                onChange={this.onChangeYzm}
                                            ></InputItem>
                                            <img
                                                src={'https://www.huakewang.com/index.php/verifycode/index/' + this.state.codeNum}
                                                className="fn-right"
                                                onClick={(e) => { this.numPlus(e) }}
                                            />
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>,
                    // <div className="loginThree">
                    //     <div className="loginThreeLine">
                    //         <span className="fn-left"></span> 其他登陆方式 <span className="fn-right"></span>
                    //     </div>
                    //     <div className="loginThreeBottom">
                    //         <ul className="fn-clear">
                    //             <li className="wx"><i className="iconfont icon-weixin"></i> 微信</li>
                    //             <li className="qq"><i className="iconfont icon-qq"></i> QQ</li>
                    //             <li className="wb"><i className="iconfont icon-weibo"></i> 微博</li>
                    //         </ul>
                    //     </div>
                    // </div>
                    ] : null}
            </QueueAnim>
        );
    }
}





