import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Flex } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

const imgUrl = {
    userImg: require("../images/avatar.png")
}

const CommentItem = (props) => (
    <div className="comment-item">
        <div className="user-pic">
            <img src={props.imgUrl} className="user-img"/>
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
            props.images.map((imgUrl) => {
                <div className="imgFrame"><img src={imgUrl}/></div>
            })
        }
        </div>
        
    </div>
)

export default class DesignerComment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            commentKeywords: [],
            commentList: []
        }
    }
    render() {
        return (
            <div className="designerComment">
                <CommentItem imgUrl={imgUrl.userImg} nick_name="D&S-小鹿设计师" score="4" />
            </div>
        )
    }
}

DesignerComment.contextTypes = {
    router: React.PropTypes.object
};