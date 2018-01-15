import React from 'react'
import { List, InputItem, NavBar, Tabs, PullToRefresh, ListView, Carousel, WhiteSpace, WingBlank } from 'antd-mobile';
import { Link } from 'react-router';
import { createForm } from 'rc-form';
import QueueAnim from 'rc-queue-anim';
import Promise, { } from 'promise'
import '../css/font/iconfont.css'

const loginUrl = {
    "touxiang": require('../images/touxiang.png'),
    "homePic": require('../images/homePic.png'),
    "banner01": require('../images/banner01.jpg'),
    "banner02": require('../images/banner02.jpg'),
    "banner03": require('../images/banner03.jpg'),
    "demand": require('../images/demand_draw_new.png'),
    "work": require('../images/work_draw_new.png'),
    "tiezi": require('../images/tiezi_draw_new.png'),
    "essay": require('../images/essay_draw_new.png')
}

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
            data: [loginUrl.banner01, loginUrl.banner02, loginUrl.banner03],
            imgHeight: 176,
            slideIndex: 0,
            dataSource,
            refreshing: true,
            isLoading: true,
            height: document.documentElement.clientHeight,
            useBodyScroll: true,
            res: [{
                img: 'http://huakewang.b0.upaiyun.com/2014/11/03/20141103220756424665.jpg!540x720',
                title: '地方如果特特围绕区委',
                sex: "男",
                lng: "1.99km",
                time: "1分钟前"
            },
            {
                img: 'http://www.huakewang.com/uploads/2013/1031/20131031002147100933_thumb.jpg',
                title: '发给他然后突然佛挡杀佛请问',
                sex: "女",
                lng: "1.68km",
                time: "1分钟前"
            },
            {
                img: 'http://www.huakewang.com/uploads/2013/1031/20131031002147100933_thumb.jpg',
                title: '头发共同话题一月份问题还有热共同',
                sex: "女",
                lng: "1.68km",
                time: "1分钟前"
            },
            {
                img: 'http://www.huakewang.com/uploads/2013/1031/20131031002147100933_thumb.jpg',
                title: '还能发热我发的的上传电视广告',
                sex: "女",
                lng: "1.68km",
                time: "1分钟前"
            },
            {
                img: 'http://www.huakewang.com/uploads/2013/1031/20131031002147100933_thumb.jpg',
                title: '规划报告合伙人服务而',
                sex: "女",
                lng: "1.68km",
                time: "1分钟前"
            },
            {
                img: 'http://www.huakewang.com/uploads/2013/1031/20131031002147100933_thumb.jpg',
                title: '个人服务而非广泛认同',
                sex: "女",
                lng: "1.68km",
                time: "1分钟前"
            },
            {
                img: 'http://huakewang.b0.upaiyun.com/2014/11/03/20141103220756424665.jpg!540x720',
                title: '更方便是放到更惹人访问的房产大时代大范甘迪',
                sex: "女",
                lng: "1.68km",
                time: "1分钟前"
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
        }, 500);

        // setTimeout(() => {
        //     this.setState({
        //         data: [loginUrl[10], loginUrl[11], loginUrl[12]],
        //     });
        // }, 100);
    }

    onRefresh = () => {   //顶部下拉刷新数据
        this.setState({ refreshing: true, isLoading: true });
        // simulate initial Ajax
        setTimeout(() => {
            this.rData = genData();
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                refreshing: false,
                isLoading: false
            });
        }, 600);
    };

    onEndReached = (event) => {
        // load new data   数据加载完成
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
        const separator = (sectionID, rowID) => (   //这个是每个元素之间的间距
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
                                <img src={loginUrl.touxiang} alt="" />
                            </div>
                            <div className="itemsTopRight">
                                <p>
                                    <span className="fn-left" style={{ fontSize: '16px' }}>Bing Yuan <i className="iconfont icon-xingbienv_f" style={{
                                        color: "#F46353",
                                        fontWeight: "800",
                                        fontSize: "12px"
                                    }}></i></span>
                                    <span className="fn-right personalMsg">发布了帖子</span>
                                </p>
                                <p className="personalMsg">
                                    <span>前端开发</span> | <span>技术改变生活，能力提升品质</span>
                                </p>
                            </div>
                        </div>
                        <div className="itemPicList">
                            <p>{obj.title}</p>
                            <ul>
                                <li>
                                    <a href="">
                                        <img src={obj.img} alt="" />
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <img src={obj.img} alt="" />
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <img src={obj.img} alt="" />
                                    </a>
                                </li>
                                <li>
                                    <a href="" >
                                        <img src={obj.img} alt="" />
                                    </a>
                                </li>
                            </ul>
                            <div className="fn-clear" style={{ color: "#949494" }}>
                                <div style={{ float: "left" }}>{obj.time}</div>
                                <div style={{ float: "right" }}>
                                    <i className="iconfont icon-Pingjia" style={{ fontSize: "14px", verticalAlign: "middle" }}></i><span> 5</span>&nbsp;&nbsp;&nbsp;
                                    <i className="iconfont icon-liuyan" style={{ fontSize: "14px", verticalAlign: "middle" }}></i><span>12</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div className="homeWrap">
                <div className="lanternLis">
                    <WingBlank>
                        <Carousel
                            autoplay={true}
                            autoplayInterval={3000}
                            infinite
                            dotStyle={{ width: "6px", height: "6px" }}
                            dotActiveStyle={{ backgroundColor: "#fff", width: "10px", height: "6px", borderRadius: "3px" }}
                            selectedIndex={1}
                        >
                            {this.state.data.map(val => (
                                <a
                                    key={val}
                                    // href="http://www.alipay.com"
                                    style={{ display: 'inline-block' }}
                                >
                                    <img
                                        src={val}
                                        alt=""
                                        style={{ width: '100%', verticalAlign: 'top' }}
                                        onLoad={() => {
                                            // fire window resize event to change height
                                            window.dispatchEvent(new Event('resize'));
                                            this.setState({ imgHeight: 'auto' });
                                        }}
                                    />
                                </a>
                            ))}
                        </Carousel>
                    </WingBlank>
                    <div className="fourAvt">
                        <ul>
                            <li>
                                <Link>
                                    <img src={loginUrl.demand} />
                                    <p>项目</p>
                                </Link>
                            </li>
                            <li>
                                <Link>
                                    <img src={loginUrl.work} />
                                    <p>作品</p>
                                </Link>
                            </li>
                            <li>
                                <Link>
                                    <img src={loginUrl.tiezi} />
                                    <p>帖子</p>
                                </Link>
                            </li>
                            <li>
                                <Link>
                                    <img src={loginUrl.essay} />
                                    <p>活动</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="homeWrapMain" id="hkCircle">
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




