import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Button, TextareaItem, ImagePicker, InputItem } from 'antd-mobile';

import PhotoSwipeItem from './photoSwipeElement.jsx';
import CommentItem from './CommentItem.jsx';

import '../js/photoswipe/photoswipe.css';
import '../js/photoswipe/default-skin/default-skin.css';
import PhotoSwipe from '../js/photoswipe/photoswipe.min.js';
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

export default class CommentDetails extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            commentKeywords: [],
            commentList: [], //评论列表
            comment_total_count: 0, // 评论总数
            replyText: "", //回复留言内容
            showReplyInput: false,
            sendBtnStatus: false, //判断发送按钮是否可点击，以及按钮上的样式变化
            inputStatus: '', //回复的输入框里有两种状态，留言和回复，留言没有默认值，回复有默认值，提示给谁回复，
            comment_id: '', //回复留言的评论id
            rep_user_id: '', //被回复留言的用户id
            rep_user_nick_name: '', //被回复留言的用户昵称
        }
        this.handleGetCommentList = (res) => {
            if (res.success) {
                // console.log(res);
                this.setState({
                    commentList: res.data.item_list,
                    comment_total_count: res.data.comment_total_count,
                })
            } else {
                // Toast.fail(res.message, 1);
            }
        }
        this.handleAddLove = (res) => {
            if (res.success) {
                console.log(res);
                this.ajaxGetCommentList();
            } else {
                Toast.fail(res.message, 1);
            }
        }
        this.handleRepComment = (res) => {
            if (res.success) {
                console.log(res);
                this.ajaxGetCommentList();
            } else {
                Toast.fail(res.message, 1);
            }
        }
    }
    componentWillMount() {
        let { selectedComment } = this.props;
        if (selectedComment && selectedComment.id) {
            
        }
    }
    render() {
        return (
            <div key="1" className="comment-details">
                <NavBar
                    className="NewNavBar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                >评论详情</NavBar>

            </div>
        )
    }
}