import React from 'react';
import { hashHistory, Link } from 'react-router';
import { NavBar, Icon, List, SwipeAction, WhiteSpace, Modal, Toast } from 'antd-mobile';
import BScroll from 'better-scroll'

const defaultAvatar = require('../images/selec.png');
const system = require('../images/system.png');
export default class ChatList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            conversations: [], //会话消息列表，此时应该是添加了昵称和头像的消息列表
            customerInfo: "",
            unreadNoticeInfo: "",
        }
        this.handleGetCustomerList = (res) => {
            if (res.success) {
                let { item_list, total_count } = res.data;
                if (item_list.length > 0) {
                    let customerInfo = `${item_list.length > 0 ? item_list[0].Name + "，" : ""}${item_list.length > 1 ? item_list[1].Name + "，" : ""}${item_list.length > 2 ? item_list[2].Name : ""}${item_list.length > 3 ? "..." : ""}${item_list.length}个客户`;
                    this.setState({
                        customerInfo
                    })
                }
            } else {
                Toast.info(res.message, 1);
            }
        }
        this.handleGetMyNoticeCount = (res) => {
            if (res.success) {
                let { unread_notice_cnt, unread_visitor_cnt, unread_commnet_cnt, unread_commnet_rep_cnt, unread_love_cnt } = res.data;
                let unreadNoticeInfo = `${unread_notice_cnt}通知 ${unread_visitor_cnt}看过我 ${unread_commnet_cnt}评论 ${unread_commnet_rep_cnt}回复 ${unread_love_cnt}赞`;
                this.setState({
                    unreadNoticeInfo
                })
            } else {
                Toast.info(res.message, 1.5);
            }
        }
    }
    componentDidMount() {
        this.ajaxGetCustomerList();
        this.ajaxGetMyNoticeCount();
    }
    //聊天
    gotoChat = (conversationId, nick_name) => {
        console.log(conversationId);
        this.sendEventOpenChat(conversationId, nick_name);
        
    }
    //发送消息，根据会话 ID 和类型创建并打开聊天页面
    sendEventOpenChat = (conversationId, nick_name) => {
        if (window.api) {
            console.log("openChat 2");
            window.api.sendEvent({
                name: 'openChat',
                extra: {
                    conversation_id: conversationId,
                    conversation_nick_name: nick_name,
                    hx_id: sessionStorage.getItem("hxid"),
                    nick_name: sessionStorage.getItem("nick_name"),
                }
            });
        }
    }
    //删除会话
    deleteConversation = (conversationId, nick_name) => {
        Modal.alert('删除好友?', nick_name, [
            { text: '取消', onPress: () => { }, style: 'default' },
            { text: '确定', onPress: () => this.sendEventDeleteContact(conversationId) },
        ]);
    }
    //发送消息，根据会话 ID 删除好友，然后更新会话列表
    sendEventDeleteContact = (conversationId) => {
        if (window.api) {
            window.api.sendEvent({
                name: 'deleteContact',
                extra: {
                    conversation_id: conversationId,
                }
            });
        }
    }
    getTimeText(argument) {
        var timeS = argument;
        var todayT = ''; //  
        var yestodayT = '';
        var timeCha = getTimeS(timeS);
        timeS = timeS.slice(-8);
        todayT = new Date().getHours() * 60 * 60 * 1000 + new Date().getMinutes() * 60 * 1000 + new Date().getSeconds() * 1000;
        yestodayT = todayT + 24 * 60 * 60 * 1000;
        if (timeCha > yestodayT) {
            return argument.slice(0, 11);
        }
        if (timeCha > todayT && timeCha < yestodayT) {
            return timeS.slice(0, 2) > 12 ? '昨天 下午' + (timeS.slice(0, 2) == 12 ? 12 : timeS.slice(0, 2) - 12) + timeS.slice(2, 5) : '昨天 上午' + timeS.slice(0, 5);
        }
        if (timeCha < todayT) {
            return timeS.slice(0, 2) >= 12 ? '下午' + (timeS.slice(0, 2) == 12 ? 12 : timeS.slice(0, 2) - 12) + timeS.slice(2, 5) : '上午' + timeS.slice(0, 5);
        }

        function getTimeS(argument) {
            var timeS = argument;
            timeS = timeS.replace(/[年月]/g, '/').replace(/[日]/, '');
            return new Date().getTime() - new Date(timeS).getTime() - 1000; //有一秒的误差  
        } 
    } 
    //格式化时间处理
    FormatDate(Date, fmt) {
        var o = {
            "M+": Date.getMonth() + 1, //月份
            "d+": Date.getDate(), //日
            "h+": Date.getHours(), //小时
            "m+": Date.getMinutes(), //分
            "s+": Date.getSeconds(), //秒
            "q+": Math.floor((Date.getMonth() + 3) / 3), //季度
            "S": Date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (Date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    //系统通知
    SystemNotice = () => {
        hashHistory.push({
            pathname: "/systemNotice",
            query: { form: 'ChatList' },
        });        
    }
    //获取联系人列表
	ajaxGetCustomerList = (limit = 10, offset = 0, pullingUp = false) => {
		let user_id = validate.getCookie("user_id");
		if (!user_id) {
			hashHistory.push({
				pathname: '/login',
				query: { form: 'MyCustomer' }
			});
			return;
		}
		let { latitude, longitude, searchText: keyword } = this.state;
		runPromise('get_customer_list2', {
			user_id,
			longitude,
			latitude,
			offset,
			limit,
			keyword,
		}, this.handleGetCustomerList, true, "post", pullingUp);
    }
    ajaxGetMyNoticeCount() {
        runPromise("get_my_notice_count", {
        }, this.handleGetMyNoticeCount, true, "get");
    }
    render() {
        return (
            <div className="chat-list-page">
                <NavBar
                    className=""
                    mode="light"
                    style={{"border-bottom":"1px solid #c7c7c7"}}
                    // icon={<Icon type="left" />}
                    // onLeftClick={() => hashHistory.goBack()}
                    // leftContent={<span style={{ fontSize: "15px" }}>返回</span>}
                >消息</NavBar>
                <List className="chat-sys-notice">
                    {/* <List.Item arrow="horizontal" multipleLine onClick={this.SystemNotice}>
                        <span className="list-icon-box"><i className="iconfont icon-bell"></i></span>系统通知
                    </List.Item> */}
                    <List.Item
                        arrow="horizontal"
                        thumb={<span className="list-icon-box geren"><i className="iconfont icon-geren"></i></span>}
                        multipleLine
                        onClick={() => { hashHistory.push("/myCustomer") }}
                    >
                        我的客户<List.Item.Brief> {this.state.customerInfo}</List.Item.Brief>
                    </List.Item>
                    <List.Item
                        arrow="horizontal"
                        thumb={<span className="list-icon-box"><i className="iconfont icon-ios-guangbo-outline"></i></span>}
                        multipleLine
                        onClick={() => { hashHistory.push("/messageRemind") }}
                    >
                        系统消息<List.Item.Brief>{this.state.unreadNoticeInfo}</List.Item.Brief>
                    </List.Item>
                </List>
                {/* <WhiteSpace size="lg" /> */}
                <List className="chat-list">
                    {/* <SwipeAction
                        className="chat-list-swipe"
                        autoClose
                        right={[
                            {
                                text: '删除',
                                onPress: () => this.deleteConversation(),
                                style: { backgroundColor: '#F4333C', fontSize: '16px', color: 'white', padding: '0 8px' },
                            },
                            // {
                            //     text: '拉黑',
                            //     onPress: () => this.changeWorks(),
                            //     style: { backgroundColor: '#797979', fontSize: '16px', color: 'white', padding: '0 8px' },
                            // },
                            {
                                text: '聊天',
                                onPress: () => this.gotoChat(),
                                style: { backgroundColor: '#56b949', fontSize: '16px', color: 'white', padding: '0 8px' },
                            },
                            
                        ]}
                    >
                        <List.Item
                            className="chat-list-item"
                            // extra={<i style={{ "font-size": "20px" }} className="iconfont icon-jiantou2"></i>}
                            // thumb={value.path_thumb ? value.path_thumb : defaultAvatar}
                            thumb={<span className="avatar-box"><img className="chat-list-avatar" src={""} onError={(e) => { e.target.src = defaultAvatar }} /><sup className="min-badge-text">1</sup></span>}
                            onClick={() => { this.gotoChat() }}
                        >
                            <p className="name-and-time">
                                <span className="nice-name ellipsis">冰原</span>
                                <span className="sned-time ellipsis">2018-05-04 11:32</span>
                            </p>
                            <p className="word-text ellipsis">哈哈哈，你好呀</p>
                        </List.Item>
                    </SwipeAction> */}
                    {
                        this.props.conversations &&
                        this.props.conversations.length > 0 &&
                        this.props.conversations.map((value, index)=>{
                            let latestMessage = "";
                            switch (value.latestMessage.body.type) {
                                case "text":
                                    latestMessage = value.latestMessage.body.text
                                    break;
                                case "image":
                                    latestMessage = "[图片消息]";
                                    break;
                                case "video":
                                    latestMessage = "[视频消息]";
                                    break;
                                case "location":
                                    latestMessage = "[位置消息]";
                                    break;
                                case "voice":
                                    latestMessage = "[语音消息]";
                                    break;
                                case "file":
                                    latestMessage = "[文件消息]";
                                    break;
                                case "cmd":
                                    latestMessage = "[命令消息]";
                                    break;
                            }
                            let timestamp = value.latestMessage.timestamp;
                            let showTimeText = this.getTimeText(this.FormatDate(new Date(parseInt(timestamp)), 'yyyy年MM月dd日 hh:mm:ss'));
                            return <SwipeAction
                                className="chat-list-swipe"
                                autoClose
                                right={[
                                    {
                                        text: '删除',
                                        onPress: () => this.deleteConversation(value.conversationId, value.nick_name),
                                        style: { backgroundColor: '#F4333C', fontSize: '16px', color: 'white', padding: '0 8px' },
                                    },
                                    {
                                        text: '聊天',
                                        onPress: () => this.gotoChat(value.conversationId, value.nick_name),
                                        style: { backgroundColor: '#56b949', fontSize: '16px', color: 'white', padding: '0 8px' },
                                    },

                                ]}
                            >
                                <List.Item
                                    className="chat-list-item"
                                    thumb={
                                        <span className="avatar-box">
                                            <img className="chat-list-avatar" src={value.path_thumb} onError={(e) => { e.target.src = defaultAvatar }} />
                                            {
                                                value.unreadMessagesCount > 0 ? <sup className="min-badge-text">{value.unreadMessagesCount}</sup> : null
                                            }
                                        </span>
                                    }
                                    onClick={() => { this.gotoChat(value.conversationId, value.nick_name) }}
                                >
                                    <p className="name-and-time">
                                        <span className="nice-name ellipsis">{value.nick_name}</span>
                                        <span className="sned-time ellipsis">{showTimeText}</span>
                                    </p>
                                    <p className="word-text ellipsis">{latestMessage}</p>
                                </List.Item>
                            </SwipeAction>
                        })
                    }
                    {/* {
                        this.props.conversations &&
                        this.props.conversations.length == 0 ? <p className="no-news">暂无消息</p> : null
                    } */}
                    

                </List>
            </div>
        )
    }
}