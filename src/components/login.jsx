import React from 'react'
import { List, InputItem , Toast ,Button, WhiteSpace,Checkbox } from 'antd-mobile';
import {Link} from 'react-router';
import { createForm } from 'rc-form';
import QueueAnim from 'rc-queue-anim';

// class LoginControl extends Component {
//     constructor(props) {
//         super(props);
//         this.handleLoginClick = this.handleLoginClick.bind(this);
//         this.handleLogoutClick = this.handleLogoutClick.bind(this);
//         this.state = {isLoggedIn: false};
//     }
//
//     handleLoginClick() {
//         this.setState({isLoggedIn: true});
//     }
//
//     handleLogoutClick() {
//         this.setState({isLoggedIn: false});
//     }
//
//     render() {
//         const isLoggedIn = this.state.isLoggedIn;
//
//         let button = null;
//         if (isLoggedIn) {
//             button = <LogoutButton onClick={this.handleLogoutClick} />;
//         } else {
//             button = <LoginButton onClick={this.handleLoginClick} />;
//         }
//
//         return (
//             <div>
//                 <Greeting isLoggedIn={isLoggedIn} />
//                 {button}
//             </div>
//         );
//     }
// }
//
// function UserGreeting(props) {
//     return <h1>Welcome back!</h1>;
// }
//
// function GuestGreeting(props) {
//     return <h1>Please sign up.</h1>;
// }
//
// function Greeting(props) {
//     const isLoggedIn = props.isLoggedIn;
//     if (isLoggedIn) {
//         return <UserGreeting />;
//     }
//     return <GuestGreeting />;
// }
//
// function LoginButton(props) {
//     return (
//         <button onClick={props.onClick}>
//             Login
//         </button>
//     );
// }
//
// function LogoutButton(props) {
//     return (
//         <button onClick={props.onClick}>
//             Logout
//         </button>
//     );
// }
const loginUrl = [
    require('../images/login_logo.png'),
    require('../images/login_phone.png'),
    require('../images/login_psd.png')
]
const AgreeItem = Checkbox.AgreeItem;

class LoginView extends React.Component {
    componentDidMount (){
    
    }
    state = {
        show: true,
        type: 'money',
        hasError: false,
        value: '',
    };
    onErrorClick = () => {
        if (this.state.hasError) {
            Toast.info('Please enter 22 digits');
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
            <div className="loginWrap">
                <QueueAnim className="loginIn"
                           animConfig={[
                               { opacity: [1, 0], translateY: [0, 150] }
                           ]}>
                    {this.state.show ? [
                        <div className="loginCenter" key="1">
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
                                    ><i className="phone"><img src={loginUrl[1]} alt="" /></i></InputItem>
                                    <InputItem
                                        {...getFieldProps('password')}
                                        type="password"
                                        placeholder="****"
                                    ><i className="pwd"><img src={loginUrl[2]} alt="" /></i></InputItem>
                                </List>
                            </div>
                            <div>
                                <AgreeItem data-seed="logId" onChange={e => console.log('checkbox', e)}>
                                    &nbsp;&nbsp;我已同意<a onClick={(e) => { e.preventDefault(); alert('agree it'); }}>使用条款和隐私政策</a>
                                </AgreeItem>
                                <Button type="primary">登 陆</Button>
                            </div>
                            <div className="noAccount fn-clear">
                                <Link className="fn-left" to='/forget'>忘记密码？</Link>
                                <Link className="fn-right" to='/register'>新用户注册</Link>
                            </div>
                        </div>
                    ] : null}
                </QueueAnim>
            </div>
        );
    }
}
const H5NumberInputExampleWrapper = createForm()(LoginView);
export default H5NumberInputExampleWrapper;




