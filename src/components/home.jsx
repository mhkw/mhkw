import React from 'react'
import { List, InputItem, NavBar, Tabs, PullToRefresh, ListView } from 'antd-mobile';
import { Link } from 'react-router';
import { createForm } from 'rc-form';
import QueueAnim from 'rc-queue-anim';
import axios from 'axios';
import '../css/font/iconfont.css';

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
let realData = [];
let index = realData.length - 1;
let realDataLength = realData.length;
let NUM_ROWS = 9;
let pageIndex = 0;

// function genData(pIndex = 0) {
//     const dataArr = [];
//     for (let i = 0; i < NUM_ROWS; i++) {
//         dataArr.push(`row - ${(pIndex * NUM_ROWS) + i}`);
//     }
//     return dataArr;
// }
const tabs = [
    { title: <div className="fn-clear tabsList"><img src={loginUrl[0]} /><p>附近</p></div> },
    { title: <div className="fn-clear tabsList"><img src={loginUrl[1]} /><p>软件开发</p></div> },
    { title: <div className="fn-clear tabsList"><img src={loginUrl[2]} /><p>软件开发</p></div> },
    { title: <div className="fn-clear tabsList"><img src={loginUrl[3]} /><p>软件开发</p></div> },
    { title: <div className="fn-clear tabsList"><img src={loginUrl[4]} /><p>软件开发</p></div> },
    { title: <div className="fn-clear tabsList"><img src={loginUrl[5]} /><p>软件开发</p></div> },
    { title: <div className="fn-clear tabsList"><img src={loginUrl[6]} /><p>软件开发</p></div> },
    { title: <div className="fn-clear tabsList"><img src={loginUrl[7]} /><p>软件开发</p></div> },
];
const separator = (sectionID, rowID) => (   //每个元素之间的间距
    <div
        key={`${sectionID}-${rowID}`}
        style={{
            backgroundColor: '#fff',
            height: 8,
        }}
    />
);
const ItemPicLists = (props) => (
    <ul>
        {
            props.works_list.slice(0, 4).map(function (value, idx) {
                return <li>
                    <a href="#">
                        <img src={value.path + '!540x390'} alt="" />
                    </a>
                </li>
            })
        }
    </ul>
)

export default class LoginView extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource: dataSource.cloneWithRows({}),
            refreshing: true,
            isLoading: true,
            height: document.documentElement.clientHeight,
            useBodyScroll: true,
            res: [{
                path: 'http://huakewang.b0.upaiyun.com/2014/11/03/20141103220756424665.jpg!540x720',
                nick_name: 'Meet hotel',
                sex: "男",
                distance: "1.99km",
            },
            {
                path: 'http://huakewang.b0.upaiyun.com/2016/06/23/20160623200935905706.png!540x720',
                nick_name: 'McDonald',
                sex: "女",
                distance: "1.68km",
            },
            {
                path: 'http://huakewang.b0.upaiyun.com/2016/06/23/20160623200935905706.png!540x720',
                nick_name: 'McDonald',
                sex: "女",
                distance: "1.68km",
            },
            {
                path: 'http://huakewang.b0.upaiyun.com/2014/11/03/20141103220756424665.jpg!540x720',
                nick_name: 'McDonald',
                sex: "女",
                distance: "1.68km",
            }]
        };
        this.genData = (pIndex = 0, NUM_ROWS = 9, data) => {
            // console.log("输出pIndex,NUM_ROWS:::");
            // console.log(pIndex,NUM_ROWS);
            const dataBlob = {};
            for (let i = 0; i < NUM_ROWS; i++) {
                const ii = (pIndex * NUM_ROWS) + i;
                dataBlob[`${ii}`] = data[i];
            }
            return dataBlob;
        };
        this.handleSend = (res) => {
            if (res.success) {
                console.log(res, 1);
                console.log(res.data.item_list, 1);
                // this.setState({
                //     res: res.data.item_list
                // })
                realData = res.data.item_list;
                index = realData.length - 1;
                realDataLength = res.data.item_list.length;
                NUM_ROWS = realDataLength;
                this.rData = {...this.rData, ...this.genData(pageIndex++, realDataLength, res.data.item_list) };
                const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.rData),
                    height: hei,
                    refreshing: false,
                    isLoading: false,
                });
            } else {
                console.log(res, 0);
            }
        }
    }

    // componentDidUpdate() {
    //     if (this.state.useBodyScroll) {
    //         document.body.style.overflow = 'auto';
    //     } else {
    //         document.body.style.overflow = 'hidden';
    //     }
    // }

    // shouldComponentUpdate(){
    //     return (this.props.router.location.action === 'POP')
    // }

    componentDidMount() {
        runPromise("get_user_list_ex", {
            sort: "add_time",
            offices: "all",
            keywords: "艺术绘画",
            longitude: "0",
            latitude: "0",
            per_page: "9",
            page: "1"
        }, this.handleSend);
        // const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
        // setTimeout(() => {
        //     this.rData = genData();
        //     this.setState({
        //         dataSource: this.state.dataSource.cloneWithRows(genData()),
        //         height: hei,
        //         refreshing: false,
        //         isLoading: false,
        //     });
        // }, 500);
    }

    onRefresh = () => {   //顶部下拉刷新数据
        // this.setState({ refreshing: true, isLoading: true });
        // // simulate initial Ajax
        // setTimeout(() => {
        //     this.rData = genData();
        //     this.setState({
        //         dataSource: this.state.dataSource.cloneWithRows(this.rData),
        //         refreshing: false,
        //         isLoading: false,
        //     });
        // }, 600);
    };

    onEndReached = (event) => {
        // load new data   数据加载完成
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
        console.log('数据加载完成');
        // this.setState({ isLoading: true });
        // setTimeout(() => {
        //     this.rData = [...this.rData, ...genData(++pageIndex)];
        //     this.setState({
        //         dataSource: this.state.dataSource.cloneWithRows(this.rData),
        //         isLoading: false,
        //     });
        // }, 1000);
    };

    render() {
        // let index = this.state.res.length - 1;
        const row = (rowData, sectionID, rowID) => {
            if (index < 0) {
                index = this.state.res.length - 1;
            }
            // const obj = this.state.res[index--];
            const obj = rowData;
            console.log(obj)
            return (
                <div key={rowID}>
                    <div className="items">
                        <div className="itemsTop">
                            <div className="itemsTopPic fn-left">
                                <Link to="/">
                                    <img src={obj.path_thumb} alt="" />
                                </Link>
                            </div>
                            <div className="itemsTopRight">
                                <p>
                                    <span className="fn-left" style={{ fontSize: '16px' }}>
                                        {obj.nick_name} <i className={obj.sex == '男' ? 'iconfont icon-xingbienanxuanzhong' : 'iconfont icon-xingbienv_f'} 
                                            // style={{obj.sex} == '男'?'#4DA7E0':'#F46353' { color: , fontWeight: "800", fontSize: "12px" }}></i>
                                            style={obj.sex == '男' ? { color: '#4DA7E0', fontWeight: "800", fontSize: "12px" } : { color: '#F46353', fontWeight: "800", fontSize: "12px"}}></i>
                                    </span>
                                    <span className="fn-right personalMsg"><i className="iconfont icon-dingwei"></i>{obj.distance}km</span>
                                </p>
                                <p className="personalMsg">
                                    <span>{obj.group_name}</span> | <span>{obj.experience}</span> | <span>{obj.works_count}件作品</span> | <span>{obj.hits_count}人喜欢</span>
                                </p>
                            </div>
                        </div>
                        <div className="itemPicList">
                            <ItemPicLists works_list={obj.works_list} />
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
                            onLeftClick={() => hashHistory.go(-1)}
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
                    <ListView
                        key={this.state.useBodyScroll ? '0' : '1'}
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}
                        // renderHeader={() => <span>Pull to refresh</span>}
                        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                            {/* {this.state.isLoading ? 'Loading...' : 'Loaded'} */}
                            {console.log({row})}                            
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




