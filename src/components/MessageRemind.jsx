import React from 'react';
import { hashHistory } from 'react-router';
import { Toast, NavBar, Icon, List, SearchBar, SwipeAction, Modal, WingBlank, TextareaItem, Button, Tabs } from 'antd-mobile';
import { Comment, SeeMe, Fabulous, SystemNotification } from "./MessageRemindTemplate";
import { Motion, spring } from 'react-motion';
import BScroll from 'better-scroll';

import update from 'immutability-helper';

let tabsLabel = [
    { title: '评论', sub: '0' },
    { title: '看我过', sub: '1' },
    { title: '赞', sub: '2' },
    { title: '系统通知', sub: '3' }
];

export default class MessageRemind extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            scroll_0: null, //滚动插件实例化对象
            scroll_1: null,
            scroll_2: null,
            scroll_3: null,
            scroll_bottom_tips_0: "", //上拉加载的tips
            scroll_bottom_tips_1: "",
            scroll_bottom_tips_2: "",
            scroll_bottom_tips_3: "",
        }
        this.handleGetMyNoticeList = (res) => {
            if (res.success) {
                console.log(res)
            } else {
                Toast.info(res.message, 1.5);
            }
        }
        this.handleGetVisitorList = (res) => {
            if (res.success) {
                console.log(res)
            } else {
                Toast.info(res.message, 1.5);
            }
        }
        this.handleGetLoveMeList = (res) => {
            if (res.success) {
                console.log(res)
            } else {
                Toast.info(res.message, 1.5);
            }
        }
        this.handleSystemNotice = (res) => {
            if (res.success) {
                console.log(res)
            } else {
                Toast.info(res.message, 1.5);
            }
        }
    }
    componentDidMount() {
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 68.5;
        const scroll_0 = new BScroll(document.querySelector('.wrapper.one'), { click: true, bounceTime: 300, swipeBounceTime: 200, pullUpLoad: { threshold: -40 } });
        const scroll_1 = new BScroll(document.querySelector('.wrapper.two'), { click: true, bounceTime: 300, swipeBounceTime: 200, pullUpLoad: { threshold: -40 } });
        const scroll_2 = new BScroll(document.querySelector('.wrapper.three'), { click: true, bounceTime: 300, swipeBounceTime: 200, pullUpLoad: { threshold: -40 } });
        const scroll_3 = new BScroll(document.querySelector('.wrapper.four'), { click: true, bounceTime: 300, swipeBounceTime: 200, pullUpLoad: { threshold: -40 } });
        this.setState({
            height: hei,
            scroll_0,
            scroll_1,
            scroll_2,
            scroll_3,
        });
        scroll_0.on('pullingUp', () => {
            this.ajaxNextPage(0);
        });
        scroll_1.on('pullingUp', () => {
            this.ajaxNextPage(1);
        });
        scroll_2.on('pullingUp', () => {
            this.ajaxNextPage(2);
        });
        scroll_3.on('pullingUp', () => {
            this.ajaxNextPage(3);
        });

        //临时测试，用完删
        this.ajaxGetMyNoticeList();
        this.ajaxGetVisitorList();
        this.ajaxGetLoveMeList("works");
        this.ajaxSystemNotice();
    }
    onChangeTabs = (tab, index) => {
        console.log(tab, index)
    }
    ajaxNextPage(index) {

    }
    //对应的tab页：评论
    ajaxGetMyNoticeList = (page = 1, per_page = 10) => {
        runPromise("get_my_notice_list", {
            per_page,
            page,
        }, this.handleGetMyNoticeList, true, "post");
    }
    //对应的tab页：看我过
    ajaxGetVisitorList(offset = 0, limit = 10) {
        runPromise('get_visitor_list', {
            offset,
            limit,
        }, this.handleGetVisitorList);
    }
    //对应的tab页：赞
    ajaxGetLoveMeList(type = "user", page = 1, per_page = 10) {
        runPromise('get_love_me_list', {
            type,
            per_page,
            page,
        }, this.handleGetLoveMeList, true, "get");
    }
    //对应的tab页：系统通知
    ajaxSystemNotice = (page = 1, per_page = 10) => {
        runPromise("get_my_sys_notice_list", {
            per_page,
            page,
        }, this.handleSystemNotice, true, "get");
    }
    render() {
        return (
            <Motion defaultStyle={{ left: 300 }} style={{ left: spring(0, { stiffness: 300, damping: 28 }) }}>
                {interpolatingStyle =>
                    <div style={{ ...interpolatingStyle, position: "relative" }} className="message-remind-page">
                        <NavBar
                            className="NewNavBar top"
                            mode="light"
                            icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                            onLeftClick={() => hashHistory.goBack()}
                        >消息提醒</NavBar>
                        <Tabs tabs={tabsLabel}
                            // prefixCls="message-remind-tabs"
                            tabBarBackgroundColor="#f0f0f0"
                            tabBarUnderlineStyle={{ "border": "1px #a9a9a9 solid"}}
                            tabBarInactiveTextColor="#555"
                            tabBarActiveTextColor="#292929"
                            initialPage={0}
                            swipeable={false}
                            prerenderingSiblingsNumber={3}
                            onChange={this.onChangeTabs}
                        >
                            <div className="wrapper one" style={{ overflow: "hidden", height: this.state.height }}>
                                <Comment />
                            </div>
                            <div className="wrapper two" style={{ overflow: "hidden", height: this.state.height }}>
                                <SeeMe />
                            </div>
                            <div className="wrapper three" style={{ overflow: "hidden", height: this.state.height }}>
                                <Fabulous />
                            </div>
                            <div className="wrapper four" style={{ overflow: "hidden", height: this.state.height }}>
                                <SystemNotification />
                            </div>
                        </Tabs>
                    </div>
                }
            </Motion>
        )
    }
}