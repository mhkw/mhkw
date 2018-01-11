import React from 'react';
// import ReactDOM from 'react-dom';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Flex, TextareaItem } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

const imgUrl = {
    userImg: require("../images/avatar.png"),
    dishPic: [require("../images/banner01.jpg"), require("../images/banner02.jpg"), require("../images/banner03.jpg"), require("../images/avatar.png"), require("../images/homePic.png")]
}

const CommentItem = (props) => (
    <div className="comment-item">
        <div className="user-pic">
            <img src={props.avatarImg} className="user-img"/>
        </div>
        <div className="comment-top">
            <div className="user-name">{props.nick_name}</div>
            <div className="info">
                <span className="scoreTitle">评分</span>
                <i className={ props.score > 0 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                <i className={ props.score > 1 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                <i className={ props.score > 2 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                <i className={ props.score > 3 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                <i className={ props.score > 4 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
            </div>
        </div>
        <div className="context">
            <p className="text">更新一组影吧风格，吉茶屋  用原创个性字体进行组合设计。更新一组影吧风格，吉茶屋  用原创个性字体进行组合设计。</p>
            <span className="get-all">更多</span>
        </div>
        <div className="dishPic">
        {
            props.dishPic.map((imgUrl) => (
                <div className="imgFrame"><img src={imgUrl}/></div>
            ))
        }
        </div>
        <div className="bottom-box">
            <span className="time">{props.time}</span>
            <div className="comment-icon">
                <span className="box-collect">
                    <i className="iconfont icon-xin-1"></i>
                    <span className="number">1</span>
                </span>
                <span className="dashed-arrow"></span>
                <span className="box-comment">
                    <i className="iconfont icon-icon-talk"></i>
                    <span className="number">0</span>
                </span>
            </div>
        </div>
        <div className="comment-like-box clearfix">
            <i className="iconfont icon-xin-1"></i>
            <ul className="like-user">
                <li>hkw151541,</li>
                <li>晓风残月,</li>
                <li>晓风残月,</li>
                <li>晓风残月,</li>
                <li>晓风残月,</li>
                <li>晓风残月,</li>
                <li>晓风残月,</li>
                <li>方少言</li>
            </ul>
            <span className="txt">觉得很赞</span>
        </div>
        <div className="comment-reply-box">
            <div className="reply-line"
                onClick={(e) => { props.onActive(props.index, e)}}
            >
                <span className="origin">方少言:</span>
                <p className="txt">无敌赞</p>
            </div>
            <div className="reply-line" 
                onClick={(e) => { props.onActive(props.index, e) }}
            >
                <span className="origin">方少言 回复 晓风残月:</span>
                <p className="txt">芭芭拉啦啦把芭芭拉啦啦666666啦啦啦啦啦8888888</p>
            </div>
        </div>
    </div>
)

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
    }
    componentDidUpdate() {
        console.log("componentDidUpdate")
        this.refs.commentInput.focus(); //焦点聚集到输入框
    }
    onTouchReply = (index, e) => {
        console.log(index);
        // e.target.scrollIntoView(true);
        let input = ReactDOM.findDOMNode(this.refs.commentInput);
        let top = input.offsetParent.offsetTop; 
        // console.log(e.target.scrollTop)
        // e.target.offsetTop = top - e.target.clientHeight + "px";
        this.setState({ showReplyInput: true });
    }
    onChangeReplyInput = (val) => {
        this.setState({ replyText: val });
        this.setState({
            sendBtnStatus: !!val.length 
        });
    }
    onBlurReplyInput = (e) => {
        // this.setState({ showReplyInput: false }); 
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
                />
                <CommentItem
                    avatarImg={imgUrl.userImg}
                    nick_name="D&S-小鹿设计师"
                    score="4"
                    dishPic={imgUrl.dishPic}
                    time={"11月08日"}
                    index="2"
                    onActive={this.onTouchReply}
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
                    >发送</span>
                </div>
            </div>
        )
    }
}

DesignerComment.contextTypes = {
    router: React.PropTypes.object
};