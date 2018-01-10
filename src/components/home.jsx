import React from 'react'
import { List, InputItem, NavBar, Tabs, PullToRefresh, ListView } from 'antd-mobile';
import { Link } from 'react-router';
import { createForm } from 'rc-form';
import QueueAnim from 'rc-queue-anim';

import '../css/font/iconfont.css'

const loginUrl = [
    require('../images/home/lei1.png'),
    require('../images/home/lei2.png'),
    require('../images/home/lei3.png'),
    require('../images/home/lei4.png'),
    require('../images/home/lei5.png'),
    require('../images/home/lei6.png'),
    require('../images/home/lei7.png'),
    require('../images/home/lei8.png'),
    require('../images/touxiang.png'),
    require('../images/homePic.png'),
]


const NUM_ROWS = 7;
let pageIndex = 0;

function genData(pIndex = 0) {
    const dataArr = [];
    for (let i = 0; i < NUM_ROWS; i++) {
        dataArr.push(`row - ${(pIndex * NUM_ROWS) + i}`);
    }
    return dataArr;
}

export default class LoginView extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
            refreshing: true,
            isLoading: true,
            height: document.documentElement.clientHeight,
            useBodyScroll: true,
            res: [{
                img: 'http://huakewang.b0.upaiyun.com/2014/11/03/20141103220756424665.jpg!540x720',
                title: 'Meet hotel',
                sex:"男",
                lng: "1.99km",
            },
            {
                img: 'http://www.huakewang.com/uploads/2013/1031/20131031002147100933_thumb.jpg',
                title: 'McDonald',
                sex: "女",
                lng:"1.68km",
            },
            {
                img: 'http://www.huakewang.com/uploads/2013/1031/20131031002147100933_thumb.jpg',
                title: 'McDonald',
                sex: "女",
                lng:"1.68km",
            },
            {
                img: 'http://www.huakewang.com/uploads/2013/1031/20131031002147100933_thumb.jpg',
                title: 'McDonald',
                sex: "女",
                lng:"1.68km",
            },
            {
                img: 'http://www.huakewang.com/uploads/2013/1031/20131031002147100933_thumb.jpg',
                title: 'McDonald',
                sex: "女",
                lng:"1.68km",
            },
            {
                img: 'http://www.huakewang.com/uploads/2013/1031/20131031002147100933_thumb.jpg',
                title: 'McDonald',
                sex: "女",
                lng:"1.68km",
            },
            {
                img: 'http://huakewang.b0.upaiyun.com/2014/11/03/20141103220756424665.jpg!540x720',
                title: 'McDonald',
                sex: "女",
                lng:"1.68km",
            }]
        };
    }

    componentDidUpdate() {
        if (this.state.useBodyScroll) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }
    }

    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
        setTimeout(() => {
            this.rData = genData();
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(genData()),
                height: hei,
                refreshing: false,
                isLoading: false,
            });
            console.log(this.state);
        }, 1500);
    }

    onRefresh = () => {   //顶部下拉刷新数据
        this.setState({ refreshing: true, isLoading: true });
        // simulate initial Ajax
        setTimeout(() => {
            this.rData = genData();
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                refreshing: false,
                isLoading: false,
            });
        }, 600);
    };

    onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
        console.log('reach end', event);
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.rData = [...this.rData, ...genData(++pageIndex)];
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false,
            });
        }, 1000);
    };
    render() {
        const tabs = [
            { title: <div className="fn-clear tabsList"><img src={loginUrl[0]} /><p>软件开发</p></div> },
            { title: <div className="fn-clear tabsList"><img src={loginUrl[1]} /><p>软件开发</p></div> },
            { title: <div className="fn-clear tabsList"><img src={loginUrl[2]} /><p>软件开发</p></div> },
            { title: <div className="fn-clear tabsList"><img src={loginUrl[3]} /><p>软件开发</p></div> },
            { title: <div className="fn-clear tabsList"><img src={loginUrl[4]} /><p>软件开发</p></div> },
            { title: <div className="fn-clear tabsList"><img src={loginUrl[5]} /><p>软件开发</p></div> },
            { title: <div className="fn-clear tabsList"><img src={loginUrl[6]} /><p>软件开发</p></div> },
            { title: <div className="fn-clear tabsList"><img src={loginUrl[7]} /><p>软件开发</p></div> },
        ];
        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#fff',
                    height: 8,
                }}
            />
        );
        let index = this.state.res.length - 1;
        const row = (rowData, sectionID, rowID) => {
            if (index < 0) {
                index = this.state.res.length - 1;
            }
            const obj = this.state.res[index--];
            return (
                <div key={rowID}>
                    <div className="items">
                        <div className="itemsTop">
                            <div className="itemsTopPic fn-left">
                                <img src={loginUrl[8]} alt="" />
                            </div>
                            <div className="itemsTopRight">
                                <p>
                                    <span className="fn-left" style={{ fontSize: '16px' }}>Mia Zhang <i className="iconfont icon-xingbienv_f" style={{ color: "#F46353", fontWeight: "800", fontSize: "12px" }}></i></span>
                                    <span className="fn-right personalMsg"><i className="iconfont icon-dingwei"></i>0.76km</span>
                                </p>
                                <p className="personalMsg">
                                    <span>优秀设计师</span> | <span>10年经验</span> | <span>6件作品</span> | <span>31人喜欢</span>
                                </p>
                            </div>
                        </div>
                        <div className="itemPicList">
                            <ul>
                                <li>
                                    <a href="#">
                                        <img src={obj.img} alt="" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src={obj.img} alt="" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src={obj.img} alt="" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src={obj.img} alt="" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>    
                </div> 
            );
        };

        return (
            <div className="homeWrap">
                <div className="homeWrapTop">
                    <div className="indexNav">
                        <NavBar
                            mode="light"
                            onLeftClick={() => hashHistory.goBack()}
                            rightContent={[
                                <div className="searchAll">
                                    <i className="iconfont icon-icon05"></i>
                                </div>
                            ]}
                        ><Link to="/city"><i className="iconfont icon-dingwei"></i>山景路666号</Link></NavBar>
                    </div>
                    <div className="hometabs">
                        <Tabs tabs={tabs}
                            tabBarBackgroundColor="transparent"
                            tabBarUnderlineStyle={{ display: "none" }}
                            onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                        >

                        </Tabs>
                    </div>
                </div>
                <div className="homeWrapMain">
                    {/* <div className="items">
                        <div className="itemsTop">
                            <div className="itemsTopPic fn-left">
                                <img src={loginUrl[8]} alt="" />
                            </div>
                            <div className="itemsTopRight">
                                <p>
                                    <span className="fn-left" style={{fontSize: '16px'}}>Mia Zhang <i className="iconfont icon-xingbienv_f" style={{color: "#F46353", fontWeight: "800", fontSize: "12px"}}></i></span>
                                    <span className="fn-right personalMsg"><i className="iconfont icon-dingwei"></i>0.76km</span>
                                </p>
                                <p className="personalMsg">
                                    <span>优秀设计师</span> | <span>10年经验</span> | <span>6件作品</span> | <span>31人喜欢</span>
                                </p>
                            </div>
                        </div>
                        <div className="itemPicList">
                            <ul>
                                <li>
                                    <a href="#">
                                        <img src={this.state.res[0].img} alt="" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src={loginUrl[9]} alt="" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src={loginUrl[9]} alt="" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src={loginUrl[9]} alt="" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>         */}
                    <ListView
                        key={this.state.useBodyScroll ? '0' : '1'}
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}
                        // renderHeader={() => <span>Pull to refresh</span>}
                        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                            {this.state.isLoading ? 'Loading...' : 'Loaded'}
                        </div>)}
                        renderRow={row}
                        renderSeparator={separator}
                        useBodyScroll={this.state.useBodyScroll}
                        style={this.state.useBodyScroll ? {} : {
                            height: this.state.height,
                            margin: '5px 0',
                        }}
                        pullToRefresh={<PullToRefresh
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}
                        onEndReached={this.onEndReached}
                        pageSize={3}
                    />
                </div>
            </div>
        );
    }
}




