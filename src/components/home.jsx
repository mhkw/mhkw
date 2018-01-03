import React from 'react'
import { List, InputItem, Toast, Button, WhiteSpace, Checkbox, Modal,NavBar,Icon } from 'antd-mobile';
import {Link} from 'react-router';
import { createForm } from 'rc-form';
import QueueAnim from 'rc-queue-anim';

import '../css/font/iconfont.css'

const loginUrl = [
    require('../images/login_logo.png'),
    require('../images/login_phone.png'),
    require('../images/login_psd.png')
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
            <div className="homeWrap">
                <div className="homeWrapTop">
                    <div className="indexNav">
                        <NavBar
                            mode="light"
                            onLeftClick={() => hashHistory.goBack()}
                            rightContent={[
                                <Icon key="0" type="search" style={{ marginRight: '16px' }} />
                            ]}
                        ><Link to="/city"><i className="iconfont"></i>山景路666号</Link></NavBar>
                    </div>
                </div>
                <div className="homeWrapMain">

                </div>
            </div>
        );
    }
}
const H5NumberInputExampleWrapper = createForm()(LoginView);
export default H5NumberInputExampleWrapper;




