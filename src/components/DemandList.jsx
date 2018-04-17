import React from 'react'
import { List, InputItem, PullToRefresh, ListView, Toast, Button, NavBar, Icon,ActivityIndicator } from 'antd-mobile';
import { Link,hashHistory} from 'react-router';
import axios from 'axios';
import QueueAnim from 'rc-queue-anim';
import update from 'immutability-helper';
import { Motion, spring } from 'react-motion';

let realData = [];
let index = realData.length - 1;
let realDataLength = realData.length;

const NUM_ROWS = 10;
let pageIndex = 0;
const loginUrl = {
    "selec": require('../images/selec.png'),
}
export default class DemandList extends React.Component {
    constructor(props){
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            animating:false,
            dataSource: dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("demandData")) ? JSON.parse(sessionStorage.getItem("demandData")) : []),
            useBodyScroll:false,
            refreshing: false,
            isLoading: true,
            page:1,
            height:"",
            hasMore:false
        };
        this.genData = (pIndex = 0, realLength, data) => {
            let dataBlob = [];
            dataBlob = data;
            return dataBlob;
        };
        this.addheartlis = (res, para) => {   //点赞
            if (res.success) {
                let numStar = para.e.target.parentNode.children[1].innerText;
                let loveLis = this.state.res[para.idx].love_list;
                if (res.message.type == 'delete') {
                    loveLis.map((value, index) => {
                        if (res.message.nick_name == value.nick_name) {
                            loveLis.splice(index, 1);
                        }
                    })
                    para.e.target.style.color = "#333";
                    para.e.target.nextSibling.innerHTML = numStar - 1;
                    let newList = update(this.state.res, { [para.idx]: { love_list: { $set: loveLis } } });
                    this.setState({ res: newList })
                } else if (res.message.type == 'add') {
                    para.e.target.style.color = "#F95231";
                    para.e.target.nextSibling.innerHTML = numStar - 0 + 1;
                    loveLis.push(res.message);
                    let newList = update(this.state.res, { [para.idx]: { love_list: { $set: loveLis } } });
                    this.setState({ res: newList })
                }
            }
        };
        this.handleLoginSend = (res) => { 
            if (res.success) {
                realData = res.data.item_list;
                realDataLength = res.data.item_list.length;
                if (pageIndex == 0) {
                    this.rData = [];
                    this.rData = [...this.rData, ...this.genData(pageIndex++, realDataLength, realData)];
                    sessionStorage.setItem("demandData", JSON.stringify(realData));
                } else {
                    this.rData = [...this.rData, ...this.genData(pageIndex++, realDataLength, realData)];
                }

                const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.rData),
                    hasMore: res.data.total_pages > pageIndex ? true : false,
                    isLoading: res.data.total_pages > pageIndex ? true : false,
                    page: ++this.state.page,
                    height:hei,
                    res: this.state.dataSource.cloneWithRows(this.rData)._dataBlob.s1,
                });
                setTimeout(() => {
                    this.setState({
                        refreshing: false,
                        animating:false
                    })
                }, 300);
            } else {
                Toast.info(res.message, 2, null, false);
            }
        }
        
    }
    componentDidMount (){
        this.rData = this.genData();
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
        this.getProgectList(1);
    }
    componentDidUpdate() {
        if (this.state.useBodyScroll) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }
    }
    routerWillLeave(nextLocation) {  //离开页面
        pageIndex = 0;        
    }
    getProgectList(page,type = "add_time") {  
        this.setState({animating:true})
        axios({
            method: "POST",
            url: 'https://www.huakewang.com/hkw_newapi/get_project_list/0/'+type+'/0/0/10/'+page,
            // url: 'https://www.huakewang.com/hkw_newapi/get_project_list/0/' + type +'/120.219375/30.259244/10/'+page,
            data: {
                keycode:""
            }
        })
        .then((res)=>{
            this.handleLoginSend(res.data);
        })
        .catch((error) => {
            console.log(error.data);
        });

    }
    addHeart = (e, toId, rowID) => {    //点赞
        e.persist();
        runPromise("add_love", {
            id: toId,
            user_id: validate.getCookie('user_id'),
            model: "project"
        }, this.addheartlis, true, "post", { e: e, idx: rowID });
    }
    onRefresh = () => {   //顶部下拉刷新数据
        pageIndex = 0;
        this.setState({
            refreshing: true,
        });
        this.getProgectList(1);
    };
    onEndReached = (event) => {
        // load new data   数据加载完成
        if (!this.state.isLoading && !this.state.hasMore) {
            return;
        }
        this.getProgectList(this.state.page);
    };
    render() {
        const separator = (sectionID, rowID) => (   //这个是每个元素之间的间距
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#e2e2e2',
                    height: 8,
                }}
            />
        );
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                <div key={rowID}>
                    <div className="items">
                        <div className="itemsTop" style={{paddingRight:"0"}}>
                            <div className="itemsTopPic fn-left" onClick={() => {
                                hashHistory.push({
                                    pathname: '/designerHome',
                                    query: { userId: obj.uid }
                                })
                            }}>
                                <img src={obj.path_thumb ? obj.path_thumb : loginUrl.selec} alt="" />
                            </div>
                            <div className="itemsTopRight">
                                <p onClick={() => {
                                    hashHistory.push({
                                        pathname: '/designerHome',
                                        query: { userId: obj.uid }
                                    })
                                }}>
                                    <span className="fn-left" style={{ fontSize: '16px' }}>{obj.nick_name} 
                                        {obj.sex == '女' ? <i className="iconfont icon-xingbienv_f" style={{ color: '#F46353', fontWeight: "800", fontSize: "12px" }} /> : obj.sex == '男' ? <i className="iconfont icon-xingbienanxuanzhong" style={{ color: '#4DA7E0', fontWeight: "800", fontSize: "12px" }} /> : ""}
                                    </span>
                                </p>
                                <p className="personalMsg">
                                    <span>{obj.title}</span>
                                    <span className="fn-right personalMsg">
                                        <i className="iconfont icon-dingwei"></i>&nbsp;
                                        {((obj.distance - 0) / 1000).toFixed(2) > 200 || ((obj.distance - 0) / 1000).toFixed(2) == 0 ? "[未知]" : ((obj.distance - 0) / 1000).toFixed(2)+'km'}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="itemPicList">
                            <div style={{padding:"10px 0 10px 0",lineHeight:"18px"}} onClick={()=>{
                                hashHistory.push({
                                    pathname: '/demandDetail',
                                    query: { demandId: obj.id, name: obj.nick_name }
                                })
                            }}>
                                <i style={{ color: "red" }}>预算：{obj.budget_price}</i>&nbsp;&nbsp;
                                {obj.content}
                            </div>
                            <div style={{ color: "#949494", overflow: "hidden", borderBottom: "1px dotted #dedcdc", marginBottom: "10px" }}>
                                <div style={{ float: "left", paddingTop: "4px" }}>
                                    <i className="iconfont icon-shijian2"></i>&nbsp;{obj.add_time_format}&nbsp;&nbsp;&nbsp;
                                    <i className="iconfont icon-yanjing" style={{ color:"#ccc"}}></i>&nbsp;{obj.hits}
                                </div>
                                <div style={{ float: "right" }}>
                                    <div style={{ display: "inline-block", paddingTop: "4px" }}>
                                        <i className="iconfont icon-Pingjia"
                                            onClick={(e) => {
                                                this.addHeart(e, obj.id, rowID);
                                            }}
                                            style={{
                                                fontSize: "14px",
                                                verticalAlign: "middle",
                                                color: obj.islove ? "#F95231" : "",
                                                position: "relative",
                                                top: "1px"
                                            }}
                                        ></i><span style={{marginLeft:"3px"}}>{obj.love_count}</span>&nbsp;&nbsp;&nbsp;
                                    </div>
                                    <div style={{
                                        display: "inline-block",
                                        paddingTop: "4px"
                                    }}
                                    onClick={(e) => {
                                        hashHistory.push({
                                            pathname: '/demandDetail',
                                            query: { demandId: obj.id,name:obj.nick_name }
                                        })
                                    }}>
                                        <i className="iconfont icon-liuyan"
                                            style={{
                                                fontSize: "14px",
                                                verticalAlign: "middle",
                                                position: "relative",
                                                top: "1px"
                                            }}
                                        ></i> <span>{obj.comment_count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="loveList" style={{ 
                            backgroundColor: "#f0f0f0", 
                            lineHeight: "0.75rem", 
                            display: obj.love_list.length > 0 ? "block" : "none" 
                        }}>
                            <i style={{ margin: "0 0 0 5px" }}></i>
                            <ul style={{ display: "inline-block" }}>
                                {
                                    obj.love_list.map((value, idx) => {
                                        return <li onClick={() => {
                                            hashHistory.push({
                                                pathname: '/designerHome',
                                                query: { userId: value.user_id }
                                            })
                                        }} style={{ float: "left", color: "#1199d2" }}>
                                            <img src={value.path_thumb ? value.path_thumb:loginUrl.selec} 
                                                style={{width:"0.5rem",height:"0.5rem",borderRadius:"50%",verticalAlign:"middle"}}
                                            />&nbsp;
                                        </li>
                                    })
                                } 觉得很赞
                            </ul>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle =>
                    <div style={{ ...interpolatingStyle, position: "relative" }}>
                        <div className="forgetNav">
                            <NavBar
                                mode="light"
                                icon={<Icon type="left" size="lg" color="#707070" />}
                                onLeftClick={() => hashHistory.goBack()}
                                // rightContent={[
                                //     <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
                                //     <i key="1" type="ellipsis" className="iconfont icon-shijian2" />,
                                // ]}
                            >项目</NavBar>
                        </div>
                        <div style={{height:"1.2rem"}}></div>
                        <div className="homeWrap">
                            <div className="mainwrap homeWrapMain">
                                <ListView
                                    key={this.state.useBodyScroll}
                                    ref={el => this.lv = el}
                                    dataSource={this.state.dataSource}
                                    renderFooter={() => (<div style={{ padding: "0 10px", textAlign: 'center' }}>
                                        {this.state.isLoading ? '加载中...' : '加载完成'}
                                    </div>)}
                                    style={{
                                        height: this.state.height,
                                        overflow: "auto"
                                    }}
                                    renderRow={row}
                                    renderSeparator={separator}
                                    useBodyScroll={this.state.useBodyScroll}
                                    pullToRefresh={<PullToRefresh
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />}
                                    onEndReached={this.onEndReached}
                                    pageSize={9}
                                />
                            </div>
                        </div>
                        <div className="toast-example">
                            <ActivityIndicator
                                toast
                                text="加载中..."
                                animating={this.state.animating}
                            />
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}





