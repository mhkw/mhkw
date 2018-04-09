import React from 'react';
// import ReactDOM from 'react-dom';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Flex, TextareaItem } from 'antd-mobile';
import update from 'immutability-helper';

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
            commentList: [], //评论列表
            comment_total_count: 0, // 评论总数
            replyText:"", //回复留言内容
            showReplyInput: false,
            sendBtnStatus: false , //判断发送按钮是否可点击，以及按钮上的样式变化
            inputStatus: '', //回复的输入框里有两种状态，留言和回复，留言没有默认值，回复有默认值，提示给谁回复，
            comment_id: '', //回复留言的评论id
            rep_user_id: '', //被回复留言的用户id
            rep_user_nick_name: '', //被回复留言的用户昵称
        }
        this.handleSend = (req) => {
            if (req.success) {
                console.log(req);
            } else {
                Toast.fail(req.message, 2);
            }
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
        this.handleAddLove = (res, comment_id) => {
            if (res.success) {

                let { count, nick_name, type, user_id } = res.message;
                let { commentList } = this.state;
                let commentIndex = 0; //选中的大评论的索引
                let loveIndex = 0; // 如果是删除，点赞的索引

                for (let i = 0; i < commentList.length; i++) {
                    const comment = commentList[i];
                    if (comment.id == comment_id) {
                        commentIndex = i;
                        if (comment.love_list instanceof Array) {
                            if (type == "delete") {
                                for (let index = 0; index < comment.love_list.length; index++) {
                                    const love = comment.love_list[index];
                                    if (love.user_id == user_id) {
                                        loveIndex = index;
                                        break;
                                    }
                                }
                            }
                        } else {
                            return;
                        }
                        
                        break;
                    }
                }
                let love_count = parseInt(commentList[commentIndex].love_count);
                if (type == "add") {
                    const newCommentList1 = update(commentList, { [commentIndex]: { love_list: { $push: [res.message] } } });
                    const newCommentList = update(newCommentList1, { [commentIndex]: { love_count: { $set: love_count +1 } } });
                    this.setState({ commentList: newCommentList });
                }
                if (type == "delete") {
                    const newCommentList1 = update(commentList, { [commentIndex]: { love_list: { $splice: [[loveIndex, 1]] } } });
                    const newCommentList = update(newCommentList1, { [commentIndex]: { love_count: { $set: love_count - 1 } } });
                    this.setState({ commentList: newCommentList });
                }
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
    //组件更新
    componentDidUpdate() {
        // console.log("componentDidUpdate");
        // this.refs.commentInput.focus(); //焦点聚集到输入框
    }
    //点击留言
    onTouchComment = (comment_id, rep_user_id, rep_user_nick_name) => {
        // console.log(comment_id);
        // e.target.scrollIntoView(true);
        // let input = ReactDOM.findDOMNode(this.refs.commentInput);
        // let top = input.offsetParent.offsetTop;
        // console.log(e.target.scrollTop)
        // e.target.offsetTop = top - e.target.clientHeight + "px";
        this.setState({ showReplyInput: true, inputStatus: '', comment_id, rep_user_id, rep_user_nick_name },()=>{
            this.refs.commentInput.focus(); //焦点聚集到输入框
        });
    }
    //点击回复
    onTouchReply = (comment_id, rep_user_id, rep_user_nick_name) => {
        // console.log(comment_id);
        // e.target.scrollIntoView(true);
        // let input = ReactDOM.findDOMNode(this.refs.commentInput);
        // let top = input.offsetParent.offsetTop; 
        // console.log(e.target.scrollTop)
        // e.target.offsetTop = top - e.target.clientHeight + "px";
        this.setState({ showReplyInput: true, inputStatus: rep_user_nick_name, comment_id, rep_user_id, rep_user_nick_name },()=>{
            this.refs.commentInput.focus(); //焦点聚集到输入框
        });
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
            //发送ajax,发送留言或回复
            this.ajaxRepComment();  
            this.setState({ replyText: '' });   
        }
    }
    //ajax发送留言或回复
    ajaxRepComment = () => {
        let { comment_id, rep_user_id, rep_user_nick_name, replyText: content  } = this.state;
        runPromise("rep_comment", {
            user_id: validate.getCookie('user_id'),     //回复人的id
            comment_id,          //留言id
            content,            //评论内容
            rep_user_id,       //被回复人的id
            rep_user_nick_name,  //被回复人名称
        }, this.handleRepComment);
    }
    onTouchImg = (index, dishPic) => {
        // console.log(dishPic);
        let items = [];
        dishPic.map((value)=>{
            let item = {};
            item.src = value.path;
            item.w = parseInt(value.width) || 540;
            item.h = parseInt(value.height) || 390;
            items.push(item);
        })
        openPhotoSwipe(items, index)
    }
    ajaxGetCommentList = ( per_page = 10, page = 1 ) => {
        let article_id = this.props.designer ? (this.props.designer.id ? this.props.designer.id : 0 ) : 0;
        runPromise('get_comment_list', {
            type: 'user',
            article_id,
            param1: 0,
            param2: 0,
            per_page,
            page,
        }, this.handleGetCommentList, false, 'get');
    }
    componentWillMount() {   
        if (this.props.location.query && this.props.location.query.form == "commentDetails") {
            let { selectedComment } = this.props;
            if (selectedComment && selectedComment.id) {
                let newCommentList = [];
                newCommentList.push(selectedComment);
                this.setState({ commentList: newCommentList});
            }
        }
    }
    componentDidMount() {
        if (this.props.location.query && this.props.location.query.form != "commentDetails") {
            this.ajaxGetCommentList();
        }
    }
    //点赞
    AddLove = (id, likeElement) => {
        this.ajaxAddLove(id);
    }
    ajaxAddLove = (id) => {
        runPromise("add_love", {
            id,
            user_id: validate.getCookie('user_id'),
            model: "user_comment",
            // model: "user",
        }, this.handleAddLove, true, 'post', id);
    }
    clickMoreComment = (comment_id) => {
        // console.log("点击更多", comment_id);
        for (const comment of this.state.commentList) {
            if (comment.id == comment_id) {
                this.props.updateSelectedComment(comment);
                break;
            }
        }
        if (this.props.location.query && this.props.location.query.form != "commentDetails") {
            hashHistory.push({
                pathname: '/commentDetails',
                query: { form: 'commentDetails' },
            });   
        } else {
            
        }
    }
    render() {
        return (
            <div className="designerComment">
                {/* <CommentItem
                    avatarImg={imgUrl.userImg} 
                    nick_name="D&S-小鹿设计师" 
                    score="4" 
                    dishPic={imgUrl.dishPic} 
                    time={"11月08日"} 
                    index="1"
                    onActive={this.onTouchReply}
                    TouchImg={this.onTouchImg}
                /> */}
                {
                    this.props.location.query && this.props.location.query.form == "commentDetails" ? (
                        <NavBar
                            className="NewNavBar"
                            mode="light"
                            icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                            onLeftClick={() => hashHistory.goBack()}
                        >评论详情</NavBar>
                    ) : null
                }

                {
                    this.state.commentList &&
                    this.state.commentList.map((value, index)=>(
                        <CommentItem
                            key={value.id}
                            id={value.id}
                            user_id_from={value.user_id_from}
                            avatarImg={value.path_thumb}
                            nick_name={value.nick_name}
                            score={value.appraise_score}
                            content={value.content}
                            // dishPic={imgUrl.dishPic}
                            dishPic={value.attachment_list}
                            time={value.add_time_format}
                            islove={value.islove}
                            love_count={value.love_count}
                            love_list={value.love_list}
                            commentrep_data={value.commentrep_data}
                            // index={value.index}
                            TouchImg={this.onTouchImg}
                            AddLove={this.AddLove}
                            onTouchComment={this.onTouchComment}
                            onTouchReply={this.onTouchReply}
                            clickMoreComment={this.clickMoreComment}
                        />
                    ))
                }
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
                        placeholder={this.state.inputStatus ? `回复${this.state.inputStatus}:` : ""}
                        maxLength="100"
                        value={this.state.replyText}
                        onChange={this.onChangeReplyInput}
                        onBlur={this.onBlurReplyInput}
                        // clear
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