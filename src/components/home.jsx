import React from 'react'
import { List, InputItem, NavBar, Tabs, PullToRefresh, ListView } from 'antd-mobile';
import { Link } from 'react-router';
import { createForm } from 'rc-form';
import QueueAnim from 'rc-queue-anim';
import { ItemPicLists, PersonalMsg } from './templateHomeCircle';

import axios from 'axios';
import '../css/font/iconfont.css';

const loginUrl = [
    require('../images/home/locs.png'),
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

let tabs = [
    
];
let index = realData.length - 1;
let realDataLength = realData.length;
let NUM_ROWS = 8;
let pageIndex = 0;

const separator = (sectionID, rowID) => (   //每个元素之间的间距
    <div
        key={`${sectionID}-${rowID}`}
        style={{
            backgroundColor: '#fff',
            height: 8,
        }}
    />
);

export default class HomeView extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource: dataSource.cloneWithRows({}),
            refreshing: false,
            isLoading: false,
            keywords:"",
            height: document.documentElement.clientHeight,
            useBodyScroll: true,
            res: [],
            tabsData:[],
            page:1,
            hasMore:true,
            keyArray:["附近","艺术绘画","品牌建设","互联网设计","产品设计","空间设计","虚拟现实","多媒体","程序开发","其他设计"]
        };
        
        this.genData = (pIndex = 0, NUM_ROWS, data) => {
            const dataBlob = {};
            for (let i = 0; i < NUM_ROWS; i++) {
                const ii = (pIndex * NUM_ROWS) + i;
                dataBlob[`${ii}`] = data[i];
            }
            return dataBlob;
        };
        this.changeTabBgPic = (index,tab) => {
            let lis = document.querySelectorAll(".tabsList");
        }
        this.handleSend = (res,fg) => {
            if (res.success) {
                console.log(res, fg);
                if(fg == 'a') {
                    realData = res.data.item_list;
                    index = realData.length - 1;
                    realDataLength = res.data.item_list.length;
                    NUM_ROWS = realDataLength;
                    this.rData = { ...this.rData, ...this.genData(pageIndex++, realDataLength, res.data.item_list) };
                    // const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.rData),
                        // height: hei,
                        hasMore: res.data.total_pages > pageIndex ? true : false,
                        refreshing: false,
                        isLoading: false,
                        page:++this.state.page
                    });
                }else if(fg == "b"){
                    this.setState({
                        tabsData:res.data
                    })
                    tabs = [{ title: <div className="fn-clear tabsList"><img src={loginUrl[0]} /><p>附近</p></div> }];
                    for (let i = 0; i < this.state.tabsData.length;i++) {
                        tabs.push({ 
                            title: <div className="fn-clear tabsList" data-src={this.state.tabsData[i].path1}><img src={this.state.tabsData[i].path} /><p>{this.state.tabsData[i].category_name}</p></div> 
                        })
                    }
                }
            } else {
                console.log(res, 0);
            }
        }
    }

    componentDidUpdate() {
        if (this.state.useBodyScroll) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }
    }
    componentWillReceiveProps(nextProps) {
        // changeKeyWord =(idx)=>{
        //     keywords: this.state.keyArray[index]
        // }
    }
    shouldComponentUpdate(){
        return (this.props.router.location.action === 'POP')
    }

    componentDidMount() {
        runPromise("get_user_list_ex", {
            sort: "add_time",
            offices: "all",
            keywords: this.state.keywords,
            longitude: "0",
            latitude: "0",
            per_page: "8",
            page: "1"
        }, this.handleSend,false,"post","a");
        runPromise("get_designer_tree", null, this.handleSend,false,"get","b");
    }

    onRefresh = () => {   //顶部下拉刷新数据
        runPromise("get_user_list_ex", {
            sort: "add_time",
            offices: "all",
            keywords: this.state.keywords,
            longitude: "0",
            latitude: "0",
            per_page: "8",
            page: "1"
        }, this.handleSend, false, "post", "a");
    };

    onEndReached = (event) => {
        // load new data   数据加载完成
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        };
        console.log('加载下一页的数据');
        this.setState({ isLoading: true });
        runPromise("get_user_list_ex", {
            sort: "add_time",
            offices: "all",
            keywords: this.state.keywords,
            longitude: "0",
            latitude: "0",
            per_page: "8",
            page: this.state.page
        }, this.handleSend, false, "post", "a");
    };
    changeUserList  (index) {
        this.setState({ keywords: this.state.keyArray[index] });
        setTimeout(() => {
            runPromise("get_user_list_ex", {
                sort: "add_time",
                offices: "all",
                keywords: this.state.keywords,
                longitude: "0",
                latitude: "0",
                per_page: "8",
                page: "1"
            }, this.handleSend, false, "post", "a");
        }, 200);
    }
    render() {
        // let index = this.state.res.length - 1;
        const row = (rowData, sectionID, rowID) => {
            if (index < 0) {
                index = this.state.res.length - 1;
            }
            // const obj = this.state.res[index--];
            const obj = rowData;
            return (
                <div key={rowID}>
                    <div className="items">
                        <PersonalMsg 
                            path_thumb={obj.path_thumb} 
                            nick_name={obj.nick_name} 
                            sex={obj.sex} 
                            distance={obj.distance}  
                            group_name={obj.group_name}
                            experience={obj.experience}
                            works_count={obj.works_count}
                            hits_count={obj.hits_count}
                        />
                        <div className="itemPicList">
                            <ItemPicLists 
                                works_list={obj.works_list} 
                            />
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
                                <Link to="/search">
                                    <div className="searchAll">
                                        <i className="iconfont icon-icon05"></i>
                                    </div>
                                </Link>
                            ]}
                        ><Link to="/city"><i className="iconfont icon-dingwei"></i>山景路666号</Link></NavBar>
                    </div>
                    <div className="hometabs">
                        <Tabs tabs={tabs}
                            useOnPan = {true}
                            distanceToChangeTab={0.8}
                            animated = {true}
                            tabBarBackgroundColor="transparent"
                            tabBarUnderlineStyle={{ display: "none",color:"red" }}
                            // renderTab={(tab)=>{
                            //     console.log(tab)
                            // }}
                            onTabClick={(tab, index) => { 
                                // this.setState({keywords:this.state.keyArray[index]}); 
                                this.changeUserList(index);
                            }}
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
                        renderFooter={() => (<div style={{ padding: 20, textAlign: 'center' }}>
                            {/* {this.state.isLoading ? 'Loading...' : 'Loaded'} */}
                        </div>)}
                        renderRow={row}
                        renderSeparator={separator}
                        distanceToRefresh={5}
                        useBodyScroll={this.state.useBodyScroll}
                        style={this.state.useBodyScroll ? {} : {
                            height: "30px",
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




