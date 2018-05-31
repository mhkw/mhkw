import React from 'react'
import { List, InputItem, Toast, Button, Modal, ActivityIndicator } from 'antd-mobile';
import { Link, hashHistory } from 'react-router';
import { Motion, spring } from 'react-motion';
// import validate from "./validate.js";

import '../css/font/iconfont.css'

const loginUrl = [
    require('../images/login_logo.png'),
    require('../images/loading.gif'),
]

export default class LoginView extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            show: true,
            hasError: false,
            error: false,
            modal: false,
            animating:false,
            value: '15657185156',
            keywords:'luolei251537',
            // value: '',
            // keywords: '',
            code:"",
            codeNum:2
        };
        this.handleSend = (res) => {
            // console.log(res)
            if(res.success) {
                if (this.props.location.query && this.props.location.query.form == "register") {
                    hashHistory.push({
                        pathname: '/',
                        query: { form: 'login' }
                    });
                } else {
                    hashHistory.goBack();
                }
                validate.setCookie('user_id', res.data.id);
                validate.setCookie('user_phone', res.data.mobile);
                validate.setCookie('user_name', res.data.nick_name);
                localStorage.setItem('en_user_id', res.data.en_user_id);

                //环信登录
                if (res.data.hxid) {
                    this.IMLogin(res.data.hxid);
                } else {
                    console.log("没有环信id");
                }
                // let cookie_user_id = validate.getCookie("user_id");
                // console.log("login res.data.id::" + res.data.id);
                // console.log( "login cookie::" +cookie_user_id);
                // if (window.api) {
                //     window.api.alert({ msg: "cookie::" + cookie_user_id });
                // }
                // hashHistory.goBack();

            }else{
                if(res.message == "图形验证码不对") {
                    Toast.info("图形验证码不正确", 2, null, false);
                    this.setState({
                        codeNum: ++this.state.codeNum
                    })
                }else{
                    Toast.info(res.message, 2, null, false);                    
                    this.onClose('modal')();
                }
            }
        }
        this.handleThirdLogin = (res) => {
            console.log("############# login.jsx 66 第三方登录返回值###############")
            console.log(JSON.stringify(res));
            if (res.success) {
                
            } else {
                Toast.info(res.message, 1.5); 
            }
        }
    }
    componentDidMount() {
        // if(validate.getCookie('user_id')){
        //     hashHistory.push({
        //         pathname: '/',
        //         query: { form: 'promise' }
        //     });
        // };
    }
    
    showModal = key => (e) => {   //弹窗提示输入验证码
        e.preventDefault();       // 修复 Android 上点击穿透
        if (this.state.value.replace(/(^\s*)|(\s*$)/g, '') == "" || this.state.keywords.replace(/(^\s*)|(\s*$)/g, '') == "" ) {
            Toast.info('用户名或者密码不能为空', 2,null,false);
        }else if(this.state.hasError == true || this.state.error == true) {
            Toast.info('请输入正确格式的用户名和密码', 2,null,false);
        }else{
            this.setState({
                [key]: true,
            });
        }
    }
    clickLogin = (e) => {
        e.preventDefault();       // 修复 Android 上点击穿透
        if (this.state.value.replace(/(^\s*)|(\s*$)/g, '') == "" || this.state.keywords.replace(/(^\s*)|(\s*$)/g, '') == "") {
            Toast.info('用户名或者密码不能为空', 2, null, false);
        } else if (this.state.hasError == true || this.state.error == true) {
            Toast.info('请输入正确格式的用户名和密码', 2, null, false);
        } else {
            //执行登录
            this.onLogin();
        }
    }
    onClose = key => () => {   //关闭图形验证码弹窗
        this.setState({
            [key]: false,
            code:""
        });
    }
   
    onErrorClick = (val) => { //验证错误回调
        if (this.state.hasError) {
            Toast.info(val,2,null,false);
        } else if (this.state.error) {
            Toast.info(val, 2, null, false);
        }
    }
    
    onChange = (value) => {  //用户名输入
        this.setState({
            hasError: validate.CheckPhone(value).hasError,
            value:value
        });
    }
    onChangeKeyword = (value) => {   //密码输入
        this.setState({
            error: validate.CheckKeywords(value).hasError,
            keywords:value
        })
    }
    onChangeYzm = (value) => {   //图形验证码输入
        this.setState({
            code:value
        })
    }
    numPlus (e) {     //图形验证码刷新
        e.currentTarget.setAttribute("src", loginUrl[1]);
        setTimeout(()=> {
            this.setState({
                codeNum:++this.state.codeNum
            })         
        },200)
    }
    onLogin() {       //确认登陆
        runPromise("login", {
            username: this.state.value,
            password: this.state.keywords,
            code: this.state.code
        }, this.handleSend, false, "post");
        
    }
    /**
     * 第三方登录接口
     * 
     * @memberof LoginView
     */
    thirdLogin = (platform, access_token, image_path, nick_name) => {
        runPromise("third_login", {
            platform, 
            access_token, 
            image_path, 
            nick_name
        }, this.handleThirdLogin, false, "post");
    }
    loginWx(idx){
        if(window.api){
            if (idx == 1) {
                var wx = api.require('wx');
                let apiKey = 'wx119ef00ddad7a304';
                let apiSecret = '9e0d18bf6ff205f1f7d1e1d955d0a505';
                wx.auth(function (ret, err) {
                    if (ret.status) {
                        alert(JSON.stringify(ret));
                        console.log(JSON.stringify(ret));
                        wx.getToken({
                            apiKey,
                            apiSecret,
                            code: ret.code
                        }, function (ret, err) {
                            alert(JSON.stringify(ret));
                            console.log(JSON.stringify(ret));
                            if (ret.status) {
                                let accessToken = ret.accessToken;
                                let openId = ret.openId;
                                wx.getUserInfo({
                                    accessToken,
                                    openId,
                                }, function (ret, err) {
                                    if (ret.status) {
                                        alert(JSON.stringify(ret));
                                        let { nickname, headimgurl} = ret;
                                        this.thirdLogin("weixin", accessToken, headimgurl, nickname);
                                    } else {
                                        console.log(err.code);
                                    }
                                });

                            } else {
                                console.log("getUserInfo err.code");
                                console.log(err.code);
                            }
                        });
                    } else {
                        console.log(err.code);
                        //数字类型；
                        //错误码：
                        //-1（未知错误），
                        //0（成功，用户同意）
                        //1 (用户取消)
                        //2 (用户拒绝授权)
                        //3 (当前设备未安装微信客户端)
                    }
                });
            } else if (idx == 2) {
                var qq = api.require('qq');
                qq.login(function (ret, err) {
                    alert(JSON.stringify(ret))                    
                    alert(JSON.stringify(err))                    
                    if (ret.status) {
                        console.log(JSON.stringify(ret));
                    } else {
                        console.log(err.msg);
                    }
                });
            } else if (idx == 3) {
                var weibo = api.require('weibo');
                weibo.auth(function (ret, err) {
                    alert(JSON.stringify(ret))                                        
                    alert(JSON.stringify(err))                                        
                    if (ret.status) {
                        alert(JSON.stringify(ret));
                    } else {
                        console.log(err.code);
                        // 数字类型；错误码
                        // 取值范围：
                        // -1（apiKey 或 registUrl 值非法）
                        // 1（用户取消）
                        // 2 （发送失败）
                        // 3 （授权失败）
                        // 4 （不支持的请求）
                        // 5 （未知错误）
                    }
                });
            }
        }
    }
    //环信登录
    IMLogin(hxid) {
        this.sendEventIMLogin(hxid);
    }
    sendEventIMLogin(hxid) {
        if (window.api) {
            window.api.sendEvent({
                name: 'IMLogin',
                extra: {
                    hxid: hxid
                }
            });
        }
    }
    render() {        
        return (
            <Motion defaultStyle={{ left: 300 }} style={{ left: spring(0, { stiffness: 300, damping: 28 }) }}>
                {interpolatingStyle => 
                    <div className="fullScreen">
                        <div className="loginWrap">
                            <div className="loginIn">
                                <div className="loginCenter">
                                    <div className="loginLogo" onClick={() => { hashHistory.push({ pathname: '/' }) }}>
                                        <img src={loginUrl[0]} alt="" />
                                    </div>
                                    <div className="loginIpt">
                                        <List>
                                            <InputItem
                                                type="number"
                                                placeholder="请输入手机号"
                                                error={this.state.hasError}
                                                maxLength={11}
                                                value={this.state.value}
                                                onErrorClick={() => {
                                                    this.onErrorClick(validate.CheckPhone(this.state.value).errorMessage);
                                                }}
                                                clear
                                                onChange={this.onChange}
                                            ><i className="phone iconfont icon-shouji1"></i></InputItem>

                                            <InputItem
                                                type="password"
                                                placeholder="请输入密码"
                                                error={this.state.error}
                                                value={this.state.keywords}
                                                maxLength={18}
                                                onErrorClick={() => {
                                                    this.onErrorClick(validate.CheckKeywords(this.state.keywords).errorMessage);
                                                }}
                                                clear
                                                onChange={this.onChangeKeyword}
                                            ><i className="pwd iconfont icon-icon-test"></i></InputItem>
                                        </List>
                                    </div>
                                    <div>
                                        <Button type="primary"
                                            className="loginBtn"
                                            // onClick={this.showModal('modal')}
                                            onClick={this.clickLogin} 
                                        >登 录</Button>
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
                                                { text: '确定', onPress: () => { this.onLogin(); } }
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
                                    <div className="noAccount fn-clear">
                                        <Link className="fn-left" to='/forget'>忘记密码？</Link>
                                        <Link className="fn-right" to='/register'>注册/手机号登录</Link>
                                    </div>
                                    {/* <ActivityIndicator
                                    toast
                                    text="登陆中..."
                                    animating={this.state.animating}
                                /> */}
                                </div>
                            </div>
                            <div className="loginThree" style={{"display":"none"}}>
                                <div className="loginThreeLine">
                                    <span className="fn-left"></span> 其他登录方式 <span className="fn-right"></span>
                                </div>
                                <div className="loginThreeBottom">
                                    <ul className="fn-clear">
                                        <li className="wx">
                                            {/* <a href="https://www.huakewang.com/wxopenapi/auth_redirect"><i className="iconfont icon-weixin"></i> 微信</a> */}
                                            <a onClick={() => { this.loginWx(1) }}><i className="iconfont icon-weixin"></i> 微信</a>
                                        </li>
                                        <li className="qq">
                                            {/* <a href="https://www.huakewang.com/main/qq_oauth.html"><i className="iconfont icon-qq"></i> QQ</a> */}
                                            <a onClick={() => { this.loginWx(2) }}><i className="iconfont icon-qq"></i> QQ</a>
                                        </li>
                                        <li className="wb">
                                            {/* <a href="https://www.huakewang.com/main/sina_oauth.html"><i className="iconfont icon-weibo"></i> 微博</a> */}
                                            <a onClick={() => { this.loginWx(3) }}><i className="iconfont icon-weibo"></i> 微博</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}




