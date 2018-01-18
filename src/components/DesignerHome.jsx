import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Flex } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

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
        }
    }
    handleGo(index) {
        let path = index == 0 ? "/designerHome/worksCollection" : "/designerHome/designerComment";
        this.setState({
            tab_index: index
        })
        //类似tab切换
        this.context.router.push({
            pathname: path,
            state: this.state
        });
    }
    render() {
        return (
            // <QueueAnim className="designer-home-anim"
            //     animConfig={[
            //         { opacity: [1, 0], translateX: [0, 150] }
            //     ]}>
                <div className="designer-home" key="1">
                    <NavBar
                        className="NewNavBar"
                        mode="light"
                        icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                        onLeftClick={() => hashHistory.goBack()}
                        rightContent={<Icon key="1" type="ellipsis" style={{ "color": "#5f5f5f" }}  />}
                    ></NavBar>
                    <div className="brief-box-out">
                        <div className="avatar-box"><img src={this.state.avatarUrl}/></div>
                        <p className="nick-name"><span className="text">Miazhang</span><i className={this.state.sex == "女" ? "iconfont icon-icccxingbie-female" : "iconfont icon-xingbie-male"}></i></p>
                        <Flex className="brief-more-flex">
                            <Flex.Item style={{"flex":"2","text-align":"right"}} className="ellipsis"><i className="iconfont icon-dizhi"></i><span>{this.state.address}</span> </Flex.Item>
                            <Flex.Item style={{"flex":"1.5"}} className="ellipsis"><i className="iconfont icon-shijian"></i><span>{this.state.experience}</span> </Flex.Item>
                            <Flex.Item style={{"flex": "2", "text-align": "left"}} className="ellipsis"><i className="iconfont icon-tupian"></i><span>{this.state.works}</span> </Flex.Item>
                        </Flex>
                        <p className="slogan">{this.state.slogan}</p>
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
                    <p className="huake-info-box">{this.state.huake_info}</p>
                    <Flex className="brief-comment-flex">
                        <Flex.Item style={{ "flex": "1", "text-align": "right" }} className={this.state.tab_index == 0 ? "ellipsis active" : "ellipsis"}>
                            <span
                                onClick={() => { this.handleGo(0) }}
                            >
                                <span className="txt">作品集</span>
                                ({this.state.works_collect})
                            </span>
                        </Flex.Item>
                        <Flex.Item style={{ "flex": "0.2"}}></Flex.Item>
                        <Flex.Item style={{ "flex": "1", "text-align": "left" }} className={this.state.tab_index == 1 ? "ellipsis active" : "ellipsis"}>
                            <span
                                onClick={() => { this.handleGo(1) }}
                            >
                                <span className="txt">评论</span>
                                ({this.state.comment})
                            </span>
                        </Flex.Item>
                    </Flex>
                    {this.props.children}
                </div>
            // </QueueAnim>
        )
    }
}

DesignerHome.contextTypes = {
    router: React.PropTypes.object
};