import React from 'react';
import { hashHistory } from 'react-router';
import { Toast, NavBar, Icon, List } from 'antd-mobile';
import { Motion, spring } from 'react-motion';
import BScroll from 'better-scroll';

const system = require('../images/system.png');

export default class SystemNotice extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            SystemNotice: [], //系统通知
        }
        this.handleSystemNotice = (res) => {
            if (res.success) {
                //这种写法,直接赋值给新的状态，并没有考虑分页的问题
                this.setState({
                    SystemNotice: res.data.item_list, 
                })
            } else {
                Toast.fail(res.message, 1);
            }
        }
    }
    componentDidMount() {
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 35;
        const scroll = new BScroll(document.querySelector('.wrapper'), { click: true })
        this.setState({
            height: hei
        })
        this.ajaxSystemNotice();
    }
    //获取系统通知列表
    ajaxSystemNotice = (per_page = 10, page = 1) => {
        runPromise("get_my_sys_notice_list", {
        }, this.handleSystemNotice, true, "post");
    }
    render() {
        return (
            <Motion defaultStyle={{ left: 300 }} style={{ left: spring(0, { stiffness: 300, damping: 28 }) }}>
                {interpolatingStyle =>
                    <div style={{ ...interpolatingStyle, position: "relative" }} className="system-notice-page">
                        <NavBar
                            className="NewNavBar top"
                            mode="light"
                            icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                            onLeftClick={() => hashHistory.goBack()}
                        >系统通知</NavBar>
                        <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                            <List>
                                {
                                    this.state.SystemNotice.length > 0 ? 
                                    this.state.SystemNotice.map((value, index)=>(
                                        <List.Item
                                            className="notice-list"
                                            multipleLine
                                            // onClick={this.SystemNotice}
                                            thumb={<img className="notice-img" src={system} />}
                                        >
                                            <List.Item.Brief>
                                                {value.content}
                                            </List.Item.Brief>
                                        </List.Item>
                                    ))    
                                    : <p className="null-placeholder">暂无通知</p>
                                }
                            </List>
                        </div>
                    </div>
                }
            </Motion>
        )
    }
}