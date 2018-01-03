import React from 'react'
import { List, InputItem, Toast, Button, WhiteSpace, Modal, NavBar, Icon } from 'antd-mobile';
import { Link,hashHistory} from 'react-router';
import { createForm } from 'rc-form';
import QueueAnim from 'rc-queue-anim';

import '../css/font/iconfont.css'

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
                                            type="phone"
                                            placeholder="请输入手机号"
                                            error={this.state.hasError}
                                            onErrorClick={this.onErrorClick}
                                            onChange={this.onChange}
                                            value={this.state.value}
                                        ><i className="phone iconfont icon-shouji"></i></InputItem>
                                        
                                        <InputItem className="yzm"
                                            {...getFieldProps('text') }
                                            type="text"
                                            placeholder="验证码"
                                        >
                                            <i className="pwd iconfont icon-shoujiyanzhengma"></i>
                                            <Button type="ghost" inline size="small" className="getCode">获取验证码</Button>
                                        </InputItem>

                                        <InputItem
                                            {...getFieldProps('password') }
                                            type="password"
                                            placeholder="输入新密码"
                                        ><i className="pwd iconfont icon-icon-test"></i></InputItem>
                                    </List>
                                </div>
                                <div>
                                    <Button type="primary" onClick={() => prompt('输入图形验证码', '证明你不是机器人', [
                                        { text: '取消' },
                                        { text: '确定', onPress: value => console.log(`输入的内容:${value}`) }
                                    ], 'default')}>确认并登陆</Button>
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
const H5NumberInputExampleWrapper = createForm()(LoginView);
export default H5NumberInputExampleWrapper;




