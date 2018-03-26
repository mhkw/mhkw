import React from 'react'
import { List, InputItem, PullToRefresh, ListView, Toast, Button, NavBar, Icon } from 'antd-mobile';
import { Link,hashHistory} from 'react-router';
import axios from 'axios';
import QueueAnim from 'rc-queue-anim';

import '../css/font/iconfont.css'

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
            dataSource: dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("demandData")) ? JSON.parse(sessionStorage.getItem("demandData")) : []),
            useBodyScroll:false,
            refreshing: false,
            isLoading: true,
            page:1,
            height:""
        };
        this.genData = (pIndex = 0, realLength, data) => {
            let dataBlob = [];
            dataBlob = data;
            return dataBlob;
        };
        this.handleLoginSend = (res) => { 
            console.log(res);
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
                        refreshing: false
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
            console.log(error.message);
        });
        // runPromise('get_project_list', {
        //     user_id:validate.getCookie('user_id') || 0,
        //     sort:"add_time",
        //     longitude:"0",
        //     latitude:"0",
        //     per_page:"5",
        //     page:page,
        //     keycode:""
        // }, this.handleLoginSend, false, "get");

    }
    onRefresh = () => {   //顶部下拉刷新数据
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
                    backgroundColor: '#fff',
                    height: 8,
                }}
            />
        );
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                <div key={rowID}>
                    <div className="items">
                        <div className="itemsTop">
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
                                    <span className="fn-left" style={{ fontSize: '16px' }}>{obj.nick_name} <i className="iconfont icon-xingbienv_f" style={{
                                        color: "#F46353",
                                        fontWeight: "800",
                                        fontSize: "12px"
                                    }}></i></span>
                                    
                                </p>
                                <p className="personalMsg">
                                    <span>{obj.title}</span>
                                    <span className="fn-right personalMsg">
                                        <i className="iconfont icon-dingwei"></i>
                                        {((obj.distance - 0) / 1000).toFixed(2) > 20 || ((obj.distance - 0) / 1000).toFixed(2) == 0 ? "[未知]" : ((obj.distance - 0) / 1000).toFixed(2)+'km'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="itemPicList">
                            <p>{obj.title}</p>
                            <div>
                                {obj.content}
                            </div>
                            <div style={{ color: "#949494", overflow: "hidden", borderBottom: "1px dotted #dedcdc", marginBottom: "10px" }}>
                                <div style={{ float: "left", paddingTop: "4px" }}>{obj.add_time_format}</div>
                                <div style={{ float: "right" }}>
                                    <div onClick={(e) => {
                                        this.addHeart(e, obj.id, rowID);
                                    }}
                                        style={{ display: "inline-block", paddingTop: "4px" }}>
                                        <i className="iconfont icon-Pingjia"
                                            style={{
                                                fontSize: "14px",
                                                verticalAlign: "middle",
                                                color: obj.islove ? "#F95231" : "",
                                                position: "relative",
                                                top: "1px"
                                            }}
                                        ></i> <span>{obj.love_count}</span>&nbsp;&nbsp;&nbsp;
                                    </div>
                                    <div style={{
                                        display: "inline-block",
                                        paddingTop: "4px"
                                    }}
                                        onClick={(e) => {
                                            this.toggleInput(rowID, obj.uid, obj.id);
                                            this.setState({ placeholderWords: "给" + obj.nick_name + "留言：" })
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
                    </div>
                </div>
            );
        };
        return (
            <QueueAnim 
                animConfig={[
                    { opacity: [1, 0], translateX: [0, 150] }
                ]}>
                    <div className="forgetNav" key="120">
                        <NavBar
                            mode="light"
                            icon={<Icon type="left" size="lg" color="#707070" />}
                            onLeftClick={() => hashHistory.goBack()}
                            // rightContent={[
                            //     <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
                            //     <i key="1" type="ellipsis" className="iconfont icon-shijian2" />,
                            // ]}
                        >需求</NavBar>
                    </div>
                    <div style={{height:"1.2rem"}}></div>
                    <div className="homeWrap ">
                        <div className="mainwrap homeWrapMain">
                            <ListView
                                key={this.state.useBodyScroll}
                                ref={el => this.lv = el}
                                dataSource={this.state.dataSource}
                                renderFooter={() => (<div style={{ padding: "0 10px", textAlign: 'center', marginBottom: "1.4rem" }}>
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
            </QueueAnim>
        );
    }
}





