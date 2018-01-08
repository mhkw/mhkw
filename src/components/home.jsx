import React from 'react'
import { List, InputItem, Toast, Button, WhiteSpace, Checkbox, Modal, NavBar, Icon, Tabs } from 'antd-mobile';
import {Link} from 'react-router';
import { createForm } from 'rc-form';
import QueueAnim from 'rc-queue-anim';

import '../css/font/iconfont.css'

const loginUrl = [
    require('../images/home/lei1.png'),
    require('../images/home/lei2.png'),
    require('../images/home/lei3.png'),
    require('../images/home/lei4.png'),
    require('../images/home/lei5.png'),
    require('../images/home/lei6.png'),
    require('../images/home/lei7.png'),
    require('../images/home/lei8.png'),
    require('../images/touxiang.png'),
]

const AgreeItem = Checkbox.AgreeItem;
const prompt = Modal.prompt;

export default class LoginView extends React.Component {
    state = {
        show: true,
        type: 'money',
        hasError: false,
        value: '',
        maskClosable: true,
        data: ['', '', ''],
        // imgHeight: 80,
    };
    componentDidMount() {
        
    }
    render() {
        const tabs = [
            { title: <div className="fn-clear tabsList"><img src={loginUrl[0]} /><p>软件开发</p></div>},
            { title: <div className="fn-clear tabsList"><img src={loginUrl[1]} /><p>软件开发</p></div>},
            { title: <div className="fn-clear tabsList"><img src={loginUrl[2]} /><p>软件开发</p></div>},
            { title: <div className="fn-clear tabsList"><img src={loginUrl[3]} /><p>软件开发</p></div>},
            { title: <div className="fn-clear tabsList"><img src={loginUrl[4]} /><p>软件开发</p></div>},
            { title: <div className="fn-clear tabsList"><img src={loginUrl[5]} /><p>软件开发</p></div>},
            { title: <div className="fn-clear tabsList"><img src={loginUrl[6]} /><p>软件开发</p></div>},
            { title: <div className="fn-clear tabsList"><img src={loginUrl[7]} /><p>软件开发</p></div>},
        ];

        return (
            <div className="homeWrap">
                <div className="homeWrapTop">
                    <div className="indexNav">
                        <NavBar
                            mode="light"
                            onLeftClick={() => hashHistory.goBack()}
                            rightContent={[
                                <div className="searchAll">
                                    <i className="iconfont icon-icon05"></i>
                                </div>
                            ]}
                        ><Link to="/city"><i className="iconfont icon-dingwei"></i>山景路666号</Link></NavBar>
                    </div>
                    <div className="hometabs"> 
                        <Tabs tabs={tabs} 
                            tabBarBackgroundColor="transparent"
                            tabBarUnderlineStyle={{display:"none"}}
                            onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                        >
                            
                        </Tabs>
                    </div>
                </div>
                <div className="homeWrapMain">
                    <div className="items">
                        <div className="itemsTop">
                            <div className="itemsTopPic">
                                {/* <img src={} alt=""/> */}
                            </div>
                            <div className="itemsTopRight">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}




