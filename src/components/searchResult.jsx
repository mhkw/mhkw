import React from 'react';
import { hashHistory } from 'react-router';
import { Tabs, SearchBar, Badge, ListView, Toast, NavBar, Icon ,PullToRefresh} from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import { ItemPicLists, PersonalMsg } from './templateHomeCircle';

let realData1 = [];
let realData2 = [];
let realDataLength1 = realData1.length;
let realDataLength2 = realData2.length;
let pageIndex1 = 0;
let pageIndex2 = 0;
const separator = (sectionID, rowID) => (   //每个元素之间的间距
    <div
        key={`${sectionID}-${rowID}`}
        style={{
            backgroundColor: '#fff',
            height: 8,
        }}
    />
);
export default class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.genData = (pIndex = 0, realLength, data) => {
            let dataBlob = [];
            dataBlob = data;
            return dataBlob;
        };
        this.state = {
            dataSource1: dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("searchDesigner")) ? JSON.parse(sessionStorage.getItem("searchDesigner")) : []),            
            dataSource2: dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("searchWorks")) ? JSON.parse(sessionStorage.getItem("searchWorks")) : []),            
            refreshing: false,
            isLoading: true,
            hasMore: false,
            useBodyScroll:false,
            tabnum : "",
            size:0,
            page:1,
            height1:"",
            height2:"",
            height3:"",
            height4:"",
        };
        this.handleSearchDes = (res) => {
            console.log(res);
            if (res.success) {
                if (res.success) {
                    realData1 = res.data.item_list;
                    realDataLength1 = res.data.item_list.length;
                    if (pageIndex1 == 0) {
                        this.rData = [];
                        this.rData = [...this.rData, ...this.genData(pageIndex1++, realDataLength1, realData1)];
                        sessionStorage.setItem("searchDesigner", JSON.stringify(realData1));
                    } else {
                        this.rData = [...this.rData, ...this.genData(pageIndex1++, realDataLength1, realData1)];
                    }
                    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
                    this.setState({
                        dataSource1: this.state.dataSource1.cloneWithRows(this.rData),
                        hasMore: res.data.total_pages > this.state.page ? true : false,
                        isLoading: res.data.total_pages > this.state.page ? true : false,
                        page:++this.state.page,
                        height1:hei
                    });
                    setTimeout(() => {
                        this.setState({
                            refreshing: false
                        })
                    }, 300);
                } else {
                    Toast.info(res.message, 2, null, false);
                }
            }
        }
        this.handleSearchWork = (res) => {
            console.log(res);
            if (res.success) {
                if (res.success) {
                    realData2 = res.data.item_list;
                    realDataLength2 = res.data.item_list.length;
                    if (pageIndex2 == 0) {
                        this.rData = [];
                        this.rData = [...this.rData, ...this.genData(pageIndex2++, realDataLength2, realData2)];
                        sessionStorage.setItem("searchWorks", JSON.stringify(realData2));
                    } else {
                        this.rData = [...this.rData, ...this.genData(pageIndex2++, realDataLength2, realData2)];
                    }
                    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
                    this.setState({
                        dataSource2: this.state.dataSource2.cloneWithRows(this.rData),
                        hasMore: res.data.total_count > this.state.size ? true : false,
                        isLoading: res.data.total_count > this.state.size ? true : false,
                        size:this.state.size+8,
                        height2:hei
                    });
                    setTimeout(() => {
                        this.setState({
                            refreshing: false
                        })
                    }, 300);
                } else {
                    Toast.info(res.message, 2, null, false);
                }
            }
        }
    }

    componentDidMount() {
        this.rData = this.genData();
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
        runPromise('search', {
            keycode: this.props.location.query.keyword,
            longitude: 0,
            latitude: 0,
        }, ()=>{}, false, "post");
        this.setState({ tab: this.props.location.query.tab})

        this.getWorkList(this.props.location.query.keyword, this.props.location.query.tab == 1 ? "8":"1", this.props.location.query.tab)

    }
    routerWillLeave(nextLocation) {  //离开页面
        pageIndex1 = 0;
        pageIndex2 = 0;
    }
    onRefresh = () => {   //顶部下拉刷新数据
        pageIndex1 = 0;
        pageIndex2 = 0;
        this.setState({
            refreshing: true,
            isLoading: true
        })
        if(this.state.tabnum == 0){
            this.getWorkList(this.props.location.query.keyword, 1, this.state.tabnum || this.props.location.query.tab);
        }else if(this.state.tabnum == 1) {
            this.getWorkList(this.props.location.query.keyword, 8, this.state.tabnum || this.props.location.query.tab);
        } else if (this.state.tabnum == 2) {
            // this.getWorkList(this.props.location.query.keyword, 8, this.state.tabnum || this.props.location.query.tab);
        } else if (this.state.tabnum == 3) {
            
        }
    };

    onEndReached = (event) => {
        if (!this.state.isLoading && !this.state.hasMore) {
            return;
        };
        if (this.state.tabnum == 0) {
            this.getWorkList(this.props.location.query.keyword, this.state.page, this.state.tabnum || this.props.location.query.tab);
        } else if (this.state.tabnum == 1) {
            this.getWorkList(this.props.location.query.keyword, this.state.size, this.state.tabnum || this.props.location.query.tab);
        }
    };
    getWorkList = (keywords,page,idx) => {
        this.setState({
            tabnum:idx
        })
        if(idx == 0) {
            this.getUserSearch(keywords,page)
        }else if(idx == 1) {
            this.getWorksSearch(keywords,page)
        }
    }
    getUserSearch = (keywords, page) => {
        runPromise("get_user_list_ex", {
            sort: "add_time",
            offices: "all",
            keywords: keywords,
            longitude: "0",
            latitude: "0",
            per_page: "8",
            page: page
        }, this.handleSearchDes, false, "post");
    }
    getWorksSearch = (keywords, size) => {
        runPromise("get_works_list_ex", {
            firstid: 148,
            sort: "add_time",
            keyword: keywords,
            offset: 0,                     //从第几个开始
            limit: size       //每次请求数量
        }, this.handleSearchWork, false, "post");
    }
    tabs = () => {
        return [
            { title: <Badge>设计师</Badge> },
            { title: <Badge>作品</Badge> },
            { title: <Badge>帖子</Badge> },
            { title: <Badge>需求</Badge> },
        ];
    }
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
            id
        });
    }
    handleClickWorksDetails = (works_id, designer) => {
        // let { path_thumb, nick_name, id } = designer;
        let { path_thumb, path, nick_name, sex, txt_address, experience, works_count, comment_count, id } = designer;
        this.props.propsSetState('Designer', {
            path_thumb,
            nick_name,
            id,
            path,
            sex,
            txt_address,
            experience,
            works_count,
            comment_count,
        });
        hashHistory.push({
            pathname: '/worksDetails',
            query: {
                form: 'workList',
                works_id,
            },
        });
    }
    render() {
        const row1 = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                obj.works_list ?
                <div key={rowID}>
                    <div className="items" onClick={() => { this.selectDesignerToHOC(obj) }}>
                        {
                            <div>
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
                                />
                                <div className="itemPicList">
                                    <ItemPicLists
                                        works_list={obj.works_list}
                                    />
                                </div>
                            </div> 
                        }
                        
                    </div>
                </div >: null
            ) 
        };
        const row2 = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                <div key={rowID} 
                    style={{ display: "inline-block", width: "50%", boxSizing: "border-box", padding: "5px" }} 
                    onClick={() => { this.handleClickWorksDetails(obj.id, obj.user_info) }}
                >
                    <div className="items" style={{
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                        borderRadius: "3px",
                        backgroundColor: "#f5f5f5",
                        boxShadow: "0px 0px 10px #ccc",
                    }}>
                        <div>
                            <img src={obj.path_thumb ? obj.path_thumb : obj.path} style={{ width: "100%", height: "5rem" }} />
                            <div style={{ height: "26px", overflow: "hidden" }}>
                                <p className="exlips" style={{ lineHeight: "24px", padding: "0 4px" }}>{obj.title}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <QueueAnim>
                <div className="searchIpt">
                    <div className="forgetNav" key="1">
                        <NavBar
                            mode="light"
                            icon={<Icon type="left" size="lg" color="#707070" />}
                            onLeftClick={() => hashHistory.goBack()}
                        // rightContent={
                        //     <span onClick={(e) => { this.checkNeedMsg() }}>确定</span>
                        // }
                        >搜索结果</NavBar>
                    </div>
                    <Tabs tabs={this.tabs()}
                        initialPage={this.props.state.tab}
                        onChange={(tab, index) => { console.log('onChange', index, tab); }}
                        onTabClick={(tab, index) => { 
                            index == 0 && this.state.dataSource1.length>0?null:this.getWorkList(this.props.location.query.keyword,index==1?"8":"1",index) 
                        }}
                    >
                        <div className="homeWrap" style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                            <div className="homeWrapMain">
                                <div style={{ height: "2.4rem" }}></div>                            
                                <ListView
                                    key={this.state.useBodyScroll}
                                    ref={el => this.lv = el}
                                    dataSource={this.state.dataSource1}
                                    renderFooter={() => (<div style={{ padding: "0 10px", textAlign: 'center' }}>
                                        {this.state.isLoading ? '加载中...' : '加载完成'}
                                    </div>)}
                                    style={{
                                        height: this.state.height1,
                                        width:"100%",
                                        overflow: "auto"
                                    }}
                                    renderRow={row1}
                                    useBodyScroll={this.state.useBodyScroll}
                                    pullToRefresh={<PullToRefresh
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />}
                                    onEndReached={()=>{this.onEndReached()}}
                                    pageSize={8}
                                    scrollRenderAheadDistance={500}
                                />
                            </div>
                        </div>
                        <div className="homeWrap" style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', width: "100%", padding: "0 5px", boxSizing: "border-box" }}>
                            <div style={{ height: "2.4rem" }}></div> 
                            <ListView
                                key={this.state.useBodyScroll}
                                ref={el => this.lv = el}
                                dataSource={this.state.dataSource2}
                                renderFooter={() => (<div style={{ padding: "0 10px", textAlign: 'center' }}>
                                    {this.state.isLoading ? '加载中...' : '加载完成'}
                                </div>)}
                                style={{
                                    height: this.state.height2,
                                    width: "100%",
                                    overflow: "auto"
                                }}
                                renderRow={row2}
                                useBodyScroll={this.state.useBodyScroll}
                                pullToRefresh={<PullToRefresh
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                                onEndReached={() => { this.onEndReached() }}
                                pageSize={8}
                                scrollRenderAheadDistance={500}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>

                        </div>
                    </Tabs>
                    
                </div>
            </QueueAnim>
        );
    }
}
