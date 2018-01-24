import React from 'react'
import { List, InputItem, Toast, Button, Modal } from 'antd-mobile';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import { CheckPhone,CheckKeywords } from './validate';

import '../css/font/iconfont.css'

const loginUrl = [
    require('../images/login_logo.png'),
    require('../images/login_phone.png'),
    require('../images/login_psd.png')
]

const prompt = Modal.prompt;


export default class LoginView extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            show: true,
            type: 'money',
            hasError: false,
            error: false,
            value: '',
            keywords:'',
            loginData:{
                username:"",
                password:"",
                code:""
            }
        };
        this.handleSend = () => {
            
        }
    }
    
    componentDidMount() {

    }

    onErrorClick = (val) => {
        if (this.state.hasError) {
            Toast.info(val,1,null,false);
        } else if (this.state.error) {
            Toast.info(val, 1, null, false);
        }
    }
    
    onChange = (value) => {
        this.setState({
            hasError: CheckPhone(value).hasError,
        });
    }
    onChangeKeyword = (value) => {
        this.setState({
            error: CheckKeywords(value).hasError,
        })
    }
    onLogin = (loginData) => {
        runPromise("login", {
            username: loginData.username,
            password: loginData.password,
            code: loginData.code
        }, this.handleSend, false, "post", "a");
    }
    render() {
        return (
            <QueueAnim className="topMargin" animConfig={[
                { opacity: [1, 0], translateX: [0, 50] }
            ]}>
                {this.state.show ? [
                    <div className="loginWrap" key="1">
                        <div className="loginIn">
                            <div className="loginCenter">
                                <div className="loginLogo">
                                    <img src={loginUrl[0]} alt="" />
                                </div>
                                <div className="loginIpt">
                                    {/* <List> */}
                                        <InputItem
                                            type="number"
                                            placeholder="请输入手机号"
                                            error={this.state.hasError}
                                            maxLength={11}
                                            onErrorClick={()=>{
                                                this.onErrorClick(CheckPhone(this.state.value).errorMessage);
                                            }}
                                            onChange={this.onChange}
                                        ><i className="phone iconfont icon-shouji1"></i></InputItem>

                                        <InputItem
                                            type="password"
                                            placeholder="请输入密码"
                                            error={this.state.error}                                            
                                            maxLength={18}    
                                            onErrorClick={() => {
                                                this.onErrorClick(CheckKeywords(this.state.value).errorMessage);
                                            }}
                                            onChange={this.onChangeKeyword}                                        
                                        ><i className="pwd iconfont icon-icon-test"></i></InputItem>
                                    {/* </List> */}
                                </div>
                                <div>
                                    <Button 
                                        type="primary"
                                        className="loginBtn" 
                                        onClick={() => prompt('输入图形验证码', <img src="https://www.huakewang.com/index.php/verifycode/index/11" />,
                                            [
                                                {
                                                    text: 'Close',
                                                    onPress: value => new Promise((resolve) => {
                                                        Toast.info('onPress promise resolve', 1);
                                                        setTimeout(() => {
                                                            resolve();
                                                            console.log(`value:${value}`);
                                                        }, 1000);
                                                    }),
                                                },
                                                {
                                                    text: 'Hold on',
                                                    onPress: value => new Promise((resolve, reject) => {
                                                        Toast.info('onPress promise reject', 1);
                                                        setTimeout(() => {
                                                            reject();
                                                            console.log(`value:${value}`);
                                                        }, 1000);
                                                    }),
                                                },
                                            ], 'default', null, ['input your name'])}
                                    >登 陆</Button>
                                </div>
                                <div className="noAccount fn-clear">
                                    <Link className="fn-left" to='/forget'>忘记密码？</Link>
                                    <Link className="fn-right" to='/register'>注册/手机号登录</Link>
                                </div>
                            </div>
                        </div>
                    </div>,
                    <div className="loginThree">
                        <div className="loginThreeLine">
                            <span className="fn-left"></span> 其他登陆方式 <span className="fn-right"></span>
                        </div>
                        <div className="loginThreeBottom">
                            <ul className="fn-clear">
                                <li className="wx"><i className="iconfont icon-weixin"></i> 微信</li>
                                <li className="qq"><i className="iconfont icon-qq"></i> QQ</li>
                                <li className="wb"><i className="iconfont icon-weibo"></i> 微博</li>
                            </ul>
                        </div>
                    </div>
                ] : null}
            </QueueAnim >
        );
    }
}




