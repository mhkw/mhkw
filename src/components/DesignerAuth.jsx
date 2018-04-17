import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, InputItem, List, Modal, WhiteSpace, WingBlank, Tag  } from "antd-mobile";
import { Motion, spring } from 'react-motion';

const defaultAvatar = 'https://huakewang.b0.upaiyun.com/2016/06/23/20160623200741283631.png!540x720';

export default class DesignerAuth extends React.Component {
    constructor(props) {
        super(props)
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
    //点击进入项目案例页面
    gotoWorks = () => {
        hashHistory.push({
            pathname: '/authWorks',
            query: { form: 'DesignerAuth' }
        });
    }
    render() {
        let extraElement = <i className="iconfont icon-bianji"></i>;
        let extraElementEmpty = <span className="extra-edit">未设置</span>;
        return (
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div className="designer-auth-page" style={{ ...interpolatingStyle}}>
                        <NavBar
                            className="new-nav-bar"
                            mode="light"
                            icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                            onLeftClick={() => hashHistory.goBack()}
                        >设计师认证</NavBar>
                        <List renderHeader={<span className="render-header">个人信息</span>} className="auth-self">
                            <List.Item multipleLine arrow="horizontal" onClick={this.gotoSelf} extra={extraElementEmpty}>
                            晓风残月
                                <List.Item.Brief>
                                    <Tag>标签1</Tag>
                                    <Tag>标签2</Tag>
                                    <Tag>标签3</Tag>
                                </List.Item.Brief>
                            </List.Item>
                        </List>
                        <List renderHeader={<span className="render-header">关于我</span>} className="auth-motto">
                            <List.Item multipleLine wrap arrow="horizontal" onClick={this.gotoMotto} extra={extraElementEmpty}>
                                座右铭
                                <List.Item.Brief>
                                    我的介绍
                                </List.Item.Brief>
                            </List.Item>
                        </List>
                        <List renderHeader={<span className="render-header">擅长技能</span>} className="auth-skill">
                            <List.Item multipleLine arrow="horizontal" onClick={this.gotoSkill} extra={extraElement}>
                                    <Tag>标签1</Tag>
                                    <Tag>标签2</Tag>
                                    <Tag>标签3</Tag>
                            </List.Item>
                        </List>
                        <List renderHeader={[<span className="render-header">项目案例</span>, <span className="right-header">至少添加6个作品才能通过审核</span>]} className="auth-works">
                            <List.Item className="add-works" multipleLine arrow="horizontal" onClick={this.gotoWorks} >
                                <i className="iconfont icon-tianjia"></i>添加作品
                            </List.Item>
                            <List.Item
                                className="auth-works-list" 
                                multipleLine
                                arrow="horizontal"
                                thumb={defaultAvatar}
                                onClick={this.gotoWorks}
                            >
                                添加作品
                            </List.Item>
                            <List.Item
                                className="auth-works-list"
                                multipleLine
                                arrow="horizontal"
                                thumb={defaultAvatar}
                                onClick={this.gotoWorks}
                            >
                                添加作品2
                            </List.Item>
                        </List>
                    </div>
                }
            </Motion>
        )
    }
}