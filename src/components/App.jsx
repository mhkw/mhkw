import React, { Component } from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import { TabBar } from 'antd-mobile';

// import 'antd-mobile/dist/antd-mobile.css';
import '../css/main.scss';

const appUrl = {
    'upNeed': require('../images/upNeed.png'),
    'upWorks': require('../images/upWorks.png'),
    'upQuote': require('../images/upQuote.png'),
    'upTalk': require('../images/upTalk.png'),
    'add': require('../images/add.png'),
    'tabbar_one_on': require('../images/tabbar_one_on@3x.png'),
    'tabbar_two_on': require('../images/tabbar_two_on@3x.png'),
    'tabbar_three_on': require('../images/tabbar_three_on@3x.png'),
    'tabbar_four_on': require('../images/tabbar_four_on@3x.png'),
    'tabbar_one_close': require('../images/tabbar_one_close@3x.png'),
    'tabbar_two_close': require('../images/tabbar_two_close@3x.png'),
    'tabbar_three_close': require('../images/tabbar_three_close@3x.png'),
    'tabbar_four_close': require('../images/tabbar_four_close@3x.png'),
}
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            display:"block",
            src: [appUrl.tabbar_one_close, appUrl.tabbar_two_close, appUrl.tabbar_three_close, appUrl.tabbar_four_close],
            activeSrc: [appUrl.tabbar_one_on, appUrl.tabbar_two_on, appUrl.tabbar_three_on, appUrl.tabbar_four_on],
            selectedTab: '',
            hidden: false,
            fullScreen: false,
            showTabBar: true,
        };
    }
    
    showWhatDo = () => {
        this.setState({
            show: !this.state.show,
        });
    }
    componentDidMount = ()=>{
        this.setState({
            selectedTab: window.location.href.split("#")[1]
        });
    }
    // changeBgPic = (src) => {
    //     this.setState({
    //         src: this.src
    //     })
    // }

    changeBgPic = (e) => {
        let num = e.currentTarget.getAttribute("data-key");
        e.currentTarget.getElementsByTagName("i")[0].style.backgroundImage = "url(" + this.state.src[num] + ")";
        e.currentTarget.getElementsByTagName("span")[0].style.color = "#3ebbf3";
    }
    clickContacts = () => {
        // this.sendEventChatList();
        if (window.UIEaseChat && window.api) {
            window.UIEaseChat.getAllConversations(function (ret) {
                // console.log("getAllConversations_NB");
                // console.log(JSON.stringify(ret));
                if (ret.conversations) {
                    window.api.sendEvent({
                        name: 'getAllConversations',
                        extra: {
                            conversations: ret.conversations
                        }
                    });
                }
            });
        } else {
            //H5页面
            // console.log("H5 page no api");
        }
    }
    // sendEventChatList() {
    //     if (window.api) {
    //         window.api.sendEvent({
    //             name: 'chatList'
    //         });
    //     }
    // }
    setShowTabBar = (show) => {
        this.setState({
            showTabBar: !!show
        })
    }
    render() {
        return (
            <div>
                {this.props.children && 
                    React.cloneElement(
                        this.props.children,
                        {
                            state: this.state,
                            props: this.props,
                            setState: this.setState.bind(this),
                            HOCState: this.props.state,
                            propsSetState: this.props.propsSetState,
                            conversations: this.props.conversations,
                            sumUnreadMessagesCount: this.props.sumUnreadMessagesCount,
                            setShowTabBar: this.setShowTabBar,
                        }
                    )
                }
                <div className="barBottom fn-clear" style={{display:this.state.display, zIndex:1000, bottom: this.state.showTabBar ? "0" : "-1.4rem" }}>
                    <TabBar className="tabBarUl"
                        unselectedTintColor="#949494"
                        tintColor="#33A3F4"
                        barTintColor="white"
                        hidden={this.state.hidden}
                    >
                        <TabBar.Item
                            title="首 页"
                            key="home"
                            icon={<div style={{
                                width: '0.8rem',
                                height: '0.8rem',
                                background: 'url('+this.state.src[0]+') center center /  0.8rem 0.8rem no-repeat'
                            }}
                            />
                            }
                            selectedIcon={<div style={{
                                width: '0.8rem',
                                height: '0.8rem',
                                background: 'url(' + this.state.activeSrc[0] +') center center /  0.8rem 0.8rem no-repeat'
                            }}
                            />
                            }
                            selected={this.state.selectedTab === '/'}
                            // badge={1}
                            onPress={() => {
                                this.setState({
                                    selectedTab: '/',
                                });
                                this.context.router.push("/");
                            }}
                            data-seed="logId"
                        >
                        </TabBar.Item>
                        <TabBar.Item
                            icon={
                                <div style={{
                                    width: '0.8rem',
                                    height: '0.8rem',
                                    background: 'url(' + this.state.src[1] +') center center /  0.8rem 0.8rem no-repeat'
                                }}
                                />
                            }
                            selectedIcon={
                                <div style={{
                                    width: '0.8rem',
                                    height: '0.8rem',
                                    background: 'url(' + this.state.activeSrc[1] +') center center /  0.8rem 0.8rem no-repeat'
                                }}
                                />
                            }
                            title="画客圈"
                            key="hkq"
                            selected={this.state.selectedTab === '/circle'}
                            onPress={() => {
                                this.setState({
                                    selectedTab: '/circle',
                                });
                                this.context.router.push("/circle");                                
                            }}
                            data-seed="logId1"
                        >
                        </TabBar.Item>
                        <TabBar.Item
                            icon={
                                <div style={{
                                    width: '1.12rem',
                                    height: '1.12rem',
                                    background: 'url(' + appUrl.add +') center center /  1.12rem 1.12rem no-repeat'
                                }}
                                />
                            }
                            onPress={() => {
                                this.setState({
                                    show: !this.state.show
                                });
                            }}
                            data-seed="logId2"
                        >
                        </TabBar.Item>
                        <TabBar.Item
                            icon={
                                <div style={{
                                    width: '0.8rem',
                                    height: '0.8rem',
                                    background: 'url(' + this.state.src[2] +') center center /  0.8rem 0.8rem no-repeat'
                                }}
                                />
                            }
                            selectedIcon={
                                <div style={{
                                    width: '0.8rem',
                                    height: '0.8rem',
                                    background: 'url(' + this.state.activeSrc[2] +') center center /  0.8rem 0.8rem no-repeat'
                                }}
                                />
                            }
                            title="消息"
                            key="Friend"
                            selected={this.state.selectedTab === '/chatList'}
                            // dot={true}
                            badge={this.props.sumUnreadMessagesCount > 0 ? this.props.sumUnreadMessagesCount : ""}
                            onPress={() => {
                                this.setState({
                                    selectedTab: '/chatList',
                                });
                                this.context.router.push("/chatList");
                                this.clickContacts();                                                                
                            }}
                        >
                        </TabBar.Item>
                        <TabBar.Item
                            icon={
                                <div style={{
                                    width: '0.8rem',
                                    height: '0.8rem',
                                    background: 'url(' + this.state.src[3] + ') center center /  0.8rem 0.8rem no-repeat'
                                }}
                                />
                            }
                            selectedIcon={
                                <div style={{
                                    width: '0.8rem',
                                    height: '0.8rem',
                                    background: 'url(' + this.state.activeSrc[3] + ') center center /  0.8rem 0.8rem no-repeat'
                                }}
                                />
                            }
                            title="我 的"
                            key="Friend"
                            selected={this.state.selectedTab === '/mine'}
                            onPress={() => {
                                this.setState({
                                    selectedTab: '/mine',
                                });
                                this.context.router.push("/mine");                                                                
                            }}
                        >
                        </TabBar.Item>
                    </TabBar>
                </div>

                <div className="navPlus">
                    <QueueAnim className="demo-content"
                        animConfig={[
                            { opacity: [1, 0], translateY: [0, 800] },
                            { opacity: [1, 0], translateY: [0, 80] }
                        ]}>
                        {this.state.show ? [
                            <div className="demo-thead navPlusAnim" key="a">
                                <ul className="fourWrap">
                                    <li className="upNeed">
                                        <Link to='/creatNeed'>
                                            <img src={appUrl.upNeed} alt="" />
                                            发布需求
                                        </Link>
                                    </li>
                                    <li className="upWorks">
                                        <Link to='/creatWork'>
                                            <img src={appUrl.upWorks} alt="" />
                                            发布作品
                                        </Link>
                                    </li>
                                    <li className="upQuote">
                                        <Link to="/creatServer">
                                            <img src={appUrl.upQuote} alt="" />
                                            <i></i>
                                            发送报价
                                        </Link>
                                    </li>
                                    <li className="upTalk">
                                        <Link to='/creatCard'>
                                            <img src={appUrl.upTalk} alt="" />
                                            发送帖子
                                        </Link>
                                    </li>
                                </ul>
                                <span className="iconfont icon-chuyidong1-copy" onClick={this.showWhatDo}></span>
                            </div>
                        ] : null}
                    </QueueAnim>
                </div>
            </div>
        );
    }
}

App.contextTypes = {
    router: React.PropTypes.object
};