import React from 'react'
import { List, InputItem, Toast, Button, Modal } from 'antd-mobile';
import { Link, hashHistory } from 'react-router';
import QueueAnim from 'rc-queue-anim';

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
            value: '15657185156',
            keywords:'luolei251537',
            code:"",
            codeNum:2
        };
        this.handleSend = (res) => {
            console.log(res)
            if(res.success) {
                hashHistory.goBack();
                validate.setCookie('user_id',res.data.id);
            }else{
                if(res.message == "图形验证码不对") {
                    Toast.info("图形验证码不正确", 1, null, false);
                    this.setState({
                        codeNum: ++this.state.codeNum
                    })
                }else{
                    Toast.info(res.message, 1, null, false);                    
                    this.onClose('modal')();
                }
            }
        }
    }
    
    componentDidMount() {
        
    }
    showModal = key => (e) => {   //弹窗提示输入验证码
        e.preventDefault(); // 修复 Android 上点击穿透
        if (this.state.value.replace(/(^\s*)|(\s*$)/g, '') == "" || this.state.keywords.replace(/(^\s*)|(\s*$)/g, '') == "" ) {
            Toast.info('用户名或者密码不能为空', 1,null,false);
        }else if(this.state.hasError == true || this.state.error == true) {
            Toast.info('请输入正确格式的用户名和密码', 1,null,false);
        }else{
            this.setState({
                [key]: true,
            });
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
            Toast.info(val,1,null,false);
        } else if (this.state.error) {
            Toast.info(val, 1, null, false);
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
                                    <List>
                                        <InputItem
                                            type="number"
                                            placeholder="请输入手机号"
                                            error={this.state.hasError}
                                            maxLength={11}
                                            value={this.state.value}
                                            onErrorClick={()=>{
                                                this.onErrorClick(validate.CheckPhone(this.state.value).errorMessage);
                                            }}
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
                                            onChange={this.onChangeKeyword}
                                        ><i className="pwd iconfont icon-icon-test"></i></InputItem>
                                    </List>
                                </div>
                                <div>
                                    <Button type="primary"
                                        className="loginBtn"
                                        onClick={this.showModal('modal')}
                                    >登 陆</Button>
                                    <Modal
                                        visible={this.state.modal}
                                        transparent
                                        maskClosable={false}
                                        closable={true}
                                        onClose={this.onClose('modal')}
                                        title={
                                            <div style={{textAlign:'left',lineHeight:'24px',fontSize:'16px'}}>
                                                <p>输入图形验证码</p>
                                                <p>证明你不是机器人</p>
                                            </div>
                                        }
                                        footer={[
                                            { text: '取消', onPress: () => { this.onClose('modal')(); } },
                                            { text: '确定', onPress: () => { this.onLogin() }}
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
                                                src={'https://www.huakewang.com/index.php/verifycode/index/'+this.state.codeNum} 
                                                className="fn-right" 
                                                onClick={(e) => { this.numPlus(e)}}
                                            />
                                        </div>
                                    </Modal>
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
                                <li className="wx">
                                    <a href="https://www.huakewang.com/wxopenapi/auth_redirect"><i className="iconfont icon-weixin"></i> 微信</a>
                                </li>
                                <li className="qq">
                                    <a href="https://www.huakewang.com/main/qq_oauth.html"><i className="iconfont icon-qq"></i> QQ</a>
                                </li>
                                <li className="wb">
                                    <a href="https://www.huakewang.com/main/sina_oauth.html"><i className="iconfont icon-weibo"></i> 微博</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                ] : null}
            </QueueAnim >
        );
    }
}




