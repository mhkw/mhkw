import React from 'react'
import { List, InputItem, NavBar, Tabs, PullToRefresh, ListView } from 'antd-mobile';
import { Link, hashHistory } from 'react-router';
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

let scrollTop = 0;

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
            currentIdx:0,
            showBackToTop: false,
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
                // console.log( "pageIndex:: " + pageIndex);
                
                if (pageIndex == 0){
                    this.rData = {};
                    this.rData = { ...this.rData, ...this.genData(++pageIndex, realDataLength, realData) };
                    sessionStorage.setItem("fstdata", JSON.stringify(realData));
                }else{
                    this.rData = { ...this.rData, ...this.genData(++pageIndex, realDataLength, realData) };

                    let storageFstdata = sessionStorage.getItem("fstdata");
                    if (storageFstdata && JSON.parse(storageFstdata).length > 0) {
                        realData = [...JSON.parse(storageFstdata), ...realData];
                        sessionStorage.setItem("fstdata", JSON.stringify(realData));
                        
                    }
                }
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.rData),
                    hasMore: res.data.total_pages > pageIndex ? true : false,
                    // isLoading: true,
                    isLoading: res.data.total_pages > pageIndex ? true : false,
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
    routerWillLeave(nextLocation) {
        document.body.style.overflow = 'inherit';
        // pageIndex = 0;
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    }
    componentWillMount() {
        if (this.props.HOCState.Home.currentIdx) {
            this.setState({
                currentIdx: this.props.HOCState.Home.currentIdx
            })
        }
    }
    componentDidMount() {
        this.props.setShowTabBar(true);
        // app2 update
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
        if (!sessionStorage.getItem("fstdata")) {
            pageIndex = 0;
            // console.log("getWorkList componentDidMount");
            
            this.getWorkList(this.state.keyArray[this.state.currentIdx], 1);            
        }
        this.lv.scrollTo(0, scrollTop)
        // this.getWorkList(this.state.keyArray[this.state.currentIdx],1);
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

    onRefresh = () => {   
        //顶部下拉刷新数据
        sessionStorage.removeItem("fstdata"); //下拉刷新时把缓存数据也清空吧
        pageIndex = 0;
        this.setState({
            refreshing: true,
            isLoading: true
        })
        // console.log("getWorkList onRefresh");
        this.getWorkList(this.state.keyArray[this.state.currentIdx],1);
    };

    onEndReached = (event) => {
        // load new data   数据加载完成
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (!this.state.isLoading && !this.state.hasMore) {
            return ;
        };
        // this.setState({ isLoading: true });
        // console.log("getWorkList onEndReached");
        // this.getWorkList(this.state.keyArray[this.state.currentIdx], this.state.page);
        this.getWorkList(this.state.keyArray[this.state.currentIdx], pageIndex); 
    };
    onScroll = (e) => {

        let newScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        
        if (Math.abs(newScrollTop - scrollTop) > 20) {
            this.props.setShowTabBar(!(newScrollTop > scrollTop && newScrollTop > 500))
        }

        this.setState({
            showBackToTop: newScrollTop > 500,
        },()=>{
            scrollTop = newScrollTop;
        });
        
    }
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
        // console.log(index);
        let idx = index-1;
        let currentImg = document.getElementById("img"+idx);
        idx<0?"":currentImg.src = tab.title.props.dataSrc;
        // console.log("getWorkList changeUserList");
        this.getWorkList(this.state.keyArray[index], 1);
    }
    getWorkList = (keywords,page) => {
        // console.log("get_user_list_ex");
        // console.log(this.props.HOCState.Address.lon);
        // console.log(this.props.HOCState.Address.lat);
        
        
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
        let { path_thumb, path, nick_name, sex, txt_address, experience, works_count, comment_count, id, hxid } = obj;
        this.props.propsSetState('Designer', {
            path_thumb,
            path,
            nick_name,
            sex,
            txt_address,
            experience,
            works_count,
            comment_count,
            id,
            hxid,
        });
    }
    clickSelectAddress = () => {
        hashHistory.push({
            pathname: '/address',
            query: { form: 'Address' },
        });
    }
    clickBackToTop = () => {
        cancelAnimationFrame(this.toTopTimer);
        let then = this;
        this.toTopTimer = requestAnimationFrame(function fn() {
            var oTop = document.body.scrollTop || document.documentElement.scrollTop;
            if (oTop > 0) {
                let stepper = 60;
                if (oTop > 1000) {
                    stepper = 200;
                } 
                if (oTop > 2000) {
                    stepper = 300;
                }
                if (oTop > 3000) {
                    stepper = 400;
                }
                if (oTop > 4000) {
                    stepper = 500;
                }
                if (oTop > 5000) {
                    stepper = 600;
                }
                document.body.scrollTop = document.documentElement.scrollTop = oTop - stepper;
                then.toTopTimer = requestAnimationFrame(fn);
            } else {
                cancelAnimationFrame(then.toTopTimer);
            }
        });
    }
    touchStartBackToTop = (ref) => {
        ref.style.opacity = 0.5;
    }
    touchEndBackToTop = (ref) => {
        ref.style.opacity = 1;
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
                            id={obj.id}
                            // id={69590}
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

        let initialListSize = 8;
        let storageFstdata = sessionStorage.getItem("fstdata");
        if (storageFstdata && JSON.parse(storageFstdata).length > 0) {
            initialListSize = JSON.parse(storageFstdata).length;
        }

        return (
            <div className="homeWrap">
                <div className="homeWrapTop" style={{
                    background: "url("+loginUrl[10]+") no-repeat center center / 100% 100%"
                    }}>
                    <div className="indexNav">
                        <NavBar
                            mode="light"
                            // onLeftClick={() => hashHistory.goBack()}
                            rightContent={[
                                <Link to="/search">
                                    <div className="searchAll">
                                        <i className="iconfont icon-icon05"></i>
                                    </div>
                                </Link>
                            ]}
                        ><span onClick={this.clickSelectAddress} className="index-address"><i className="iconfont icon-dingwei"></i>{this.props.HOCState.Address ? (this.props.HOCState.Address.currentLocation ? this.props.HOCState.Address.currentLocation : '未定位') : '未定位'}</span></NavBar>
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
                    <div ref={(ref) => { this.backToTopRef = ref }} onTouchEnd={()=>{ this.touchEndBackToTop(this.backToTopRef) }} onTouchStart={() => { this.touchStartBackToTop(this.backToTopRef) }} onClick={this.clickBackToTop} style={{"display": this.state.showBackToTop ? "block" : "none"}} className="back-to-top"><img className="back-to-top-img" src={require("../images/backTop.png")} /></div>
                    <ListView
                        key={this.state.useBodyScroll ? '0' : '1'}
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}
                        // renderHeader={() => <span>Pull to refresh</span>}
                        renderFooter={() => (<div style={{ padding: 20, textAlign: 'center' }}>
                            {this.state.isLoading ? '加载中...' : '加载完成'}
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
                        scrollRenderAheadDistance={900}
                        onEndReachedThreshold={10}
                        onScroll={this.onScroll}
                        scrollEventThrottle={200}
                        initialListSize={initialListSize}
                    />
                </div>
            </div>
        );
    }
}




