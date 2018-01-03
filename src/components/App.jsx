import React, {Component} from 'react'
import {Router, Route, hashHistory, IndexRoute, Link} from 'react-router';

import ReactDOM from 'react-dom'

// import 'antd-mobile/dist/antd-mobile.css';
import '../css/main.scss';


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'redTab',
            hidden: false,
            fullScreen: false
        };
    }
    
    render() {
        return (
            <div>
                {this.props.children}
                <div className="barBottom fn-clear">
                    <ul className="fn-clear">
                        <li className='picSize'>
                            <Link to="/s2">
                                <i className='picSize1'></i>
                                <span>首页</span>
                            </Link>
                        </li>
                        <li className='picSize'>
                            <a href="javascript:void(0);">
                                <i className='picSize2'></i>
                                <span>画客圈</span>
                            </a>
                        </li>
                        <li className='picSize'>
                            <a href="javascript:void(0);">
                                <i className='picSize3'></i>
                            </a>
                        </li>
                        <li className='picSize'>
                            <a href="javascript:void(0);">
                                <i className='picSize4'></i>
                                <span>消息</span>
                            </a>
                        </li>
                        <li className='picSize'>
                            <Link to="/login">
                                <i className='picSize5'></i>
                                <span>我的</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

