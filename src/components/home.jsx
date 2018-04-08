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
    require('../images/mainTop.png'),
]
let realData = [];
let tabs = [];
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
            dataSource: dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("fstdata")) ? JSON.parse(sessionStorage.getItem("fstdata")) : {}),
            refreshing: false,
            isLoading: true,
            keywords:"",
            height: document.documentElement.clientHeight,
            useBodyScroll: true,
            res: [],
            tabsData: JSON.parse(sessionStorage.getItem("designer_tree")) || [],
            page:1,
            hasMore:true,
            keyArray:["附近","艺术绘画","品牌建设","互联网设计","产品设计","空间设计","虚拟现实","多媒体","程序开发","其他设计"],
            currentIdx:0
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
        this.handleSend = (res) => {
            if (res.success) {
                realData = res.data.item_list;
                index = realData.length - 1;
                realDataLength = res.data.item_list.length;
                NUM_ROWS = realDataLength;
                if (pageIndex == 0){
                    this.rData = {};
                    this.rData = { ...this.rData, ...this.genData(++pageIndex, realDataLength, realData) };
                    sessionStorage.setItem("fstdata", JSON.stringify(realData));
                }else{
                    this.rData = { ...this.rData, ...this.genData(++pageIndex, realDataLength, realData) };
                }
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.rData),
                    hasMore: res.data.total_pages > pageIndex ? true : false,
                    isLoading: true,
                    page:++this.state.page
                });
                setTimeout(() => {
                    this.setState({
                        refreshing: false
                    })
                }, 300);
            } else {
                console.log(res);
            }
        },
        this.getPicsLis = (res) =>{
            if(res.success) {
                sessionStorage.setItem("designer_tree", JSON.stringify(res.data));
                this.setState({
                    tabsData: res.data
                },()=>{
                    tabs = [{ title: <div className="fn-clear tabsList"><img src={loginUrl[0]} /><p>附近</p></div> }];
                    for (let i = 0; i < this.state.tabsData.length; i++) {
                        let src = this.state.tabsData[i].path; //未被点击的样式
                        if (this.state.currentIdx > 0 && i == this.state.currentIdx - 1) {
                            src = this.state.tabsData[this.state.currentIdx - 1].path1; //点击的样式
                        }
                        tabs.push({
                            title: <div className="fn-clear tabsList" dataSrc={this.state.tabsData[i].path1}>
                                <img id={"img" + i} src={src} /><p>{this.state.tabsData[i].category_name}</p></div>
                        })
                    }
                })
                
            }else{
                console.log(res);
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
    // componentWillReceiveProps(nextProps) {
    //     // changeKeyWord =(idx)=>{
    //     //     keywords: this.state.keyArray[index]
    //     // }
    // }
    // shouldComponentUpdate(){
    //     // return (this.props.router.location.action === 'POP')
    // }

    componentWillMount() {
        if (this.props.HOCState.Home.currentIdx) {
            this.setState({
                currentIdx: this.props.HOCState.Home.currentIdx
            })
        }
    }
    componentDidMount() {
        this.getWorkList(this.state.keyArray[this.state.currentIdx],1);
        if (!sessionStorage.getItem("designer_tree")) {
            runPromise("get_designer_tree", null, this.getPicsLis,false,"get");
        }

        tabs = [{ title: <div className="fn-clear tabsList"><img src={loginUrl[0]} /><p>附近</p></div> }];
        for (let i = 0; i < this.state.tabsData.length; i++) {
            let src = this.state.tabsData[i].path; //未被点击的样式
            if (this.state.currentIdx > 0 && i == this.state.currentIdx - 1 ) {
                src = this.state.tabsData[this.state.currentIdx -1].path1; //点击的样式
            }
            tabs.push({
                title: <div className="fn-clear tabsList" dataSrc={this.state.tabsData[i].path1}>
                    <img id={"img" + i} src={src} /><p>{this.state.tabsData[i].category_name}</p></div>
            })
        }
    }

    onRefresh = () => {   //顶部下拉刷新数据
        pageIndex = 0;
        this.setState({
            refreshing: true,
            isLoading: true 
        })
        this.getWorkList(this.state.keyArray[this.state.currentIdx],1);
    };

    onEndReached = (event) => {
        // load new data   数据加载完成
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (!this.state.isLoading && !this.state.hasMore) {
            return ;
        };
        // this.setState({ isLoading: true });
        this.getWorkList(this.state.keyArray[this.state.currentIdx], this.state.page);
    };
    
    changeUserList  (tab,index) {
        pageIndex = 0;
        if (this.state.currentIdx){
            let Idx = this.state.currentIdx - 1;
            let currentBg = this.state.tabsData[Idx].path;
            let change = document.getElementById("img" + Idx);
            change.src = currentBg;
        }
        this.setState({currentIdx : index});
        this.props.propsSetState('Home', { currentIdx: index });
        console.log(index);
        let idx = index-1;
        let currentImg = document.getElementById("img"+idx);
        idx<0?"":currentImg.src = tab.title.props.dataSrc;
        this.getWorkList(this.state.keyArray[index], 1);
    }
    getWorkList = (keywords,page) => {
        runPromise("get_user_list_ex", {
            sort: "add_time",
            offices: "all",
            keywords: keywords,
            longitude: this.props.HOCState.Address ? this.props.HOCState.Address.lon : "0" ,
            latitude: this.props.HOCState.Address ? this.props.HOCState.Address.lat : "0",
            per_page: "8",
            page: page
        }, this.handleSend, false, "post");
    }
    //选择某个设计师后将信息通过props回调传给HOC
    selectDesignerToHOC = (obj) => {
        let { path_thumb, path, nick_name, sex, txt_address, experience, works_count, comment_count, id } = obj;
        this.props.propsSetState('Designer', {
            path_thumb,
            path,
            nick_name,
            sex,
            txt_address,
            experience,
            works_count,
            comment_count,
            // id,
            id: 69590,
        });
    }
    render() {
        // let index = this.state.res.length - 1;
        const row = (rowData, sectionID, rowID) => {
            // if (index < 0) {
            //     index = this.state.res.length - 1;
            // }
            // const obj = this.state.res[index--];
            const obj = rowData;
            return (
                <div key={rowID}>
                    <div className="items" onClick={() => { this.selectDesignerToHOC(obj) }}>
                        <PersonalMsg 
                            path_thumb={obj.path_thumb} 
                            nick_name={obj.nick_name} 
                            sex={obj.sex} 
                            distance={obj.distance}  
                            txt_address={obj.txt_address}
                            group_name={obj.group_name}
                            experience={obj.experience}
                            works_count={obj.works_count}
                            hits_count={obj.hits_count}
                            // id={obj.id}
                            id={69590}
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
                <div className="homeWrapTop" style={{
                    background: "url("+loginUrl[10]+") no-repeat center center / 100% 100%"
                    }}>
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
                        ><Link to="/address" className="index-address"><i className="iconfont icon-dingwei"></i>{this.props.HOCState.Address ? (this.props.HOCState.Address.currentLocation ? this.props.HOCState.Address.currentLocation : '未定位') : '未定位'}</Link></NavBar>
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
                                this.changeUserList(tab,index);
                            }}
                            initialPage={this.state.currentIdx ? this.state.currentIdx : 0}
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
                            {this.state.isLoading ? 'Loading...' : 'Loaded'}
                        </div>)}
                        renderRow={row}
                        renderSeparator={separator}
                        distanceToRefresh={1}
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
                        pageSize={8}
                        scrollRenderAheadDistance={100}
                    />
                </div>
            </div>
        );
    }
}




