import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, InputItem, List, Modal, WhiteSpace, WingBlank, Tag, Button, SwipeAction } from "antd-mobile";

const defaultAvatar = require('../images/logoZhanWei.png');

export default class UserWorks extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            location_form: 'mine',
            Works: [], //作品列表
            is_next_page: 0, //作品列表是否还有下一页
        }
    }
    //预览作品，跳到作品详情页面去
    gotoWorks = (works_id) => {
        hashHistory.push({
            pathname: '/worksDetails',
            query: {
                form: 'workList',
                works_id,
            },
        });
    }
    //修改作品
    changeWorks = (id) => {
        console.log(id);
    }
    //修改作品
    deleteWorks = (id) => {
        console.log(id);
    }
    //加载更多
    clickNextMoreClick = () => {
        console.log("加载更多");
    }
    //点击删除作品
    clickDeleteWorks = (id, title) => {
        Modal.alert('删除作品?', title, [
            { text: '取消', onPress: () => { } },
            { text: '删除', onPress: () => this.deleteWorks(id) },
        ])
    }
    getSelfInfo = (props) => {
        //获取擅长技能数据
        if (props.Works && props.Works.length > 0) {
            let Works = props.Works;
            let is_next_page = props.is_next_page;
            this.setState({ Works, is_next_page });
        }
    }
    componentWillMount() {
        if (this.props.location.query && this.props.location.query.form) {
            this.setState({ location_form: this.props.location.query.form });
        }
        this.getSelfInfo(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getSelfInfo(nextProps);
    }
    render() {
        //作品主页的更多作品按钮有关，点击加载更多作品
        let oldBackgroundColor = "#fff";
        const touchStart = (e) => {
            oldBackgroundColor = e.target.style.backgroundColor;
            e.target.style.backgroundColor = "#eee";
        }
        const touchEnd = (e) => {
            e.target.style.backgroundColor = oldBackgroundColor;
        }
        return (
            <div className="user-works-page" key="1">
                {
                    this.state.location_form == "allWorks" ? (
                        <NavBar
                            className="new-nav-bar"
                            mode="light"
                            icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                            onLeftClick={() => hashHistory.goBack()}
                        >作品列表</NavBar>
                    ) : null
                }
                
                <List>
                    {/* <List.Item
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
                    </List.Item> */}
                    {
                        this.state.Works.length > 0 &&
                        this.state.Works.map((value, index)=>(
                            <SwipeAction
                                className="works-swipe"
                                autoClose
                                right={[
                                    {
                                        text: '预览',
                                        onPress: () => this.gotoWorks(value.id),
                                        style: { backgroundColor: '#f8c301', fontSize: '16px', color: 'white', padding: '0 8px' },
                                    },
                                    {
                                        text: '修改',
                                        onPress: () => this.changeWorks(value.id),
                                        style: { backgroundColor: '#56B949', fontSize: '16px', color: 'white', padding: '0 8px' },
                                    },
                                    {
                                        text: '删除',
                                        onPress: () => this.clickDeleteWorks(value.id, value.title),
                                        style: { backgroundColor: '#F4333C', fontSize: '16px', color: 'white', padding: '0 8px' },
                                    },
                                ]}
                            >
                                <List.Item
                                    className="auth-works-list"
                                    extra={<i style={{ "font-size": "20px" }} className="iconfont icon-jiantou2"></i>}
                                    thumb={value.path_thumb ? value.path_thumb : defaultAvatar}
                                    onClick={() => { this.gotoWorks(value.id) }}
                                >
                                    {value.title}
                                </List.Item>
                            </SwipeAction>
                        ))
                    }
                    <div
                        className="user-works-view-more"
                        style={{ "display": this.state.is_next_page > 0 ? "block" : "none" }}
                        onTouchStart={touchStart}
                        onTouchEnd={touchEnd}
                        onClick={this.clickNextMoreClick}
                    >查看更多</div>
                    
                </List>
            </div>
        )
    }
}