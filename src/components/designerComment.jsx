import React from 'react';
// import ReactDOM from 'react-dom';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Flex, TextareaItem } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';


import PhotoSwipeItem from './photoSwipeElement.jsx';
import CommentItem from './CommentItem.jsx';

import '../js/photoswipe/photoswipe.css';
import '../js/photoswipe/default-skin/default-skin.css';
import PhotoSwipe  from '../js/photoswipe/photoswipe.min.js';
import PhotoSwipeUI_Default from '../js/photoswipe/photoswipe-ui-default.min.js';

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

const imgUrl = {
    userImg: require("../images/avatar.png"),
    dishPic: [require("../images/banner01.jpg"), require("../images/banner02.jpg"), require("../images/banner03.jpg"), require("../images/avatar.png"), require("../images/homePic.png")]
}

export default class DesignerComment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            commentKeywords: [],
            commentList: [],
            replyText:"",
            showReplyInput: false,
            sendBtnStatus: false , //判断发送按钮是否可点击，以及按钮上的样式变化
        }
        this.handleSend = (req) => {
            if (req.success) {
                console.log(req);
            } else {
                Toast.fail(req.message, 2);
            }
        }
    }
    //组件更新
    componentDidUpdate() {
        console.log("componentDidUpdate");
        this.refs.commentInput.focus(); //焦点聚集到输入框
    }
    //点击回复
    onTouchReply = (index, e) => {
        console.log(index);
        // e.target.scrollIntoView(true);
        let input = ReactDOM.findDOMNode(this.refs.commentInput);
        let top = input.offsetParent.offsetTop; 
        // console.log(e.target.scrollTop)
        // e.target.offsetTop = top - e.target.clientHeight + "px";
        this.setState({ showReplyInput: true });
    }
    //回复输入框里的内容变化
    onChangeReplyInput = (val) => {
        this.setState({ replyText: val });
        this.setState({
            sendBtnStatus: !!val.length 
        });
    }
    //回复输入框失去焦点
    onBlurReplyInput = (e) => {
        this.setState({ showReplyInput: false }); 
    }
    //点击发送按钮
    onTouchSend= () => {
        if (this.state.sendBtnStatus) {
            //设计师页
            var sort = "add_time", kind = "all", keywords = "all", lng = 0, lat = 0, num = 9, n = 1, totalPage, flag = true;
            //发送ajax,测试，搜索
            runPromise("search", {
                keycode: "1",
                longitude: "0",
                latitude: "0",
            }, this.handleSend);   
            //发送ajax,测试，获取金额
            runPromise("get_blance", {
                keycode: "1",
                longitude: "0",
                latitude: true,
            }, this.handleSend, false, "get");       
        }
    }
    onTouchImg = (index, dishPic) => {
        // console.log(dishPic);
        let items = [];
        dishPic.map((value)=>{
            let item = {};
            item.src = value;
            item.w = 1242;
            item.h = 298;
            items.push(item);
        })
        openPhotoSwipe(items, index)
    }
    render() {
        return (
            <div className="designerComment">
                <CommentItem
                    avatarImg={imgUrl.userImg} 
                    nick_name="D&S-小鹿设计师" 
                    score="4" 
                    dishPic={imgUrl.dishPic} 
                    time={"11月08日"} 
                    index="1"
                    onActive={this.onTouchReply}
                    TouchImg={this.onTouchImg}
                />
                <CommentItem
                    avatarImg={imgUrl.userImg}
                    nick_name="D&S-小鹿设计师"
                    score="4"
                    dishPic={imgUrl.dishPic}
                    time={"11月08日"}
                    index="2"
                    onActive={this.onTouchReply}
                    TouchImg={this.onTouchImg}
                />
                <div className="popup-comment-input-box"
                    // style={{ "display": this.state.showReplyInput ? "block" : "none" }}
                    style={{ "visibility": this.state.showReplyInput ? "visible" : "hidden"}}
                >
                    <TextareaItem
                        id="abc"
                        ref="commentInput"
                        className="comment-input"
                        autoHeight
                        autoFocus
                        placeholder="回复方少言:"
                        maxLength="100"
                        value={this.state.replyText}
                        onChange={this.onChangeReplyInput}
                        onBlur={this.onBlurReplyInput}
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
                <PhotoSwipeItem/>
            </div>
        )
    }
}

DesignerComment.contextTypes = {
    router: React.PropTypes.object
};