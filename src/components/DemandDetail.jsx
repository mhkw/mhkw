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
            demandDetail:JSON.parse(sessionStorage.getItem("resdata")) ? JSON.parse(sessionStorage.getItem("resdata")) : {distance:"0.00"},
            files: [],
            showReplyInput:false
        };
        this.handleLoginSend = (res) => {
            console.log(res);
            if (res.success) {
                this.setState({ demandDetail: res.data, files: res.data.attachment_list })
                sessionStorage.setItem("demandDetail", JSON.stringify(res.data));
            }
        };
        this.addheartlis = (res, para) => {   //点赞
            console.log(para.e.target.nextSibling);
            console.log(para.e);
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
    }
    componentDidMount() {
        this.getProgectList(this.props.location.query.demandId);
    }
    getProgectList(id) {
        axios({
            method: "POST",
            url: 'https://www.huakewang.com/hkw_newapi/get_project_info/' + 2 + '/0/0',
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
                console.log(error.message);
            });
    }
    onTouchImg = (index) => {
        console.log(index);
        let items = [];
        this.state.files.map((value) => {
            // if (this.state.files.length > 0) {
            //     var img = new Image();
            //     var item = {};
            // }
            // img.src = value.path_thumb;
            // img.onload = function (argument) {
            //     item.w = this.width;
            //     item.h = this.height;
            // }
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
    toggleInput = (key, uid, id) => {
        this.setState({ 
            showReplyInput: true, 
            // commentToId: uid, 
            // commentId: id, 
            // keyCode: key, 
            replySendStatus: true 
        }, () => { this.textarea.focus(); })
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
                            {((obj.distance - 0) / 1000).toFixed(2) > 200 || ((obj.distance - 0) / 1000).toFixed(2) == 0 ? "[未知]" : ((obj.distance - 0) / 1000).toFixed(2) + 'km'}
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
                                    return <li style={{ float: "left", margin: "3px" }} onClick={() => { this.onTouchImg(index) }}>
                                        <img src={value.path_thumb} style={{ width: "2.8rem", height: "2.8rem" }} />
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                    <div style={{ float: "left", paddingTop: "4px", color: "#949494" }}>
                        <i className="iconfont icon-shijian2"></i>&nbsp;{obj.add_time_format}&nbsp;&nbsp;&nbsp;
                        <i className="iconfont icon-yanjing" style={{ color: "#ccc" }}></i>&nbsp;{obj.hits}
                    </div>
                    <div style={{ float: "right" ,color:"#949494"}}>
                        <div style={{ display: "inline-block", paddingTop: "4px" }}>
                            <i className="iconfont icon-Pingjia" onClick={(e) => { this.addHeart(e, obj.id); }}
                                style = {{
                                    fontSize: "14px",
                                    verticalAlign: "middle",
                                    color: obj.islove ? "#F95231" : "",
                                    position: "relative",
                                    top: "1px"
                                }}
                            ></i><span style={{marginLeft:"3px"}}>{obj.love_count}</span>&nbsp;&nbsp;&nbsp;
                        </div>
                        <div style={{display: "inline-block",paddingTop: "4px"}}
                            onClick={(e) => {
                                this.toggleInput();
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
                    <div className="popup-comment-input-box demand-popup-comment-input-box"
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
                        <span className="send-btn" ref="abcd"
                            style={this.state.sendBtnStatus ? {
                                "border": "1px solid #0e80d2",
                                "background-color": "#409ad6",
                                "color": "#fff",
                            } : {}}
                            onTouchStart={this.onTouchSend}
                        >发送</span>
                    </div>
                    <PhotoSwipeItem />
                </div>
            </QueueAnim>
        );
    }
}





