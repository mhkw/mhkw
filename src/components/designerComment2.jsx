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

export default class DesignerComment2 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            location_form: 'designerHome',//判断当前页面是哪个页面，这参数名称有误.不是表示来自哪个页面.
            get_comment_list_page: 1, //获取评论列表是第几页，默认是第一页
            get_comment_list_per_page: 5, //获取评论每页列表有多少行数据
            isShowMoreButtom: false, //是否显示更多评论的按钮，这个按钮可以进入评论列表页，也可以获取更多的评论
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
            rep_comment_list_page: 1, //回复留言列表是第几页，默认是第一页
            rep_comment_per_page: 10, //回复留言每页列表有多少行数据
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
                let { get_comment_list_page, get_comment_list_per_page, isShowMoreButtom } = this.state;
                if (get_comment_list_page * get_comment_list_per_page < res.data.comment_total_count ) {
                    get_comment_list_page ++;
                    isShowMoreButtom = true;
                } else {
                    isShowMoreButtom = false;
                }
                let newCommentList1 = this.state.commentList;
                // newCommentList = [...newCommentList, ...res.data.item_list];
                // newCommentList.push(res.data.item_list);
                const newCommentList = update(newCommentList1, { $push: res.data.item_list });
                this.setState({
                    commentList: newCommentList,
                    comment_total_count: res.data.comment_total_count,
                    get_comment_list_page,
                    isShowMoreButtom
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
                let { comment_id, rep_user_id : user_id_to, rep_user_nick_name: nick_name_to, replyText: content, commentList  } = this.state;
                let nick_name;
                let user_id;
                if (this.props.designer) {
                    nick_name = this.props.designer.nick_name;
                    user_id = this.props.designer.id;
                }
                // console.log(res);

                //新构建的的一个回复留言的对象
                let newCommentrep = {
                    comment_id,
                    content,
                    nick_name,
                    nick_name_to,
                    user_id,
                    user_id_to,
                }; 

                let commentIndex = 0; //选中的大评论的索引

                for (let i = 0; i < commentList.length; i++) {
                    const comment = commentList[i];
                    if (comment.id == comment_id) {
                        commentIndex = i;
                        break;
                    }
                }
                let commentrep_list_length = commentList[commentIndex].commentrep_data.commentrep_list.length;
                let new_commentrep_list_page = 0;
                if (commentrep_list_length >= 3) {
                    new_commentrep_list_page = 1;
                }
                const newCommentList1 = update(commentList, { [commentIndex]: { commentrep_data: { commentrep_list: { $push: [newCommentrep] } }} });
                const newCommentList = update(newCommentList1, { [commentIndex]: { commentrep_data: { is_next_page: { $set: new_commentrep_list_page } }} });
                this.setState({ commentList: newCommentList, replyText: '' });

            } else {
                Toast.fail(res.message, 1);
            }
        }
        //该函数只能在评论详情页使用
        this.handleGetRepCommentList = (res, comment_id) => {
            if (res.success) {
                let { commentList, rep_comment_list_page, rep_comment_per_page } = this.state;
                let newCommentrep = res.data.item_list;
                let new_commentrep_list_page = 0;
                if (rep_comment_list_page * rep_comment_per_page < res.data.commentrep_total_count) {
                    new_commentrep_list_page = 1;
                }
                let new_rep_comment_list_page = parseInt(rep_comment_list_page);
                if (new_commentrep_list_page > 0) {
                    new_rep_comment_list_page ++;
                }
                let commentIndex = 0; //选中的大评论的索引

                for (let i = 0; i < commentList.length; i++) {
                    const comment = commentList[i];
                    if (comment.id == comment_id) {
                        commentIndex = i;
                        break;
                    }
                }

                //判断rep_comment_list_page是不是第1页，一页要清空原comment_list，其他的是push
                if (rep_comment_list_page == 1) {
                    const newCommentList1 = update(commentList, { [commentIndex]: { commentrep_data: { commentrep_list: { $set: newCommentrep } } } });
                    const newCommentList = update(newCommentList1, { [commentIndex]: { commentrep_data: { is_next_page: { $set: new_commentrep_list_page } } } });
                    this.setState({ commentList: newCommentList, rep_comment_list_page: new_rep_comment_list_page });
                } else {
                    const newCommentList1 = update(commentList, { [commentIndex]: { commentrep_data: { commentrep_list: { $push: newCommentrep } } } });
                    const newCommentList = update(newCommentList1, { [commentIndex]: { commentrep_data: { is_next_page: { $set: new_commentrep_list_page } } } });
                    this.setState({ commentList: newCommentList, rep_comment_list_page: new_rep_comment_list_page });
                }
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
            // this.setState({ replyText: '' });   
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
    ajaxGetCommentList = ( per_page = 5, page = 1 ) => {
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
        // console.log("designerComment componentWillMount")
        // console.log(this.props.location.query.form);
        if (this.props.location.query && this.props.location.query.form) {
            this.setState({ location_form: this.props.location.query.form });
        }
        if (this.props.location.query && this.props.location.query.form == "commentDetails") {
            let { selectedComment } = this.props;
            if (selectedComment && selectedComment.id) {
                let newCommentList = [];
                newCommentList.push(selectedComment);
                this.setState({ 
                    commentList: newCommentList
                });
            }
        }
    }
    componentDidMount() {
        if (this.state.location_form != "commentDetails") {
            this.ajaxGetCommentList();
        }
        if (this.state.location_form == "commentDetails") {
            this.getRepCommentList();
        }
    }
    //获取更多聊天列表,该函数只能在评论详情页使用
    getRepCommentList = () => {
        let { selectedComment } = this.props;
        if (selectedComment && selectedComment.id) {
            this.ajaxGetRepCommentList(selectedComment.id, this.state.rep_comment_list_page, this.state.rep_comment_per_page);
        }
    }
    ajaxGetRepCommentList = (id, page = 1, per_page = 10 ) => {
        runPromise("get_rep_comment_list", {
            id,
            param1: 0,
            param2: 0,
            per_page,
            page,
        }, this.handleGetRepCommentList, false, 'get', id);
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
    //点击更多留言
    clickMoreComment = (comment_id) => {
        // console.log("点击更多", comment_id, this.state.location_form);
        for (const comment of this.state.commentList) {
            if (comment.id == comment_id) {
                this.props.updateSelectedComment(comment);
                break;
            }
        }
        if (this.state.location_form != "commentDetails") {
            hashHistory.push({
                // pathname: '/',
                pathname: '/commentDetails',
                query: { form: 'commentDetails' },
            });   
        } else {
            this.getRepCommentList();
        }
    }
    clickNextMoreClick = () => {
        if (this.state.location_form == "designerHome") {
            hashHistory.push({
                pathname: '/commentlist',
                query: { form: 'commentlist' },
            });
        }
        if (this.state.location_form == "commentlist") {
            //加载下一页
            this.ajaxGetCommentList(this.state.get_comment_list_per_page, this.state.get_comment_list_page);
        }
    }
    render() {
        //设计师主页的更多评论按钮有关，点击进入评论列表页，查看所有评论
        let oldBackgroundColor = "#fff";
        const touchStart = (e) => {
            oldBackgroundColor = e.target.style.backgroundColor;
            e.target.style.backgroundColor = "#eee";
        }
        const touchEnd = (e) => {
            e.target.style.backgroundColor = oldBackgroundColor;
        }
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
                    this.state.location_form == "commentDetails" ? (
                        <NavBar
                            className="NewNavBar"
                            mode="light"
                            icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                            onLeftClick={() => hashHistory.goBack()}
                        >评论详情</NavBar>
                    ) : null
                }
                {
                    this.state.location_form == "commentlist" ? (
                        <NavBar
                            className="NewNavBar"
                            mode="light"
                            icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                            onLeftClick={() => hashHistory.goBack()}
                        >评论列表</NavBar>
                    ) : null
                }
                {
                    this.state.commentList.length > 0 &&
                    this.state.commentList.map((value, index)=>(
                        // console.log(value)
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
                            remark={value.remark}
                        />
                        ))
        }
                <div className="popup-comment-input-box-stone"
                    style={{
                        "height": this.state.location_form == "commentDetails" ? "45px" : "0px"
                    }}
                ></div>
                <div
                    className="view-more designer-comment"
                    style={{ "display": this.state.isShowMoreButtom ? "block" : "none" }}
                    onTouchStart={touchStart}
                    onTouchEnd={touchEnd}
                    onClick={this.clickNextMoreClick}
                >查看更多</div>
                <div className="popup-comment-input-box"
                    // style={{ "display": this.state.showReplyInput ? "block" : "none" }}
                    style={{ 
                        "visibility": this.state.showReplyInput ? "visible" : "hidden",
                        "bottom": this.state.location_form == "designerHome" ? "45px" : "0px"
                    }}
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

DesignerComment2.contextTypes = {
    router: React.PropTypes.object
};