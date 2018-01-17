import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Button, TextareaItem } from 'antd-mobile';

export default class WriterComment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            navBarTitle: "品牌设计师 Miazhang",
            score: 5,
            commentText: "",
            commentLackCount: 30, //输入框还差多少个字
            scoreTextArray: ["", "差！","较差！","一般！","良！","好！"], //评论的汉字
        }
    }
    onClickPublish = () => {
        
    }
    render() {
        return (
            <div key="1" className="writer-comment">
                <NavBar
                    className="NewNavBar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                    rightContent={<Button className="publishButton" onClick={this.onClickPublish}>发表</Button>}
                >{this.state.navBarTitle}</NavBar>
                <div className="textarea-box">
                    <div className="score-box">
                        <span className="left">总体</span>
                        {/* <i className={props.score > 0 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                        <i className={props.score > 1 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                        <i className={props.score > 2 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                        <i className={props.score > 3 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                        <i className={props.score > 4 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} /> */}
                        <span className="right">总体</span>
                    </div>
                    <TextareaItem
                        placeholder="您的评价对其他会员都是很重要的参考"
                        rows="9"
                        value={this.state.commentText}
                        onChange={(val) => { this.setState({ commentText: val }) }}
                    />
                    <span className="textarea-count-box">加油，还差<span>{this.state.commentLackCount}</span>个字!</span>
                </div>
            </div>
        )
    }
}

WriterComment.contextTypes = {
    router: React.PropTypes.object
};