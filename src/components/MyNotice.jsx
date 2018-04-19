import React from 'react'
import { List, InputItem, PullToRefresh, ListView, TextareaItem, Toast, NavBar, Icon } from 'antd-mobile';
import { Link, hashHistory } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import { ItemPicLists, PersonalMsg } from './templateHomeCircle';
import axios from 'axios'
import update from 'immutability-helper';
import { Motion, spring } from 'react-motion';

const loginUrl = {
    "banner01": require('../images/banner01.jpg'),
    "banner02": require('../images/banner02.jpg'),
    "banner03": require('../images/banner03.jpg'),
    "demand": require('../images/demand_draw_new.png'),
    "work": require('../images/work_draw_new.png'),
    "tiezi": require('../images/tiezi_draw_new.png'),
    "essay": require('../images/essay_draw_new.png'),
    "selec": require('../images/selec.png'),
}
const defaultAvatar = require("../images/logoZhanWei.png");

let realData = [];
let index = realData.length - 1;
let realDataLength = realData.length;

const NUM_ROWS = 7;
let pageIndex = 0;


export default class LoginView extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            data: [loginUrl.banner01, loginUrl.banner02, loginUrl.banner03],
            page: "1",
            imgHeight: 176,
            height:"",
            slideIndex: 0,
            dataSource: dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("mynotice")) ? JSON.parse(sessionStorage.getItem("mynotice")) : []),
            refreshing: false,
            isLoading: true,
            useBodyScroll: false,
            showReplyInput: false,       //输入框显示
            res: [],
            love_list: [],
            placeholderWords: "留言：",
            commentToId: "",        //发帖人id
            commentId: "",         //文章id
            content: "",
            keyCode: "-1",            //索引
            sendBtnStatus: false,       //留言
            replySendStatus: false,    //回复还是留言
            rep_user_id: "",     //被回复人的id
            comment_id: "",      //回复的回复id
            replay_name: ""     //给..回复
        };
        this.genData = (pIndex = 0, realLength, data) => {
            let dataBlob = [];
            dataBlob = data;
            return dataBlob;
        };
        this.handleSend = (res) => {
            if (res.success) {
                realData = res.data.item_list;
                index = realData.length - 1;
                realDataLength = res.data.item_list.length;
                if (pageIndex == 0) {
                    this.rData = [];
                    this.rData = [...this.rData, ...this.genData(pageIndex++, realDataLength, realData)];
                    sessionStorage.setItem("mynotice", JSON.stringify(realData));
                } else {
                    this.rData = [...this.rData, ...this.genData(pageIndex++, realDataLength, realData)];
                }
                const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop - 25;                
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.rData),
                    hasMore: res.data.is_next_page ? true : false,
                    isLoading: res.data.is_next_page ? true : false,
                    page: ++this.state.page,
                    height: hei,
                    res: this.state.dataSource.cloneWithRows(this.rData)._dataBlob.s1,
                });
                setTimeout(() => {
                    this.setState({
                        refreshing: false
                    })
                }, 300);
            } else {
                if (res.message == "会话已失效，请重新登录") {
                    validate.setCookie({ 'user_id': '' })
                    hashHistory.push({ pathname: "/login" })
                } else {
                    Toast.info(res.message, 2, null, false);
                }
            }
        }
        this.addheartlis = (res, para) => {   //点赞
            if (res.success) {
                let numStar = para.e.target.parentNode.children[1].innerText;
                let loveLis = this.state.res[para.idx].love_list;
                if (res.message.type == 'delete') {
                    loveLis.map((value, index) => {
                        if (res.message.nick_name == value.nick_name) {
                            loveLis.splice(index, 1);
                        }
                    })
                    para.e.target.style.color = "#333";
                    para.e.target.nextSibling.innerHTML = numStar - 1;
                    let newList = update(this.state.res, { [para.idx]: { love_list: { $set: loveLis } } });
                    this.setState({ res: newList })
                } else if (res.message.type == 'add') {
                    para.e.target.style.color = "#F95231";
                    para.e.target.nextSibling.innerHTML = numStar - 0 + 1;
                    loveLis.push(res.message);
                    let newList = update(this.state.res, { [para.idx]: { love_list: { $set: loveLis } } });
                    this.setState({ res: newList })
                }
            }
        }
        this.addcommentlis = (req) => {
            if (req.success) {
                let wrap = document.createElement("div");
                let domLi = document.createElement('li');
                let innerSpan = document.createElement('span');
                let innerI = document.createElement('i');
                if (!this.state.replySendStatus) {        //回复
                    innerSpan.innerHTML = decodeURIComponent(validate.getCookie('user_name')) + '回复:' + this.state.replay_name;
                    innerI.innerHTML = this.state.content;
                    domLi.appendChild(innerSpan);
                    domLi.appendChild(innerI);
                    wrap.appendChild(domLi);
                    let currentLi = document.getElementById("rowid" + this.state.keyCode);
                    currentLi.appendChild(wrap);
                } else {                           //留言
                    innerSpan.innerHTML = req.data.nick_name;
                    innerI.innerHTML = req.data.comment_content;
                    domLi.appendChild(innerSpan);
                    domLi.appendChild(innerI);
                    wrap.appendChild(domLi);
                    let currentLi = document.getElementById("rowid" + this.state.keyCode);
                    currentLi.appendChild(wrap);
                }
            }
        }
    }

    componentDidUpdate() {
        // if (this.state.useBodyScroll) {
        //     document.body.style.overflow = 'auto';
        // } else {
        //     document.body.style.overflow = 'hidden';
        // }
    }
    shouldComponentUpdate() {
        return (this.props.router.location.action === 'POP');
    }
    componentDidMount() {
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
        this.getNoticeList(1);
    }
    routerWillLeave(nextLocation) {
        pageIndex = 0;
    }
    getNoticeList = (page) => {
        // runPromise("get_circle_list", {        //获取列表
        //     user_id: '0',
        //     per_page: "5",
        //     page: page
        // }, this.handleSend, false, "get");
        axios({
            method: "POST",
            url: 'https://www.huakewang.com/hkw_newapi/get_my_notice_list/10/' + page,
            withCredentials: true,
            crossDomain: true,
            data: {
                user_id: validate.getCookie('user_id')
            }
        })
            .then((res) => {
                this.handleSend(res.data);
            })
            .catch((error) => {
                console.log(error.data);
            });
    }
    onRefresh = () => {   //顶部下拉刷新数据
        pageIndex = 0;
        this.setState({
            refreshing: true
        });
        this.getNoticeList(1);
    };

    onEndReached = (event) => {
        // load new data   数据加载完成
        if (!this.state.isLoading && !this.state.hasMore) {
            return;
        }
        this.getNoticeList(this.state.page);
    };
    addHeart = (e, toId, rowID) => {    //点赞
        e.persist();
        runPromise("add_love", {
            id: toId,
            user_id: validate.getCookie('user_id'),
            model: "circle"
        }, this.addheartlis, true, "post", { e: e, idx: rowID });
    }
    onChangeReplyInput = (value) => {
        if (value.length > 0) {
            this.setState({
                sendBtnStatus: true,
                content: value
            })
        } else {
            this.setState({
                sendBtnStatus: false,
                content: value
            })
        }
    }
    toggleInput = (key, uid, id) => {
        if (key == this.state.keyCode) {
            this.setState({
                showReplyInput: !this.state.showReplyInput,
            }, () => { this.textarea.focus(); });
        } else if (key != this.state.keyCode && !this.state.showReplyInput) {
            this.setState({
                showReplyInput: !this.state.showReplyInput,
            }, () => { this.textarea.focus(); });
        } else if (key != this.state.keyCode && this.state.showReplyInput) {
            this.setState({
                showReplyInput: this.state.showReplyInput,
            }, () => { this.textarea.focus(); });
        };
        this.setState({
            commentToId: uid,
            commentId: id,
            keyCode: key,
            replySendStatus: true
        })
    }
    onTouchSend = () => {
        if (this.state.sendBtnStatus && this.state.replySendStatus) {  //留言
            runPromise("add_comment", {
                type: "circle",               //works=作品；project=需求;news=文章;circle=帖子;
                user_id_to: this.state.commentToId,     //发布文章人的id
                user_id: validate.getCookie('user_id'),                         //评论人的id
                article_id: this.state.commentId,          //文章id
                content: this.state.content   //评论内容
            }, this.addcommentlis, true, "post");
        } else if (this.state.sendBtnStatus && !this.state.replySendStatus) {   //回复
            runPromise("rep_comment", {
                user_id: validate.getCookie('user_id'),     //回复人的id
                comment_id: this.state.comment_id,          //留言id
                content: this.state.content,                //评论内容
                rep_user_id: this.state.rep_user_id,       //被回复人的id
                rep_user_nick_name: this.state.replay_name  //被回复人名称
            }, this.addcommentlis, true, "post");
        }
    }
    render() {
        const separator = (sectionID, rowID) => (   //这个是每个元素之间的间距
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#fff',
                    height: 8,
                }}
            />
        );
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                <div key={rowID}>
                    <div className="items">
                        <div className="itemsTop">
                            <div className="itemsTopPic fn-left">
                                <img src={obj.path_thumb ? obj.path_thumb : loginUrl.selec} alt="" style={{ width: "0.8rem", height: "0.8rem" }} />
                            </div>
                            <div className="itemsTopRight" style={{ marginLeft: "1rem" }}>
                                <p style={{ lineHeight: "0.8rem" }}>
                                    {
                                        obj.action == "publish" ? <span className="fn-right personalMsg">发布了作品</span> :
                                            obj.action == "comment" ? <span className="fn-right personalMsg">评论了您的作品</span> :
                                                obj.action == "guestbook" ? <span className="fn-right personalMsg">给你留言</span> :
                                                    obj.action == "collect" ? <span className="fn-right personalMsg">收藏了你的作品</span> : ""
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="itemPicList">
                            <p>{obj.content}</p>
                            <ul>
                                {
                                    obj.attachment_list ? obj.attachment_list.map((value, idx) => {
                                        return idx < 6 ? <li>
                                            <a href="javascript:;">
                                                {/* <img src={value.path_thumb} alt="" style={{ height: "100%" }} onClick={(index, fs) => this.onTouchImg(index,rowID)} /> */}
                                                <img src={value.path_thumb} alt="" style={{ height: "100%" }} onError={(e) => { e.target.src = defaultAvatar }} />
                                            </a>
                                        </li> : ""
                                    }) : ""
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div className="homeWrap" style={{ ...interpolatingStyle, position: "relative" }}>
                        <div className="lanternLis">
                            <div className="forgetNav" key="1">
                                <NavBar
                                    mode="light"
                                    icon={<Icon type="left" size="lg" color="#707070" />}
                                    onLeftClick={() => hashHistory.goBack()}
                                    className="top"
                                // rightContent={
                                //     <span onClick={(e) => { this.checkNeedMsg() }}>确定</span>
                                // }
                                >我的动态</NavBar>
                            </div>
                        </div>
                        <div className="homeWrapMain" id="hkCircle">
                            <div style={{ height: "1.2rem" }}></div>
                            <ListView
                                key={this.state.useBodyScroll ? '0' : '1'}
                                ref={el => this.lv = el}
                                dataSource={this.state.dataSource}
                                renderFooter={() => (<div style={{ padding: "0 10px", textAlign: 'center', marginBottom: "1.4rem" }}>
                                    {this.state.isLoading ? '加载中...' : '加载完成'}
                                </div>)}
                                style={{
                                    height: this.state.height,
                                    overflow: "auto"
                                }}
                                renderRow={row}
                                renderSeparator={separator}
                                useBodyScroll={this.state.useBodyScroll}
                                pullToRefresh={<PullToRefresh
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                                onEndReached={this.onEndReached}
                                pageSize={5}
                            />
                        </div>

                        <div className="popup-comment-input-box circle-popup-comment-input-box "
                            // style={{ "display": this.state.showReplyInput ? "block" : "none" }}
                            style={{ "visibility": this.state.showReplyInput ? "visible" : "hidden" }}
                        >
                            <TextareaItem
                                id="abc"
                                className="comment-input"
                                autoHeight
                                ref={(temp) => { this.textarea = temp; }}
                                placeholder={this.state.placeholderWords}
                                maxLength="100"
                                value={this.state.content}
                                onChange={this.onChangeReplyInput}
                                onBlur={() => { this.setState({ showReplyInput: false }) }}
                                onFocus={() => { this.setState({ showReplyInput: true }) }}
                            />
                            <span className="send-btn  demand-send-btn" ref="abcd"
                                style={this.state.sendBtnStatus ? {
                                    "border": "1px solid #0e80d2",
                                    "background-color": "#409ad6",
                                    "color": "#fff",
                                } : {}}
                                onTouchStart={this.onTouchSend}
                            >发送</span>
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}