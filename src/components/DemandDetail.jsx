import React from 'react'
import { List, InputItem, PullToRefresh, ListView, Toast, Button, NavBar, Icon, TextareaItem } from 'antd-mobile';
import { Link, hashHistory } from 'react-router';
import axios from 'axios';
import QueueAnim from 'rc-queue-anim';

import '../css/font/iconfont.css'

import PhotoSwipeItem from './photoSwipeElement.jsx';
import '../js/photoswipe/photoswipe.css';
import '../js/photoswipe/default-skin/default-skin.css';
import PhotoSwipe from '../js/photoswipe/photoswipe.min.js';
import PhotoSwipeUI_Default from '../js/photoswipe/photoswipe-ui-default.min.js';

const loginUrl = {
    "selec": require('../images/selec.png'),
}
let openPhotoSwipe = function (items, index) {
    let pswpElement = document.querySelectorAll('.pswp')[0];
    let options = {
        index: index,
        showAnimationDuration: 100,
        hideAnimationDuration: 100
    }
    let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
}
export default class DemandDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            demandDetail: JSON.parse(sessionStorage.getItem("demandDetail")) ? JSON.parse(sessionStorage.getItem("demandDetail")) : { distance: "0.00" },
            files: [],
            showReplyInput: false,
            commentToId: "",
            commentId: "",
            replySendStatus: "",
            sendBtnStatus: false,
            content: "",
            placeholderWords:"",
            comment_id:"",
            rep_user_id:"",
            replay_name:""
        };
        this.handleLoginSend = (res) => {
            if (res.success) {
                this.setState({ demandDetail: res.data, files: res.data.attachment_list })
                sessionStorage.setItem("demandDetail", JSON.stringify(res.data));
            }
        };
        this.addheartlis = (res, para) => {   //点赞
            if (res.success) {
                let numStar = para.e.target.parentNode.children[1].innerText;
                if (res.message.type == 'delete') {
                    para.e.target.style.color = "#333";
                    para.e.target.nextSibling.innerHTML = numStar - 1;
                } else if (res.message.type == 'add') {
                    para.e.target.style.color = "#F95231";
                    para.e.target.nextSibling.innerHTML = numStar - 0 + 1;
                }
            }
        };
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
                    let currentLi = document.getElementById("demandCommentList");
                    currentLi.appendChild(wrap);
                } else {                           //留言
                    innerSpan.innerHTML = req.data.nick_name;
                    innerI.innerHTML = req.data.comment_content;
                    domLi.appendChild(innerSpan);
                    domLi.appendChild(innerI);
                    wrap.appendChild(domLi);
                    let currentLi = document.getElementById("demandCommentList");
                    currentLi.appendChild(wrap);
                }
            }
        }
    }
    componentDidMount() {
        this.getProgectList(this.props.location.query.demandId);
    }
    getProgectList(id) {
        axios({
            method: "POST",
            url: 'https://www.huakewang.com/hkw_newapi/get_project_info/' + id + '/0/0',
            data: {
                id: this.props.params.id,
                user_id: validate.getCookie('user_id')
            }
        })
            .then((res) => {
                this.handleLoginSend(res.data);
            })
            .catch((error) => {
                console.log(error.data);
            });
    }
    onTouchImg = (index) => {
        let items = [];
        this.state.files.map((value) => {
            let item = {};
            item.w = value.width > 0 ? value.width : 250;
            item.h = value.height > 0 ? value.height : 250;
            item.src = value.path_thumb;
            items.push(item);
        })
        openPhotoSwipe(items, index);
    }
    addHeart = (e, toId) => {    //点赞
        e.persist();
        runPromise("add_love", {
            id: toId,
            user_id: validate.getCookie('user_id'),
            model: "project"
        }, this.addheartlis, true, "post", { e: e });
    }
    toggleInput = (uid, id) => {
        this.setState({
            showReplyInput: true,
            commentToId: uid,
            commentId: id,
            replySendStatus: true
        }, () => { this.textarea.focus(); })
    }
    onTouchSend = () => {
        if (this.state.sendBtnStatus && this.state.replySendStatus) {  //留言
            runPromise("add_comment", {
                type: "project",               //works=作品；project=需求;news=文章;circle=帖子;
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
    render() {
        let obj = this.state.demandDetail;
        let files = this.state.files;
        return (
            <QueueAnim
                animConfig={[
                    { opacity: [1, 0], translateX: [0, 0] }
                ]}>
                <div className="forgetNav" key="1">
                    <NavBar
                        mode="light"
                        icon={<Icon type="left" size="lg" color="#707070" />}
                        onLeftClick={() => hashHistory.goBack()}
                    // rightContent={[
                    //     <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
                    //     <i key="1" type="ellipsis" className="iconfont icon-shijian2" />,
                    // ]}
                    >需求详细</NavBar>
                </div>
                <div style={{ height: "1.2rem" }}></div>
                <div className="mainWrap" style={{ padding: "20px" }}>
                    <p>
                        找：
                        <span className="fn-right" style={{ color: "#949494", fontSize: "12px" }}>
                            <i className="iconfont icon-location"></i>
                            {((obj.distance - 0) / 1000).toFixed(2) > 200 || ((obj.distance - 0) / 1000).toFixed(2) == 0 ? 
                                obj.long_lat_address == ""?
                                "[未知]" : obj.long_lat_address.split(" ").length > 1 ? 
                                obj.long_lat_address.split(" ").slice(1).join(" ") : obj.long_lat_address : ((obj.distance - 0) / 1000).toFixed(2) + 'km'}
                        </span>
                    </p>
                    <div style={{ padding: "10px 0 10px 0", lineHeight: "18px" }}>
                        <i style={{ color: "red" }}>预算：{obj.budget_price}</i>&nbsp;&nbsp;
                        {obj.content}
                    </div>
                    <div className="imgWrap">
                        <ul style={{ overflow: "hidden" }}>
                            {
                                files.map((value, index) => {
                                    return <li style={{ float: "left", margin: "4px 7px" }} onClick={() => { this.onTouchImg(index) }}>
                                        <img src={value.path_thumb} style={{ width: "2.6rem", height: "2.6rem" }} />
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                    <div style={{ float: "left", paddingTop: "4px", color: "#949494" }}>
                        <i className="iconfont icon-shijian2"></i>&nbsp;{obj.add_time_format}&nbsp;&nbsp;&nbsp;
                        <i className="iconfont icon-yanjing" style={{ color: "#ccc" }}></i>&nbsp;{obj.hits}
                    </div>
                    <div style={{ overflow: "hidden" }}>
                        <div style={{ float: "right", color: "#949494" }}>
                            <div style={{ display: "inline-block", paddingTop: "4px" }}>
                                <i className="iconfont icon-Pingjia" onClick={(e) => { this.addHeart(e, obj.id); }}
                                    style={{
                                        fontSize: "14px",
                                        verticalAlign: "middle",
                                        color: obj.islove ? "#F95231" : "",
                                        position: "relative",
                                        top: "1px"
                                    }}
                                ></i><span style={{ marginLeft: "3px" }}>{obj.love_count}</span>&nbsp;&nbsp;&nbsp;
                            </div>
                            <div style={{ display: "inline-block", paddingTop: "4px" }}
                                onClick={(e) => {
                                    this.toggleInput(obj.user_id, obj.id);
                                    this.setState({ placeholderWords: "给" + obj.user_info.nick_name + "留言：" })
                                }}>
                                <i className="iconfont icon-liuyan"
                                    style={{
                                        fontSize: "14px",
                                        verticalAlign: "middle",
                                        position: "relative",
                                        top: "1px"
                                    }}
                                ></i> <span>{obj.comment_count}</span>
                            </div>
                        </div>
                    </div>
                    <div className="itemsBtm">
                        {/* <div className="loveList" style={{ backgroundColor: "#f0f0f0", lineHeight: "0.75rem", display: obj.love_list.length > 0 ? "block" : "none" }}>
                            <i className="iconfont icon-Pingjia" style={{ position: "relative", top: "2px", margin: "0 5px" }}></i>
                            <ul style={{ display: "inline-block" }}>
                                {
                                    obj.love_list.map((value, idx) => {
                                        return <li onClick={() => {
                                            hashHistory.push({
                                                pathname: '/designerHome',
                                                query: { userId: value.user_id }
                                            })
                                        }} style={{ float: "left", color: "#1199d2" }}>
                                            {value.nick_name},
                                            </li>
                                    })
                                } 觉得很赞
                            </ul>
                        </div> */}
                        <div className="commentList" style={{
                            marginTop: "8px", display: obj.comment_data.comment_list.length > 0 ? "block" : "none"
                        }}>
                            <ul id="demandCommentList">
                                {
                                    obj.comment_data.comment_list.map((value, idx) => {
                                        return <div>
                                            <li onClick={() => {
                                                this.setState({
                                                    placeholderWords: "回复：" + value.nick_name,
                                                    showReplyInput: true,
                                                    replySendStatus: false,
                                                    comment_id: value.id,
                                                    rep_user_id: value.user_id_from,
                                                    replay_name: value.nick_name
                                                }, () => {
                                                    this.textarea.focus();
                                                })
                                            }}>
                                                <span >{value.nick_name}: </span>
                                                {value.content ? value.content : value.comment_content}
                                            </li>
                                            {
                                                value.commentrep_data && value.commentrep_data.commentrep_list.length > 0 ?
                                                    value.commentrep_data.commentrep_list.map((val) => {
                                                        return val.content ? <li onClick={() => {
                                                            this.setState({
                                                                placeholderWords: "回复：" + val.nick_name,
                                                                showReplyInput: true,
                                                                replySendStatus: false,
                                                                comment_id: val.comment_id,
                                                                rep_user_id: val.user_id,
                                                                replay_name: val.nick_name
                                                            }, () => {
                                                                this.textarea.focus();
                                                            })
                                                        }}>
                                                            {
                                                                val.nick_name_to ? <span>{val.nick_name}回复:{val.nick_name_to} </span> :
                                                                    <span>{val.nick_name}: </span>
                                                            }
                                                            {val.content ? val.content : val.comment_content}
                                                        </li> : ""
                                                    }) : ""
                                            }
                                        </div>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="popup-comment-input-box demand-popup-comment-input-box"
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
                    <span className="send-btn demand-send-btn" ref="abcd"
                        style={this.state.sendBtnStatus ? {
                            "border": "1px solid #0e80d2",
                            "background-color": "#409ad6",
                            "color": "#fff",
                        } : {}}
                        onTouchStart={this.onTouchSend}
                    >发送</span>
                </div>
                <PhotoSwipeItem />
            </QueueAnim>
        );
    }
}





