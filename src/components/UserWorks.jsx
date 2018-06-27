import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, InputItem, List, Modal, WhiteSpace, WingBlank, Tag, Button, SwipeAction } from "antd-mobile";
import { Motion, spring } from 'react-motion';
import BScroll from 'better-scroll'

const defaultAvatar = require('../images/logoZhanWei.png');

export default class UserWorks extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            location_form: 'mine',
            Works: [], //作品列表
            is_next_page: 0, //作品列表是否还有下一页
            total_pages: 0, //作品总页数
            height: "",
            scroll: null, //滚动插件实例化对象
            scroll_bottom_tips: "上拉加载更多", //上拉加载的tips
        }
        this.handleGetWorksListBySelf = (res) => {
            if (res.success) {
                let newItemList = this.state.Works;

                // newItemList.push(res.data.item_list);
                newItemList = [...this.state.Works, ...res.data.item_list];

                this.setState({
                    Works: newItemList,
                    total_pages: res.data.total_pages,
                    scroll_bottom_tips: this.state.Works.length > 10 ? "上拉加载更多" : ""
                }, () => {
                    this.state.scroll.finishPullUp()
                    this.state.scroll.refresh();
                })

            } else {
                Toast.info(res.message, 1.5);
            }
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
        hashHistory.push({
            pathname: '/creatWork',
            query: { 
                form: 'UserWorks',
                works_id: id,
             }
        });
    }
    //加载更多
    clickNextMoreClick = () => {
        if (this.state.location_form == "mine") {
            hashHistory.push({
                pathname: '/userWorks',
                query: { form: 'allWorks' }
            });
        } else {
            
        }
    }
    //点击删除作品
    clickDeleteWorks = (id, title) => {
        Modal.alert('删除作品?', title, [
            { text: '取消', onPress: () => { } },
            { text: '删除', onPress: () => this.props.ajaxDeleteWorks(id) },
        ])
    }
    getSelfInfo = (props) => {
        //获取擅长技能数据
        if (props.Works && props.Works.length > 0) {
            let Works = props.Works;
            let is_next_page = props.is_next_page;
            let total_pages = props.total_pages;
            let scroll_bottom_tips = "上拉加载更多";
            if (props.Works.length <= 10) {
                scroll_bottom_tips = "";
            }
            this.setState({ Works, is_next_page, total_pages, scroll_bottom_tips });
        } else if (props.Works.length == 0) {
            this.setState({ scroll_bottom_tips: "暂无作品"});
        }
    }
    componentDidMount(){
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 25;
        if (this.state.location_form == "mine") {
            const scroll = new BScroll(document.querySelector('.wrapper'), { click: true })
            this.setState({
                height: hei
            })
        } else {
            const scroll = new BScroll(document.querySelector('.wrapper'), { click: true, bounceTime: 300, swipeBounceTime: 200, momentumLimitTime: 200, pullUpLoad: { threshold: -50 } })
            this.setState({
                height: hei,
                scroll
            })
            scroll.on('pullingUp', () => {
                this.ajaxNextPage();
            });
        }  
    }
    //下拉加载下一页
    ajaxNextPage = () => {
        let hasNextPage = false;

        if (this.state.Works.length >= 10 && Math.ceil(this.state.Works.length / 10) < this.state.total_pages ) {

            hasNextPage = true;
        }
        let page = parseInt(this.state.Works.length / 10) + 1;

        this.setState({
            scroll_bottom_tips: hasNextPage ? "加载中..." : "加载完成"
        })

        if (hasNextPage) {
            setTimeout(() => {
                this.ajaxGetWorksListBySelf(10, page);
            }, 500);
        }
    }
    //获取我的作品列表
    ajaxGetWorksListBySelf = (per_page = 10, page = 1) => {
        runPromise("get_works_list_by_self", {
            user_id: validate.getCookie("user_id"),
            per_page,
            page,
        }, this.handleGetWorksListBySelf, true, "get");
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
            <Motion defaultStyle={{ left: 300 }} style={{ left: spring(0, { stiffness: 300, damping: 28 }) }}>
                {interpolatingStyle => 
                    <div className="user-works-page" style={{ ...interpolatingStyle, position: "relative" }}>
                        {
                            this.state.location_form == "allWorks" ? (
                                <NavBar
                                    className="new-nav-bar top"
                                    mode="light"
                                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                                    onLeftClick={() => hashHistory.goBack()}
                                >作品列表</NavBar>
                            ) : null
                        }
                        
                        <List 
                            className={this.state.location_form == "allWorks"?"wrapper":"" }
                            style={ this.state.location_form == "allWorks" ? {overflow: "hidden", height: this.state.height}:{} }
                        >
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
                                this.state.Works.map((value, index)=>{
                                    let isShow = true;
                                    if (this.state.location_form == "mine" && index >= 5) {
                                        isShow = false;
                                    }
                                    return isShow ? <SwipeAction
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
                                            // thumb={value.path_thumb ? value.path_thumb : defaultAvatar}
                                            thumb={<img src={value.path_thumb ? value.path_thumb : defaultAvatar} onError={(e) => { e.target.src = defaultAvatar }} />}
                                            onClick={() => { this.gotoWorks(value.id) }}
                                        >
                                            {value.title}
                                        </List.Item>
                                    </SwipeAction> : null
                                })
                            }
                            <div 
                                className="scroll-bottom-tips"
                                style={{ "display": this.state.location_form == "mine" ? "none" : "block" }}
                            >{this.state.scroll_bottom_tips}</div>
                            <div
                                className="user-works-view-more"
                                style={{ "display": this.state.location_form == "mine" ? "block" : "none" }}
                                onTouchStart={touchStart}
                                onTouchEnd={touchEnd}
                                onClick={this.clickNextMoreClick}
                            >查看更多</div>
                            
                        </List>
                    </div>
                }
            </Motion>
        )
    }
}