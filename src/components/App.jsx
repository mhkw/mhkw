import React, {Component} from 'react'
import {Router, Route, hashHistory, IndexRoute, Link} from 'react-router';
import QueueAnim from 'rc-queue-anim';

// import 'antd-mobile/dist/antd-mobile.css';
import '../css/main.scss';

const appUrl = [
    require('../images/upNeed.png'),
    require('../images/upWorks.png'),
    require('../images/upQuote.png'),
    require('../images/upTalk.png'),
]
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:false,
        };
    }
    onClick = () => {
        this.setState({
            show: !this.state.show,
        });
    }
    render() {
        return (
            <div>
                {this.props.children}
                <div className="barBottom fn-clear">
                    <ul className="fn-clear">
                        <li className='picSize'>
                            <Link to="/">
                                <i className='picSize1'></i>
                                <span>首页</span>
                            </Link>
                        </li>
                        <li className='picSize'>
                            <Link to="/circle" >
                                <i className='picSize2'></i>
                                <span>画客圈</span>
                            </Link>
                        </li>
                        <li className='picSize'>
                            <a href="javascript:void(0);" onClick={this.onClick}>
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
                <div className="navPlus">
                    <QueueAnim className="demo-content"
                        animConfig={[
                            { opacity: [1, 0], translateY: [0, 800] },
                            { opacity: [1, 0], translateY: [0, 80] }
                        ]}>
                        {this.state.show ? [
                            <div className="demo-thead navPlusAnim" key="a">
                                <ul className="fourWrap">
                                    <li className="upNeed">
                                        <img src={appUrl[0]} alt=""/>
                                        发布需求
                                    </li>
                                    <li className="upWorks">
                                        <img src={appUrl[1]} alt="" />                                    
                                        发布作品
                                    </li>
                                    <li className="upQuote">
                                        <img src={appUrl[2]} alt="" />
                                        发送报价
                                    </li>
                                    <li className="upTalk">
                                        <img src={appUrl[3]} alt="" />                                    
                                        发送帖子
                                    </li>
                                </ul>
                                <span className="iconfont icon-chuyidong1-copy" onClick={this.onClick}></span>
                            </div>
                        ] : null}
                    </QueueAnim>
                </div>
            </div>
        );
    }
}

