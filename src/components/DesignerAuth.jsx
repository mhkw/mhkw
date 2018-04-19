import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, InputItem, List, Modal, WhiteSpace, WingBlank, Tag  } from "antd-mobile";
import { Motion, spring } from 'react-motion';

export default class DesignerAuth extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            emptySelf: false, //个人信息
            emptyMotto: false, //关于我，一句话介绍,座右铭，格言
            emptySkill: false, //擅长技能
            emptyWorks: false, //项目案例
            nick_name: '', 
            customLabelsArray: sessionStorage.getItem("customLabelsArray") ? JSON.parse(sessionStorage.getItem("customLabelsArray")) : [], //标签数组
            signature_bbs: '', //一句话介绍
            content: '',  //详细介绍
            keywords: [], //我的擅长技能,
        }
    }
    //点击进入个人信息页面
    gotoSelf = () => {
        hashHistory.push({
            pathname: '/authSelf',
            query: { form: 'DesignerAuth' }
        });
    }
    //点击进入关于我页面
    gotoMotto = () => {
        hashHistory.push({
            pathname: '/authMotto',
            query: { form: 'DesignerAuth' }
        });
    }
    //点击进入擅长技能页面
    gotoSkill = () => {
        hashHistory.push({
            pathname: '/authSkill',
            query: { form: 'DesignerAuth' }
        });
    }
    //点击添加作品
    gotoNewWork = () => {
        hashHistory.push({
            pathname: '/creatWork',
            query: { form: 'DesignerAuth' }
        });
    }
    //点击进入项目案例页面
    gotoWorks = () => {
        hashHistory.push({
            pathname: '/authWorks',
            query: { form: 'DesignerAuth' }
        });
    }
    getSelfInfo = (props) => {
        //设置个人信息
        if (props.Self && props.Self.real_name) {
            let { customLabels, nick_name } = props.Self;
            let customLabelsArray = [];
            if (customLabels && customLabels.length > 0) {
                customLabelsArray = customLabels.split(";");
            }
            this.setState({ nick_name, customLabelsArray })
            sessionStorage.setItem("customLabelsArray", JSON.stringify(customLabelsArray))

            this.setState({ emptySelf: false });
        }else{
            this.setState({ emptySelf: true});
        }

        //设置关于我
        if (props.Self && props.Self.signature_bbs) {
            let { signature_bbs, content } = props.Self;
            this.setState({ signature_bbs, content });
            this.setState({ emptyMotto: false });
        } else {
            this.setState({ emptyMotto: true });
        }

        //设置擅长技能
        if (props.Self && props.Self.keywords) {
            let { keywords } = props.Self;
            this.setState({ keywords });
            this.setState({ emptySkill: false });
        } else {
            this.setState({ emptySkill: true });
        }

        //设置项目案例
    }
    componentWillMount() {
        this.getSelfInfo(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getSelfInfo(nextProps);
    }
    render() {
        let extraElement = <i className="iconfont icon-bianji"></i>;
        let extraElementEmpty = <span className="extra-edit">未设置</span>;
        return (
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div className="designer-auth-page" style={{ ...interpolatingStyle }}>
                        <NavBar
                            className="new-nav-bar"
                            mode="light"
                            icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                            onLeftClick={() => hashHistory.goBack()}
                        >设计师认证</NavBar>
                        <List renderHeader={<span className="render-header">个人信息</span>} className="auth-self">
                            <List.Item multipleLine arrow="horizontal" onClick={this.gotoSelf} extra={this.state.emptySelf ? extraElementEmpty : extraElement}>
                                {this.state.nick_name}
                                <List.Item.Brief>
                                    <div className="tag-container">
                                        {
                                            this.state.customLabelsArray.length > 0 &&
                                            this.state.customLabelsArray.map((value, index) => {
                                                return index < 4 ? <Tag key={index} className="self-label" >{value}</Tag> : null
                                            })

                                        }
                                    </div>
                                </List.Item.Brief>
                            </List.Item>
                        </List>
                        <List renderHeader={<span className="render-header">关于我</span>} className="auth-motto">
                            <List.Item multipleLine wrap arrow="horizontal" onClick={this.gotoMotto} extra={this.state.emptyMotto ? extraElementEmpty : extraElement}>
                                {this.state.signature_bbs ? this.state.signature_bbs : "座右铭"}
                                <List.Item.Brief>
                                    {this.state.content ? this.state.content : "我的介绍"}
                                </List.Item.Brief>
                            </List.Item>
                        </List>
                        <List renderHeader={<span className="render-header">擅长技能</span>} className="auth-skill">
                            <List.Item multipleLine arrow="horizontal" onClick={this.gotoSkill} extra={this.state.emptySkill ? extraElementEmpty : extraElement}>
                                <List.Item.Brief>
                                    <div className="tag-container">
                                        {
                                            this.state.keywords.length > 0 &&
                                            this.state.keywords.map((value, index) => {
                                                return index < 7 ? <Tag key={index} className="self-label" >{value}</Tag> : null
                                            })

                                        }
                                    </div>
                                </List.Item.Brief>
                            </List.Item>
                        </List>
                        <List renderHeader={[<span className="render-header">项目案例</span>, <span className="right-header">至少添加6个作品才能通过审核</span>]} className="auth-works">
                            <List.Item className="add-works" multipleLine arrow="horizontal" onClick={this.gotoNewWork} >
                                <i className="iconfont icon-tianjia"></i>添加作品
                            </List.Item>
                        </List>
                        {this.props.children &&
                            React.cloneElement(
                                this.props.children,
                                {
                                    state: this.state,
                                    setState: this.setState.bind(this),
                                    Works: this.props.Works,
                                    propsSetState: this.props.propsSetState,
                                    ajaxDeleteWorks: this.props.ajaxDeleteWorks,
                                }
                            )
                        }
                    </div>
                }
            </Motion>
        )
    }
}