import React from 'react'
import { List, InputItem, Toast, Button, WhiteSpace, Checkbox, Modal } from 'antd-mobile';
import {Link} from 'react-router';
import { createForm } from 'rc-form';
import QueueAnim from 'rc-queue-anim';

import '../css/font/iconfont.css'

const loginUrl = [
    require('../images/login_logo.png'),
    require('../images/login_phone.png'),
    require('../images/login_psd.png'),
]
const AgreeItem = Checkbox.AgreeItem;
const prompt = Modal.prompt;

class LoginView extends React.Component {
    componentDidMount (){
    
    }
    state = {
        show: true,
        type: 'money',
        hasError: false,
        value: '',
        maskClosable: true
    };
    onErrorClick = () => {
        if (this.state.hasError) {
            Toast.info('请输入11位手机号！');
        }
    }
    onChange = (value) => {
        if (value.replace(/\s/g, '').length < 11) {
            this.setState({
                hasError: true,
            });
        } else {
            this.setState({
                hasError: false,
            });
        }
        this.setState({
            value,
        });
    }
    render() {
        const { getFieldProps } = this.props.form;
        const { type } = this.state;
        return (
            <QueueAnim className="topMargin"
                animConfig={[
                    { opacity: [1, 0], translateX: [0, 150] }
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
                                            type="phone"
                                            placeholder="请输入手机号"
                                            error={this.state.hasError}
                                            onErrorClick={this.onErrorClick}
                                            onChange={this.onChange}
                                            value={this.state.value}
                                        ><i className="phone iconfont icon-shouji1"></i></InputItem>
                                        <InputItem
                                            {...getFieldProps('password') }
                                            type="password"
                                            placeholder="请输入密码"
                                        ><i className="pwd iconfont icon-icon-test"></i></InputItem>
                                        <InputItem className="yzm"
                                            {...getFieldProps('text') }
                                            type="text"
                                            placeholder="验证码"
                                        >
                                            <i className="pwd iconfont icon-shoujiyanzhengma"></i>
                                            <Button type="ghost" inline size="small" className="getCode">获取验证码</Button>
                                        </InputItem>
                                    </List>
                                </div>
                                <div>
                                    <AgreeItem data-seed="logId" onChange={e => console.log('checkbox', e)} className="registerCheckbox">
                                        &nbsp;&nbsp;我已阅读并同意<a className="agreeRulesColor" onClick={(e) => { e.preventDefault(); console.log('ok'); }}>使用条款和隐私政策</a>
                                    </AgreeItem>
                                    <Button type="primary" onClick={() => prompt('输入图形验证码', '证明你不是机器人', [
                                        { text: '取消' },
                                        { text: '确定', onPress: value => console.log(`输入的内容:${value}`) }
                                    ], 'default')}>注册/登陆</Button>
                                </div>
                                <div className="noAccount fn-clear">
                                    <Link className="fn-left" to='/forget'>忘记密码？</Link>
                                    <Link className="fn-right" to='/login'>登 录</Link>
                                </div>
                            </div>
                        </div>
                    </div>               
                ,

                    <div className="loginThree">
                        <div className="loginThreeLine">
                            <span className="fn-left"></span> 其他登陆方式 <span className="fn-right"></span>
                        </div>
                        <div className="loginThreeBottom">
                            <ul className="fn-clear">
                                <li className="wx">
                                    <Link to='/bind'><i className="iconfont icon-weixin"></i> 微信</Link>
                                </li>
                                <li className="qq"><i className="iconfont icon-qq"></i> QQ</li>
                                <li className="wb"><i className="iconfont icon-weibo"></i> 微博</li>
                            </ul>
                        </div>
                    </div>
                    ] : null}
            </QueueAnim>
        );
    }
}
const H5NumberInputExampleWrapper = createForm()(LoginView);
export default H5NumberInputExampleWrapper;




