import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, InputItem, List, Modal, WhiteSpace, WingBlank, Tag, Button  } from "antd-mobile";
import { Motion, spring } from 'react-motion';
import BScroll from 'better-scroll'

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
            is_auth: '', //是否已经认证，已经认证的为'1',不能再提交认证了。
            height: ""
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
            let { customLabels, nick_name, is_auth } = props.Self;
            let customLabelsArray = [];
            if (customLabels && customLabels.length > 0) {
                customLabelsArray = customLabels.split(";");
            }
            this.setState({ nick_name, customLabelsArray, is_auth })
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
        if (props.Self && props.Self.keywords && props.Self.keywords.length > 0) {
            let { keywords } = props.Self;
            this.setState({ keywords });
            this.setState({ emptySkill: false });
        } else {
            this.setState({ emptySkill: true });
        }

        //设置项目案例
        if (props.Works && props.Works.length > 0) {

            this.setState({ emptyWorks: false });
        } else {
            this.setState({ emptyWorks: true });
        }
    }
    componentDidMount(){
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 25;
        const scroll = new BScroll(document.querySelector('.wrapper'), { click: true, bounceTime: 300, swipeBounceTime: 200 })
        this.setState({
            height: hei
        })
    }
    componentWillMount() {
        this.getSelfInfo(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getSelfInfo(nextProps);
    }
    //提交审核
    submitUserAuth = () => {
        let noEmpty = true; //是否没有项目为空，即是否允许提交审核
        let { emptySelf, emptyMotto, emptySkill, emptyWorks } = this.state;
        if (emptySelf) {
            noEmpty = false;
            Toast.info("请完善个人信息",1.5);
        }
        if (emptyMotto) {
            noEmpty = false;
            Toast.info("请完善关于我的介绍", 1.5);
        }
        if (emptySkill) {
            noEmpty = false;
            Toast.info("请完善擅长技能", 1.5);
        }
        if (emptyWorks) {
            noEmpty = false;
            Toast.info("请完善项目案例", 1.5);
        }
        if (noEmpty) {
            this.props.ajaxSubmitUserAuth();
        }
    }
    render() {
        let extraElement = <i className="iconfont icon-bianji"></i>;
        let extraElementEmpty = <span className="extra-edit">未设置</span>;
        return (
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div className="designer-auth-page" style={{ ...interpolatingStyle }}>
                        <NavBar
                            className="new-nav-bar top"
                            mode="light"
                            icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                            onLeftClick={() => hashHistory.goBack()}
                            rightContent={this.state.is_auth == '0' ? <Button className="rechargeButton" onClick={this.submitUserAuth}>提交</Button> : null}
                        >设计师认证{this.state.is_auth == '1' ? < i className="iconfont auth icon-renzhengguanli"></i> : null  }</NavBar>
                        <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                            <div>
                                <List renderHeader={<span className="render-header">个人信息</span>} className="auth-self">
                                    <List.Item multipleLine arrow="horizontal" onClick={this.gotoSelf} extra={this.state.emptySelf ? extraElementEmpty : extraElement}>
                                        {this.state.nick_name ? this.state.nick_name : "昵称"}
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
                                        <i className="iconfont icon-tianjia"></i>{this.state.emptyWorks ? "上传作品" : "继续添加作品"}
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
                                            is_next_page: this.props.is_next_page, //是否有更多作品
                                            total_pages: this.props.total_pages, //作品总页数
                                        }
                                    )
                                }    
                            </div>
                        </div>
                        
                    </div>
                }
            </Motion>
        )
    }
}