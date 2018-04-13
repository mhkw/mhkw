import React from 'react';
import { hashHistory } from 'react-router';
import { Tabs, SearchBar, Badge, ListView, Toast, NavBar, Icon, PullToRefresh, TextareaItem, ActivityIndicator } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import { ItemPicLists, PersonalMsg } from './templateHomeCircle';
import axios from "axios";
import update from 'immutability-helper';

let realData1 = [];
let realData2 = [];
let realData3 = [];
let realData4 = [];
let realDataLength1 = realData1.length;
let realDataLength2 = realData2.length;
let realDataLength3 = realData3.length;
let realDataLength4 = realData3.length;
let pageIndex1 = 0;
let pageIndex2 = 0;
let pageIndex3 = 0;
let pageIndex4 = 0;
const loginUrl = {
    "banner01": require('../images/banner01.jpg'),
    "banner02": require('../images/banner02.jpg'),
    "banner03": require('../images/banner03.jpg'),
    "demand": require('../images/demand_draw_new.png'),
    "work": require('../images/work_draw_new.png'),
    "tiezi": require('../images/tiezi_draw_new.png'),
    "essay": require('../images/essay_draw_new.png'),
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
            dataSource1: dataSource.cloneWithRows([]),            
            dataSource2: dataSource.cloneWithRows([]),            
            dataSource3: dataSource.cloneWithRows([]),            
            dataSource4: dataSource.cloneWithRows([]),            
            refreshing: false,
            isLoading: true,
            hasMore: false,
            useBodyScroll:false,
            searchResult:{},
            imgHeight: 176,
            tabnum: "",
            animating1: false,
            animating2: false,
            animating3: false,
            animating4: false,
            size:0,
            page:1,
            page1:1,
            page2:1,
            height1:"",
            height2:"",
            height3:"",
            height4:"",
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
                    hasMore: res.data.total_pages > this.state.page ? true : false,
                    isLoading: res.data.total_pages > this.state.page ? true : false,
                    page: ++this.state.page,
                    height1: hei,
                    animating1: false
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
                    hasMore: res.data.total_count > this.state.size ? true : false,
                    isLoading: res.data.total_count > this.state.size ? true : false,
                    size: this.state.size + 8,
                    height2: hei,
                    animating2: false
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
        

        this.handleSend = (res) => {
            if (res.success) {
                realData3 = res.data.item_list;
                realDataLength3 = res.data.item_list.length;
                if (pageIndex3 == 0) {
                    this.rData3 = [];
                    this.rData3 = [...this.rData3, ...this.genData(pageIndex3++, realDataLength3, realData3)];
                    // sessionStorage.setItem("resdata", JSON.stringify(demandWorks));
                } else {
                    this.rData3 = [...this.rData3, ...this.genData(pageIndex3++, realDataLength3, realData3)];
                }
                const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight * 2;
                this.setState({
                    dataSource3: this.state.dataSource3.cloneWithRows(this.rData3),
                    hasMore: res.data.is_next_page ? true : false,
                    isLoading: res.data.is_next_page ? true : false,
                    page1: ++this.state.page1,
                    height3: hei,
                    res: this.state.dataSource3.cloneWithRows(this.rData3)._dataBlob.s1,
                    animating3: false
                });
                setTimeout(() => {
                    this.setState({
                        refreshing: false
                    })
                }, 300);
            } else {
                console.log(res);
            }
        }
        this.handleLoginSend = (res) => {
            if (res.success) {
                realData4 = res.data.item_list;
                realDataLength4 = res.data.item_list.length;
                if (pageIndex4 == 0) {
                    this.rData4 = [];
                    this.rData4 = [...this.rData4, ...this.genData(pageIndex4++, realDataLength4, realData4)];
                } else {
                    this.rData4 = [...this.rData4, ...this.genData(pageIndex4++, realDataLength4, realData4)];
                }

                const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight * 2;
                this.setState({
                    dataSource4: this.state.dataSource4.cloneWithRows(this.rData4),
                    hasMore: res.data.total_pages > pageIndex4 ? true : false,
                    isLoading: res.data.total_pages > pageIndex4 ? true : false,
                    page2: ++this.state.page2,
                    height4: hei,
                    res1: this.state.dataSource4.cloneWithRows(this.rData4)._dataBlob.s1,
                    animating4: false
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
        this.addheartlis = (res, para) => {   //点赞
            if (res.success) {
                let numStar = para.e.target.parentNode.children[1].innerText;
                let loveLis;
                if(para.type == "circle"){
                    loveLis = this.state.res[para.idx].love_list;
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
                } else {
                    loveLis = this.state.res1[para.idx].love_list;
                    if (res.message.type == 'delete') {
                        loveLis.map((value, index) => {
                            if (res.message.nick_name == value.nick_name) {
                                loveLis.splice(index, 1);
                            }
                        })
                        para.e.target.style.color = "#333";
                        para.e.target.nextSibling.innerHTML = numStar - 1;
                        let newList = update(this.state.res1, { [para.idx]: { love_list: { $set: loveLis } } });
                        this.setState({ res1: newList })
                    } else if (res.message.type == 'add') {
                        para.e.target.style.color = "#F95231";
                        para.e.target.nextSibling.innerHTML = numStar - 0 + 1;
                        loveLis.push(res.message);
                        let newList = update(this.state.res1, { [para.idx]: { love_list: { $set: loveLis } } });
                        this.setState({ res1: newList })
                    }
                }
                
            }
        }
        this.addcommentlis = (req) => {
            if (req.success) {
                let wrap = document.createElement("div");
                let domLi = document.createElement('li');
                let innerSpan = document.createElement('span');
                let innerI = document.createElement('i');
                if (!this.state.replySendStatus) {        //回复
                    innerSpan.innerHTML = decodeURIComponent(validate.getCookie('user_name')) + '回复:' + this.state.replay_name;
                    innerI.innerHTML = this.state.content;
                    domLi.appendChild(innerSpan);
                    domLi.appendChild(innerI);
                    wrap.appendChild(domLi);
                    let currentLi = document.getElementById("rowid" + this.state.keyCode);
                    currentLi.appendChild(wrap);
                } else {                           //留言
                    innerSpan.innerHTML = req.data.nick_name;
                    innerI.innerHTML = req.data.comment_content;
                    domLi.appendChild(innerSpan);
                    domLi.appendChild(innerI);
                    wrap.appendChild(domLi);
                    let currentLi = document.getElementById("rowid" + this.state.keyCode);
                    currentLi.appendChild(wrap);
                }
            }
        }
    }

    componentDidMount() {
        this.rData1 = this.genData();
        this.rData2 = this.genData();
        this.rData3 = this.genData();
        this.rData4 = this.genData();
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
        runPromise('search', {
            keycode: this.props.location.query.keyword,
            longitude: 0,
            latitude: 0,
        }, (req)=>{this.setState({searchResult:req.data})}, false, "post");

        this.setState({ tabnum: this.props.state.tab || this.props.location.query.tab})
        
        this.getWorkList(this.props.state.keywords || this.props.location.query.keyword, this.props.state.tab == 1 ? "8":"1", this.props.state.tab)

    }
    routerWillLeave(nextLocation) {  //离开页面
        pageIndex1 = 0;
        pageIndex2 = 0;
        pageIndex3 = 0;
        pageIndex4 = 0;
    }
    onRefresh = () => {   //顶部下拉刷新数据
        pageIndex1 = 0;
        pageIndex2 = 0;
        pageIndex3 = 0;
        pageIndex4 = 0;
        this.setState({
            refreshing: true,
            isLoading: true
        })
        if (this.state.tabnum == 0){
            this.getWorkList(this.props.state.keywords || this.props.location.query.keyword, 1, this.state.tabnum);
        } else if (this.state.tabnum == 1) {
            this.getWorkList(this.props.state.keywords || this.props.location.query.keyword, 8, this.state.tabnum);
        } else if (this.state.tabnum == 2) {
            this.getWorkList(this.props.state.keywords || this.props.location.query.keyword, 1, this.state.tabnum);
        } else if (this.state.tabnum == 3) {
            this.getWorkList(this.props.state.keywords || this.props.location.query.keyword, 1, this.state.tabnum);            
        }
    };
    onEndReached = (event) => {
        if (!this.state.isLoading && !this.state.hasMore) {
            return;
        };
        if (this.state.tabnum == 0) {
            this.getWorkList(this.props.state.keywords || this.props.location.query.keyword, this.state.page, this.state.tabnum);
        } else if (this.state.tabnum == 1) {
            this.getWorkList(this.props.state.keywords || this.props.location.query.keyword, this.state.size, this.state.tabnum);
        } else if (this.state.tabnum == 2) {
            this.getWorkList(this.props.state.keywords || this.props.location.query.keyword, this.state.page1, this.state.tabnum);
        } else if (this.state.tabnum == 3) {
            this.getWorkList(this.props.state.keywords || this.props.location.query.keyword, this.state.page2, this.state.tabnum);
        }
    };
    getWorkList = (keywords,page,idx) => {
        if(idx == 0) {
            this.setState({ animating1: true })
            this.getUserSearch(keywords,page)
        } else if (idx == 1) {
            this.setState({ animating2: true })
            this.getWorksSearch(keywords, page)
        } else if (idx == 2) {
            this.setState({animating3:true})
            this.getNoticeList(keywords, page)
        }else if(idx == 3){
            this.setState({animating4:true})
            this.getProgectList(keywords, page)
        }
    }
    getUserSearch = (keywords, page) => {
        runPromise("get_user_list_ex", {    //获取设计师列表
            sort: "add_time",
            offices: "all",
            keywords: keywords,
            longitude: "0",
            latitude: "0",
            per_page: "8",
            page: page
        }, this.handleSearchDes, false, "post");
    }
    getWorksSearch = (keywords, size) => {  //获取作品列表
        runPromise("get_works_list_ex", {
            firstid: 148,
            sort: "add_time",
            offset: 0,                     //从第几个开始
            limit: size,      //每次请求数量
            keyword: keywords,
        }, this.handleSearchWork, false, "post");
    }
    getNoticeList = (keywords,page) => {
        runPromise("get_circle_list", {        //获取帖子列表
            user_id: '0',
            per_page: "8",
            page: page,
            keyword: keywords,
        }, this.handleSend, false, "get");
    }
    getProgectList(keywords,page) {        //项目
        axios({
            method: "POST",
            url: 'https://www.huakewang.com/hkw_newapi/get_project_list/0/add_time/0/0/8/' + page,
            data: {
                keycode: keywords
            }
        })
        .then((res) => {
            this.handleLoginSend(res.data);
        })
        .catch((error) => {
            console.log(error.data);
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
            { title: <Badge>作品</Badge> },
            { title: <Badge>帖子</Badge> },
            { title: <Badge>需求</Badge> }
            // { title: <Badge text={this.state.searchResult.user_total_count}>设计师</Badge> },
            // { title: <Badge text={this.state.searchResult.works_total_count}>作品</Badge> },
            // { title: <Badge text={this.state.searchResult.circle_total_count}>帖子</Badge> },
            // { title: <Badge text={this.state.searchResult.project_total_count}>需求</Badge> }
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
        const row3 = (rowData, sectionID, rowID) => {
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
                                    <span className="fn-left" style={{ fontSize: '16px' }}>{obj.nick_name}
                                        {obj.sex == '女' ? <i className="iconfont icon-xingbienv_f" style={{ color: '#F46353', fontWeight: "800", fontSize: "12px" }} /> : obj.sex == '男' ? <i className="iconfont icon-xingbienanxuanzhong" style={{ color: '#4DA7E0', fontWeight: "800", fontSize: "12px" }} /> : ""}
                                    </span>
                                    <span className="fn-right personalMsg">发布了帖子</span>
                                </p>
                                <p className="personalMsg">
                                    <span>{obj.job_name}</span> | <span>{obj.company}</span>
                                </p>
                            </div>
                        </div>
                        <div className="itemPicList">
                            <p>{obj.content}</p>
                            <ul>
                                {
                                    obj.attachment_list ? obj.attachment_list.map((value, idx) => {
                                        return idx < 6 ? <li>
                                            <a href="javascript:;">
                                                <img src={value.path_thumb} alt="" style={{ height: "100%" }} />
                                            </a>
                                        </li> : ""
                                    }) : ""
                                }
                            </ul>
                            <div style={{ color: "#949494", overflow: "hidden", borderBottom: "1px dotted #dedcdc", marginBottom: "10px" }}>
                                <div style={{ float: "left", paddingTop: "4px" }}>{obj.add_time_format}</div>
                                <div style={{ float: "right" }}>
                                    <div style={{ display: "inline-block", paddingTop: "4px" }}>
                                        <i className="iconfont icon-Pingjia"
                                            onClick={(e) => {
                                                this.addHeart(e, obj.id, rowID,"circle");
                                            }}
                                            style={{
                                                fontSize: "14px",
                                                verticalAlign: "middle",
                                                color: obj.islove ? "#F95231" : "",
                                                position: "relative",
                                                top: "1px"
                                            }}
                                        ></i><span style={{ marginLeft: "3px" }}>{obj.love_count}</span>&nbsp;&nbsp;&nbsp;
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
                        <div className="itemsBtm">
                            <div className="loveList" style={{ backgroundColor: "#f0f0f0", lineHeight: "0.75rem", display: obj.love_list.length > 0 ? "block" : "none" }}>
                                {/* <i className="iconfont icon-Pingjia" style={{ position: "relative", top: "2px", margin: "0 5px" }}></i> */}
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
                                                <img src={value.path_thumb ? value.path_thumb : loginUrl.selec}
                                                    style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", verticalAlign: "middle" }}
                                                />&nbsp;
                                            </li>
                                        })
                                    } 觉得很赞
                                </ul>
                            </div>
                            <div className="commentList" style={{ marginTop: "8px", display: obj.comment_data.comment_list.length > 0 ? "block" : "none" }}>
                                <ul id={"rowid" + rowID}>
                                    {
                                        obj.comment_data.comment_list.map((value, idx) => {
                                            return <div>
                                                <li onClick={() => {
                                                    this.setState({
                                                        placeholderWords: "回复：" + value.nick_name,
                                                        showReplyInput: true,
                                                        replySendStatus: false,
                                                        keyCode: rowID,
                                                        comment_id: value.id,
                                                        rep_user_id: value.user_id_from,
                                                        replay_name: value.nick_name
                                                    }, () => {
                                                        this.textarea.focus();
                                                    })
                                                }}>
                                                    <span >{value.nick_name}: </span>
                                                    {value.content ? value.content : value.comment_content}
                                                </li>
                                                {
                                                    value.commentrep_data && value.commentrep_data.commentrep_list.length > 0 ?
                                                        value.commentrep_data.commentrep_list.map((val) => {
                                                            return val.content ? <li onClick={() => {
                                                                this.setState({
                                                                    placeholderWords: "回复：" + val.nick_name,
                                                                    showReplyInput: true,
                                                                    replySendStatus: false,
                                                                    keyCode: rowID,
                                                                    comment_id: val.comment_id,
                                                                    rep_user_id: val.user_id,
                                                                    replay_name: val.nick_name
                                                                }, () => {
                                                                    this.textarea.focus();
                                                                })
                                                            }}>
                                                                {
                                                                    val.nick_name_to ? <span>{val.nick_name}回复:{val.nick_name_to} </span> :
                                                                        <span>{val.nick_name}: </span>
                                                                }
                                                                {val.content ? val.content : val.comment_content}
                                                            </li> : ""
                                                        }) : ""
                                                }
                                            </div>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };
        const row4 = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                <div key={rowID}>
                    <div className="items">
                        <div className="itemsTop" style={{ paddingRight: "0" }}>
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
                                        {((obj.distance - 0) / 1000).toFixed(2) > 200 || ((obj.distance - 0) / 1000).toFixed(2) == 0 ? "[未知]" : ((obj.distance - 0) / 1000).toFixed(2) + 'km'}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="itemPicList">
                            <div style={{ padding: "10px 0 10px 0", lineHeight: "18px" }} onClick={() => {
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
                                    <i className="iconfont icon-yanjing" style={{ color: "#ccc" }}></i>&nbsp;{obj.hits}
                                </div>
                                <div style={{ float: "right" }}>
                                    <div style={{ display: "inline-block", paddingTop: "4px" }}>
                                        <i className="iconfont icon-Pingjia"
                                            onClick={(e) => {
                                                this.addHeart(e, obj.id, rowID,"project");
                                            }}
                                            style={{
                                                fontSize: "14px",
                                                verticalAlign: "middle",
                                                color: obj.islove ? "#F95231" : "",
                                                position: "relative",
                                                top: "1px"
                                            }}
                                        ></i><span style={{ marginLeft: "3px" }}>{obj.love_count}</span>&nbsp;&nbsp;&nbsp;
                                    </div>
                                    <div style={{
                                        display: "inline-block",
                                        paddingTop: "4px"
                                    }}
                                        onClick={(e) => {
                                            hashHistory.push({
                                                pathname: '/demandDetail',
                                                query: { demandId: obj.id, name: obj.nick_name }
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
                                            <img src={value.path_thumb ? value.path_thumb : loginUrl.selec}
                                                style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", verticalAlign: "middle" }}
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
                        >搜索结果</NavBar>
                    </div>
                    <Tabs tabs={this.tabs()}
                        initialPage={this.props.state.tab}
                        onChange={(tab, index) => { 
                            this.setState({ tabnum: index })
                            this.props.setState({ tab: index })
                            if ((index == 0 && this.state.dataSource1._dataBlob.s1.length == 0) ||
                                (index == 2 && this.state.dataSource3._dataBlob.s1.length == 0) ||
                                (index == 3 && this.state.dataSource4._dataBlob.s1.length == 0)) {
                                this.getWorkList(this.props.location.query.keyword, "1", index)
                            } else if (index == 1 && this.state.dataSource2._dataBlob.s1.length == 0) {
                                this.getWorkList(this.props.location.query.keyword, "8", index)
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
                        <div className="homeWrap" style={{ alignItems: 'center', justifyContent: 'center',  backgroundColor: '#fff' }}>
                            <div className="lanternLis">
                                <div className="homeWrapMain" id="hkCircle">
                                    <div style={{ height: "2.4rem" }}></div> 
                                    <ListView
                                        key={1}
                                        ref={el => this.lv = el}
                                        dataSource={this.state.dataSource3}
                                        renderFooter={() => (<div style={{ padding: "0 10px", textAlign: 'center' }}>
                                            {this.state.isLoading ? '加载中...' : '加载完成'}
                                        </div>)}
                                        renderRow={row3}
                                        renderSeparator={separator}
                                        useBodyScroll={false}
                                        pullToRefresh={<PullToRefresh
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />}
                                        style={{
                                            height: this.state.height3,
                                            width: "100%",
                                            overflow: "auto"
                                        }}
                                        onEndReached={this.onEndReached}
                                        pageSize={8}
                                        scrollRenderAheadDistance={100}                                        
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="homeWrap" style={{ alignItems: 'center', justifyContent: 'center',  backgroundColor: '#fff' }}>
                            <div className="mainwrap homeWrapMain">
                                <div style={{ height: "2.4rem" }}></div> 
                                <ListView
                                    key={this.state.useBodyScroll}
                                    ref={el => this.lv = el}
                                    dataSource={this.state.dataSource4}
                                    renderFooter={() => (<div style={{ padding: "0 10px", textAlign: 'center' }}>
                                        {this.state.isLoading ? '加载中...' : '加载完成'}
                                    </div>)}
                                    style={{
                                        height: this.state.height4,
                                        overflow: "auto",
                                        width:"100%"
                                    }}
                                    renderRow={row4}
                                    renderSeparator={separator}
                                    useBodyScroll={this.state.useBodyScroll}
                                    pullToRefresh={<PullToRefresh
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />}
                                    onEndReached={this.onEndReached}
                                    pageSize={8}
                                />
                            </div>
                        </div>
                    </Tabs>
                    <div className="popup-comment-input-box "
                        // style={{ "display": this.state.showReplyInput ? "block" : "none" }}
                        style={{ "visibility": this.state.showReplyInput ? "visible" : "hidden" }}
                    >
                        <TextareaItem
                            id="abc"
                            className="comment-input"
                            autoHeight
                            ref={(temp) => { this.textarea = temp; }}
                            placeholder={this.state.placeholderWords}
                            maxLength="100"
                            value={this.state.content}
                            onChange={this.onChangeReplyInput}
                            onBlur={() => { this.setState({ showReplyInput: false }) }}
                            onFocus={() => { this.setState({ showReplyInput: true }) }}
                        />
                        <span className="send-btn  demand-send-btn" ref="abcd"
                            style={this.state.sendBtnStatus ? {
                                "border": "1px solid #0e80d2",
                                "background-color": "#409ad6",
                                "color": "#fff",
                            } : {}}
                            onTouchStart={this.onTouchSend}
                        >发送</span>
                    </div>
                    <div className="toast-example">
                        <ActivityIndicator
                            toast
                            text="Loading..."
                            animating={this.state.animating1}
                        />
                    </div>
                    <div className="toast-example">
                        <ActivityIndicator
                            toast
                            text="Loading..."
                            animating={this.state.animating3}
                        />
                    </div>
                    <div className="toast-example">
                        <ActivityIndicator
                            toast
                            text="Loading..."
                            animating={this.state.animating2}
                        />
                    </div>
                    <div className="toast-example">
                        <ActivityIndicator
                            toast
                            text="Loading..."
                            animating={this.state.animating4}
                        />
                    </div>
                </div>
            </QueueAnim>
        );
    }
}
