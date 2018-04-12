import React from 'react';
import { hashHistory } from 'react-router';
import { Tabs, SearchBar, Badge, ListView, Toast, NavBar, Icon, PullToRefresh, TextareaItem } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import { ItemPicLists, PersonalMsg } from './templateHomeCircle';
import axios from "axios";
import qs from "qs"
import update from 'immutability-helper';

let realData1 = [];
let realData2 = [];
let realDataLength1 = realData1.length;
let realDataLength2 = realData2.length;
let pageIndex1 = 0;
let pageIndex2 = 0;
const loginUrl = {
    "banner01": require('../images/banner01.jpg'),
    "banner02": require('../images/banner02.jpg'),
    "banner03": require('../images/banner03.jpg'),
    "work": require('../images/work_draw_new.png'),
    "tiezi": require('../images/tiezi_draw_new.png'),
    "essay": require('../images/essay_draw_new.png'),
    "demand": require('../images/demand_draw_new.png'),
    "selec": require('../images/selec.png'),
}
const separator = (sectionID, rowID) => (   //每个元素之间的间距
    <div
        key={`${sectionID}-${rowID}`}
        style={{
            backgroundColor: '#fff',
            height: 8,
        }}
    />
);
export default class Collect extends React.Component {
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
            dataSource1: dataSource.cloneWithRows([]),            
            dataSource2: dataSource.cloneWithRows([]),             
            refreshing: false,
            isLoading: true,
            hasMore: false,
            useBodyScroll:false,
            searchResult:{},
            imgHeight: 176,
            tabnum : "",
            size:0,
            page:1,
            page1:1,
            height1:"",
            height2:"",
            showReplyInput: false,       //输入框显示
            res: [],
            res1: [],
            love_list: [],
            placeholderWords: "留言：",
            commentToId: "",        //发帖人id
            commentId: "",         //文章id
            content: "",
            keyCode: "-1",            //索引
            sendBtnStatus: false,       //留言
            replySendStatus: false,    //回复还是留言
            rep_user_id: "",     //被回复人的id
            comment_id: "",      //回复的回复id
            replay_name: ""     //给..回复
        };
        this.handleSearchDes = (res) => {
            if (res.success) {
                realData1 = res.data.item_list;
                realDataLength1 = res.data.item_list.length;
                if (pageIndex1 == 0) {
                    this.rData1 = [];
                    this.rData1 = [...this.rData1, ...this.genData(pageIndex1++, realDataLength1, realData1)];
                    // sessionStorage.setItem("searchDesigner", JSON.stringify(realData1));
                } else {
                    this.rData1 = [...this.rData1, ...this.genData(pageIndex1++, realDataLength1, realData1)];
                }
                const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight * 2;
                this.setState({
                    dataSource1: this.state.dataSource1.cloneWithRows(this.rData1),
                    hasMore: res.data.is_next_page ? true : false,
                    isLoading: res.data.is_next_page ? true : false,
                    page: ++this.state.page,
                    height1: hei
                });
                setTimeout(() => {
                    this.setState({
                        refreshing: false
                    })
                }, 300);
            } else {
                if (res.message == "会话已失效，请重新登录") {
                    validate.setCookie({'user_id':''})
                    hashHistory.push({ pathname: "/login" })
                }else{
                    Toast.info(res.message, 2, null, false);
                }
            }
        }
        this.handleSearchWork = (res) => {
            if (res.success) {
                realData2 = res.data.item_list;
                realDataLength2 = res.data.item_list.length;
                if (pageIndex2 == 0) {
                    this.rData2 = [];
                    this.rData2 = [...this.rData2, ...this.genData(pageIndex2++, realDataLength2, realData2)];
                    // sessionStorage.setItem("searchWorks", JSON.stringify(realData2));
                } else {
                    this.rData2 = [...this.rData2, ...this.genData(pageIndex2++, realDataLength2, realData2)];
                }
                const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight * 2;
                this.setState({
                    dataSource2: this.state.dataSource2.cloneWithRows(this.rData2),
                    hasMore: res.data.is_next_page  ? true : false,
                    isLoading: res.data.is_next_page ? true : false,
                    page1: ++this.state.page1,
                    height2: hei
                });
                setTimeout(() => {
                    this.setState({
                        refreshing: false
                    })
                }, 300);
            } else {
                if (res.message == "会话已失效，请重新登录") {
                    validate.setCookie({ 'user_id': '' })
                    hashHistory.push({ pathname: "/login" })
                } else {
                    Toast.info(res.message, 2, null, false);
                }
            }
        }
        
    }

    componentDidMount() {
        this.rData1 = this.genData();
        this.rData2 = this.genData();
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
        this.getWorkList(1, 0)
    }
    shouldComponentUpdate() {
        return this.props.router.location.action === 'POP';
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
        console.log(pageIndex2);
        if (this.state.tabnum == 0){
            this.getWorkList(1, 0);
        } else if (this.state.tabnum == 1) {
            this.getWorkList(1, 1);
        } 
    };
    onEndReached = (event) => {
        if (!this.state.isLoading && !this.state.hasMore) {
            return;
        };
        if (this.state.tabnum == 0) {
            this.getWorkList(this.state.page, 0);
        } else if (this.state.tabnum == 1) {
            this.getWorkList(this.state.page1,1);
        }
    };
    getWorkList = (page,idx) => {
        if(idx == 0) {
            this.getUserSearch("user",page)
        } else if (idx == 1) {
            this.getWorksSearch("works", page)
        }
    }
    getUserSearch = (type, page) => {
        axios({
            method: "POST",
            url: 'https://www.huakewang.com/hkw_newapi/get_my_favorite_list/user/0/0/8/' + page,
            withCredentials: true,
            crossDomain: true,
            data: {
                user_id: validate.getCookie('user_id')
            }
        })
        .then((res) => {
            this.handleSearchDes(res.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    getWorksSearch = (type, page) => {  //获取作品列表
        axios({
            method: "POST",
            url: 'https://www.huakewang.com/hkw_newapi/get_my_favorite_list/works/0/0/8/' + page,
            withCredentials: true,
            crossDomain: true,
            data: {
                user_id:validate.getCookie('user_id')
            }
        })
            .then((res) => {
                this.handleSearchWork(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    addHeart = (e, toId, rowID,type) => {    //点赞
        e.persist();
        runPromise("add_love", {
            id: toId,
            user_id: validate.getCookie('user_id'),
            model: type
        }, this.addheartlis, true, "post", { e: e, idx: rowID, type: type });
    }
    onChangeReplyInput = (value) => {
        if (value.length > 0) {
            this.setState({
                sendBtnStatus: true,
                content: value
            })
        } else {
            this.setState({
                sendBtnStatus: false,
                content: value
            })
        }
    }
    onTouchSend = () => {
        if (this.state.sendBtnStatus && this.state.replySendStatus) {  //留言
            runPromise("add_comment", {
                type: "circle",               //works=作品；project=需求;news=文章;circle=帖子;
                user_id_to: this.state.commentToId,     //发布文章人的id
                user_id: validate.getCookie('user_id'),                         //评论人的id
                article_id: this.state.commentId,          //文章id
                content: this.state.content   //评论内容
            }, this.addcommentlis, true, "post");
        } else if (this.state.sendBtnStatus && !this.state.replySendStatus) {   //回复
            runPromise("rep_comment", {
                user_id: validate.getCookie('user_id'),     //回复人的id
                comment_id: this.state.comment_id,          //留言id
                content: this.state.content,                //评论内容
                rep_user_id: this.state.rep_user_id,       //被回复人的id
                rep_user_nick_name: this.state.replay_name  //被回复人名称
            }, this.addcommentlis, true, "post");
        }
    }
    toggleInput = (key, uid, id) => {
        if (key == this.state.keyCode) {
            this.setState({
                showReplyInput: !this.state.showReplyInput,
            }, () => { this.textarea.focus(); });
        } else if (key != this.state.keyCode && !this.state.showReplyInput) {
            this.setState({
                showReplyInput: !this.state.showReplyInput,
            }, () => { this.textarea.focus(); });
        } else if (key != this.state.keyCode && this.state.showReplyInput) {
            this.setState({
                showReplyInput: this.state.showReplyInput,
            }, () => { this.textarea.focus(); });
        };
        this.setState({
            commentToId: uid,
            commentId: id,
            keyCode: key,
            replySendStatus: true
        })
    }
    tabs = () => {
        return [
            { title: <Badge>设计师</Badge> },
            { title: <Badge>作品</Badge> }
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
            const obj = rowData.user_info;
            return (
                obj.userPageItemList.length > 0 ?
                <div key={rowID}>
                    <div className="items" onClick={() => { this.selectDesignerToHOC(obj) }}>
                        {
                            <div>
                                <PersonalMsg
                                    path_thumb={obj.path_thumb}
                                    nick_name={obj.nick_name}
                                    sex={obj.sex}
                                    distance={obj.distance ? obj.distance:0}
                                    txt_address={obj.txt_address}
                                    group_name={obj.group_name}
                                    experience={obj.experience}
                                    works_count={obj.works_count}
                                    hits_count={obj.hits_count}
                                    id={obj.id}
                                />
                                <div className="itemPicList">
                                    <ItemPicLists
                                        works_list={obj.userPageItemList}
                                    />
                                </div>
                            </div> 
                        }
                    </div>
                </div >:null
            ) 
        };
        const row2 = (rowData, sectionID, rowID) => {
            const obj = rowData.works_info;
            return (
                <div key={rowID} 
                    style={{ display: "inline-block", width: "50%", boxSizing: "border-box", padding: "5px" }} 
                    onClick={() => { this.handleClickWorksDetails(obj.id, obj) }}
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
                            className="top"
                        // rightContent={
                        //     <span onClick={(e) => { this.checkNeedMsg() }}>确定</span>
                        // }
                        >我的收藏</NavBar>
                    </div>
                    <Tabs tabs={this.tabs()}
                        initialPage={this.props.state.tab}
                        onChange={(tab, index) => { 
                            this.setState({ tabnum: index })
                            if (index == 0 && this.state.dataSource1._dataBlob.s1.length == 0  ) {
                                this.getWorkList(1,0)
                            } else if (index == 1 && this.state.dataSource2._dataBlob.s1.length == 0) {
                                this.getWorkList(1, 1)
                            } 
                        }}
                    >
                        <div className="homeWrap" style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                            <div className="homeWrapMain">
                                <div style={{ height: "2.4rem" }}></div>                            
                                <ListView
                                    key={this.state.useBodyScroll}
                                    ref={el => this.lv1 = el}
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
                                    scrollRenderAheadDistance={100}
                                />
                            </div>
                        </div>
                        <div className="homeWrap" style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', width: "100%", padding: "0 5px", boxSizing: "border-box" }}>
                            <div style={{ height: "2.4rem" }}></div> 
                            <ListView
                                key={this.state.useBodyScroll}
                                ref={el => this.lv2 = el}
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
                                scrollRenderAheadDistance={100}
                            />
                        </div>
                    </Tabs>
                </div>
            </QueueAnim>
        );
    }
}
