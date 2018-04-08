import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Flex } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

const defaultAvatar = require("../images/selec.png");
const tempNull = require('../images/tempNull2.png'); //空状态的图片

export default class DesignerHome extends React.Component {
    constructor(props) {
        super( props)
        this.state = {
            user_name: "",
            avatarUrl:require("../images/avatar.png"),
            sex: "女",
            address: "杭州-滨江区", 
            experience: "6年经验", 
            works:"22作品", 
            slogan:'"传播现代的高雅艺术文化"',
            Get_demand: "6",
            Feedback_rate: "100%",
            Praise_rate: "100%",
            huake_info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis dicta voluptatibus voluptatum fuga amet eius modi! Repellat, labore fuga. In, atque dolores! Unde, placeat incidunt quaerat dolorem, asperiores praesentium ipsa dolor nulla ab alias delectus amet doloremque aperiam molestias quibusdam tenetur vero corporis id aliquam quae expedita tempora impedit non.",
            works_collect: "8",
            comment: "10",
            tab_index: 1, //设计师主页展示作品集还是评论，就看这个状态
            buttomBackgroundColor1: "#2068ab", //底部栏原始的背景颜色
            buttomBackgroundColor2: "#2068ab", //底部栏原始的背景颜色
            buttomBackgroundColor3: "#2068ab", //底部栏原始的背景颜色
            touchButtomBackgroundColor: "#4ba8ff", //底部栏按下去的背景颜色
            endButtomBackgroundColor: "#2068ab", //底部栏按下去的背景颜色
            buttomBackgroundColorLast: "#00a0e9", //底部栏最后那个按钮原始的背景颜色
            touchButtomBackgroundColorLast: "#4ba8ff", //底部栏最后那个按钮按下去的背景颜色
            endButtomBackgroundColorLast: "#00a0e9", //底部栏最后那个按钮按下去的背景颜色
        }
    }
    handleGo(index) {
        let path = index == 0 ? "/designerHome/indexWorksCollection" : "/designerHome/designerComment";
        this.setState({
            tab_index: index
        })
        //类似tab切换
        // this.context.router.push({
        //     pathname: path,
        //     state: this.state
        // });
        hashHistory.replace({
            pathname: path,
            query: { form: 'designerHome' },
            // state: this.state
        });

    }
    touchStartStyle = (index) => {
        this.setState({
            ["buttomBackgroundColor" + index]: this.state.touchButtomBackgroundColor
        })
    }
    touchEndStyle = (index) => {
        this.setState({
            ["buttomBackgroundColor" + index]: this.state.endButtomBackgroundColor
        })
    }
    //底部栏最后那个按钮
    touchStartStyleLast = () => {
        this.setState({
            buttomBackgroundColorLast: this.state.touchButtomBackgroundColorLast
        })
    }
    //底部栏最后那个按钮
    touchEndStyleLast = () => {
        this.setState({
            buttomBackgroundColorLast: this.state.endButtomBackgroundColorLast
        })
    }
    //打电话
    handleCall = () => {
        console.log(1)
    }
    //交谈，即时聊天
    handleTalk = () => {
        console.log(2)
    }
    //评论
    handleComment = () => {
        hashHistory.push({
            pathname: '/writerComment',
            query: { form: 'designerHome' }
        });
    }
    //立即下单,快速服务下单
    handleStartOrder = () => {
        hashHistory.push({
            pathname: '/placeOrder',
            query: { form: 'designerHome' }
        });
    }
    render() {
        let { path, nick_name, sex, txt_address, experience, works_count, signature, signature_bbs, comment_count } = this.props.designer;
        return (
            // <QueueAnim className="designer-home-anim"
            //     animConfig={[
            //         { opacity: [1, 0], translateX: [0, 150] }
            //     ]}>
                <div className="designer-home" key="1">
                    <NavBar
                        // className="NewNavBar"
                        className="new-nav-bar"
                        mode="light"
                        icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                        onLeftClick={() => hashHistory.goBack()}
                        rightContent={<Icon key="1" type="ellipsis" style={{ "color": "#5f5f5f" }}  />}
                    ></NavBar>
                    <div className="brief-box-out">
                    <div className="avatar-box"><img src={path ? path : defaultAvatar}/></div>
                    <p className="nick-name"><span className="text">{nick_name}</span><i className={sex == "女" ? "iconfont icon-icccxingbie-female" : "iconfont icon-xingbie-male"}></i></p>
                        {/* <Flex className="brief-more-flex">
                        <Flex.Item style={{ "flex": "2", "text-align": "right" }} className="ellipsis"><i className="iconfont icon-dizhi"></i><span>{txt_address}</span> </Flex.Item>
                        <Flex.Item style={{ "flex": "1.5" }} className="ellipsis"><i className="iconfont icon-shijian"></i><span>{experience}经验</span> </Flex.Item>
                        <Flex.Item style={{ "flex": "2", "text-align": "left" }} className="ellipsis"><i className="iconfont icon-tupian"></i><span>{works_count}件作品</span> </Flex.Item>
                        </Flex> */}
                        <p className="brief-more">
                            <i className="iconfont icon-dizhi"></i><span>{txt_address}</span>
                            <i className="iconfont icon-shijian"></i><span>{experience}经验</span>
                            <i className="iconfont icon-tupian"></i><span>{works_count}件作品</span>
                        </p>
                    <p className="slogan">{signature ? '“' + signature + '”' : null}</p>
                        <Flex className="brief-data-flex">
                            <Flex.Item className="ellipsis"> 
                                <p className="content">{this.state.Get_demand}</p>
                                <p className="text">获取需求</p>
                            </Flex.Item>
                            <Flex.Item className="ellipsis"> 
                                <p className="content">{this.state.Feedback_rate}</p>
                                <p className="text">反馈率</p>
                            </Flex.Item>
                            <Flex.Item className="ellipsis"> 
                                <p className="content">{this.state.Feedback_rate}</p>
                                <p className="text">好评率</p>
                            </Flex.Item>
                        </Flex>
                        <div className="brief-box-out-bottom">画客信息</div>
                    </div>
                    <p className="huake-info-box">{signature_bbs}</p>
                    <Flex className="brief-comment-flex">
                        <Flex.Item style={{ "flex": "1", "text-align": "right" }} className={this.state.tab_index == 0 ? "ellipsis active" : "ellipsis"}>
                            <span
                                onClick={() => { this.handleGo(0) }}
                            >
                                <span className="txt">作品集</span>
                            ({works_count})
                            </span>
                        </Flex.Item>
                        <Flex.Item style={{ "flex": "0.2"}}></Flex.Item>
                        <Flex.Item style={{ "flex": "1", "text-align": "left" }} className={this.state.tab_index == 1 ? "ellipsis active" : "ellipsis"}>
                            <span
                                onClick={() => { this.handleGo(1) }}
                            >
                                <span className="txt">评论</span>
                            ({comment_count})
                            </span>
                        </Flex.Item>
                    </Flex>
                    {/* {this.props.children} */}
                    {this.props.children &&
                        React.cloneElement(
                            this.props.children,
                            {
                                state: this.props.state,
                                setState: this.props.setState,
                                designer: this.props.designer,
                                indexWorksList: this.props.indexWorksList,
                            }
                        )
                    }
                    <div style={{"height":"1.2rem"}}></div>
                    <Flex className="bottom-features">
                        <Flex.Item
                        style={{ "background-color": this.state.buttomBackgroundColor1}}
                        onTouchStart={() => this.touchStartStyle(1)}
                        onTouchEnd={() => this.touchEndStyle(1)}
                        onClick={this.handleCall}
                        ><i className="iconfont icon-icon-phone"></i>电话</Flex.Item>
                        <Flex.Item
                        style={{ "background-color": this.state.buttomBackgroundColor2 }}
                        onTouchStart={() => this.touchStartStyle(2)}
                        onTouchEnd={() => this.touchEndStyle(2)}
                        onClick={this.handleTalk}
                        ><i className="iconfont icon-icon-talk"></i>交谈</Flex.Item>
                        <Flex.Item
                        style={{ "background-color": this.state.buttomBackgroundColor3 }}
                        onTouchStart={() => this.touchStartStyle(3)}
                        onTouchEnd={() => this.touchEndStyle(3)}
                        onClick={this.handleComment}
                        ><i className="iconfont icon-icon-comment"></i>评论</Flex.Item>
                        <Flex.Item
                        style={{ "flex": "2", "background-color": this.state.buttomBackgroundColorLast }}
                        onTouchStart={this.touchStartStyleLast}
                        onTouchEnd={this.touchEndStyleLast}
                        onClick={this.handleStartOrder}
                        >立即下单</Flex.Item>
                    </Flex>
                </div>
            // </QueueAnim>
        )
    }
}

export const IndexWorksCollection = (props) => {
    let oldBackgroundColor = "#fff";
    const touchStart = (e) => {
        oldBackgroundColor = e.target.style.backgroundColor;
        e.target.style.backgroundColor = "#eee";
    }
    const touchEnd = (e) => {
        e.target.style.backgroundColor = oldBackgroundColor;
    }
    const handleClick = () => {
        hashHistory.push({
            pathname: '/worksCollection',
            query: { form: 'designerHome' },
        });
    }
    const handleClickWorksDetails = (works_id) => {
        hashHistory.push({
            pathname: '/designerWorksDetails',
            query: { 
                form: 'designerHome', 
                works_id,
            },
        });
    }
    return (
        <div className="index-works-collection">
            {
                props.indexWorksList.map((value, index) => (
                    <WorksItem
                        {...value}
                        handleClickWorksDetails={handleClickWorksDetails}
                    />
                ))
            }
            <div
                style={{ "display": props.indexWorksList.length < 1 ? "none" : "block" }}
                className="view-more"
                onTouchStart={touchStart}
                onTouchEnd={touchEnd}
                onClick={handleClick}
            >查看更多</div>
            <img
                style={{ 
                    "display": props.indexWorksList.length < 1 ? "block" : "none",
                    "width": "142px",
                    "height": "150px",
                    "margin": "50px auto 0",
                }}
                src={tempNull} 
            />
        </div>
    )
}

const WorksItem = (props) => (
    <div key={props.id} onClick={() => { props.handleClickWorksDetails(props.id) }} style={{ display: "inline-block", width: "50%", boxSizing: "border-box", padding: "5px" }}>
        <div className="items" style={{
            border: "1px solid #ccc",
            boxSizing: "border-box",
            borderRadius: "3px",
            backgroundColor: "#f5f5f5",
            boxShadow: "0px 0px 10px #ccc",
        }}>
            <div>
                <img src={props.path_thumb ? props.path_thumb : props.path} style={{ width: "100%", height: "5rem" }} />
                <div style={{ height: "26px", overflow: "hidden" }}>
                    <p className="exlips" style={{ lineHeight: "24px", padding: "0 4px" }}>{props.title}</p>
                </div>
            </div>
        </div>
    </div>
)

DesignerHome.contextTypes = {
    router: React.PropTypes.object
};