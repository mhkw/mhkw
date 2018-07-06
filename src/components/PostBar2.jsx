import React from 'react'
import { NavBar, Icon, List, InputItem, PullToRefresh, ListView, Carousel, WingBlank, TextareaItem, Toast } from 'antd-mobile';
import { Link, hashHistory } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import { ItemPicLists, PersonalMsg } from './templateHomeCircle';

import update from 'immutability-helper';
import { Motion, spring } from 'react-motion';

const loginUrl = {
    "selec": require('../images/selec.png'),
}

let realData = [];
let index = realData.length - 1;
let realDataLength = realData.length;

// const NUM_ROWS = 7;
let NUM_ROWS = 5;
let pageIndex = 0;

let scrollTopCircle = 0;
let backToTopDoing = false;
export default class PostBar extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            data: [loginUrl.banner01, loginUrl.banner02, loginUrl.banner03],
            page:"1",
            imgHeight: 176,
            slideIndex: 0,
            // dataSource: dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("resdata2")) ? JSON.parse(sessionStorage.getItem("resdata2")) : []),
            dataSource: dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("resdata2")) ? JSON.parse(sessionStorage.getItem("resdata2")) : {}),
            refreshing: false,
            isLoading: true,
            useBodyScroll: false,
            showReplyInput:false,       //输入框显示
            // res: [],
            res: sessionStorage.getItem("resdata2") ? dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("resdata2")))._dataBlob.s1 : [],
            love_list:[],
            placeholderWords:"留言：",
            commentToId:"",        //发帖人id
            commentId:"",         //文章id
            content:"",
            keyCode:"-1",            //索引
            sendBtnStatus:false,       //留言
            replySendStatus:false,    //回复还是留言
            rep_user_id:"",     //被回复人的id
            comment_id:"",      //回复的回复id
            replay_name:"",     //给..回复
            showBackToTop: false,
        };
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
        // this.genData = (pIndex = 0, realLength, data) => {
        //     let dataBlob = [];
        //     dataBlob = data;
        //     return dataBlob;
        // };
        this.genData = (pIndex = 0, NUM_ROWS, data) => {
            const dataBlob = {};
            for (let i = 0; i < NUM_ROWS; i++) {
                const ii = (pIndex * NUM_ROWS) + i;
                dataBlob[`${ii}`] = data[i];
            }
            return dataBlob;
        };
        this.handleSend = (res) => {
            if(res.success) {
                realData = res.data.item_list;
                index = realData.length - 1;
                realDataLength = res.data.item_list.length;
                NUM_ROWS = realDataLength;
                // if (pageIndex == 0) {
                //     this.rData = [];
                //     this.rData = [ ...this.rData, ...this.genData(pageIndex++, realDataLength, realData) ];
                //     sessionStorage.setItem("resdata2", JSON.stringify(realData));
                // }else{
                //     this.rData = [ ...this.rData, ...this.genData(pageIndex++, realDataLength, realData) ];
                // }
                if (pageIndex == 0) {
                    this.rData = {};
                    this.rData = {...this.rData, ...this.genData(pageIndex++, realDataLength, realData)};
                    sessionStorage.setItem("resdata2", JSON.stringify(realData));
                } else {
                    this.rData = {...this.rData, ...this.genData(pageIndex++, realDataLength, realData)};

                    let storageFstdata = sessionStorage.getItem("resdata2");
                    if (storageFstdata && JSON.parse(storageFstdata).length > 0) {
                        realData = [...JSON.parse(storageFstdata), ...realData];
                        sessionStorage.setItem("resdata2", JSON.stringify(realData));

                    }
                }
                const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 25;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.rData),
                    hasMore: res.data.is_next_page ? true : false,
                    isLoading: res.data.is_next_page ? true : false,
                    page: ++this.state.page,
                    height: hei,
                    res: this.state.dataSource.cloneWithRows(this.rData)._dataBlob.s1,
                });
                setTimeout(() => {
                    this.setState({
                        refreshing: false                        
                    })
                }, 300);
            }else{
                console.log(res);
            }
        }
        this.addheartlis=(res,para)=>{   //点赞
            if(res.success) {
                let numStar = para.e.target.parentNode.children[1].innerText;
                let loveLis = this.state.res[para.idx].love_list;
                if(res.message.type == 'delete'){
                    loveLis.map((value,index)=>{
                        if (res.message.nick_name == value.nick_name){
                            loveLis.splice(index,1);
                        }
                    })
                    para.e.target.style.color = "#333";
                    para.e.target.nextSibling.innerHTML = numStar-1;
                    let newList = update(this.state.res, { [para.idx]: { love_list: { $set: loveLis } } });
                    this.setState({ res: newList})
                } else if (res.message.type == 'add') {
                    para.e.target.style.color = "#F95231";
                    para.e.target.nextSibling.innerHTML = numStar - 0 + 1;
                    loveLis.push(res.message);
                    let newList = update(this.state.res, { [para.idx]: { love_list: { $set: loveLis } } });
                    this.setState({ res: newList })
                }
            }
        }
        this.addcommentlis=(req)=>{
            if (req.success) {
                let wrap = document.createElement("div");
                let domLi = document.createElement('li');
                let innerSpan = document.createElement('span');
                let innerI = document.createElement('i');
                if (!this.state.replySendStatus){        //回复
                    innerSpan.innerHTML = decodeURIComponent(validate.getCookie('user_name'))+'回复:'+ this.state.replay_name;
                    innerI.innerHTML = this.state.content;
                    domLi.appendChild(innerSpan);
                    domLi.appendChild(innerI);
                    wrap.appendChild(domLi);
                    let currentLi = document.getElementById("rowid" + this.state.keyCode);
                    currentLi.appendChild(wrap);
                }else{                           //留言
                    innerSpan.innerHTML = req.data.nick_name;
                    innerI.innerHTML = req.data.comment_content;
                    domLi.appendChild(innerSpan);
                    domLi.appendChild(innerI);
                    wrap.appendChild(domLi);
                    let currentLi = document.getElementById("rowid"+this.state.keyCode);
                    currentLi.appendChild(wrap);
                }
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
    // shouldComponentUpdate(){
    //     return (this.props.router.location.action === 'POP');
    // }
    componentDidMount() {
        
        const height = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 25;
        this.setState({ height });
        if (!sessionStorage.getItem("resdata2")) {
            pageIndex = 0;
            this.getNoticeList(1);            
        }
        this.lv.scrollTo(0, scrollTopCircle)
        // this.getNoticeList(1);
    }
    routerWillLeave(nextLocation) {
        // pageIndex = 0;
        document.body.style.overflow = 'inherit';
        scrollTopCircle = document.documentElement.scrollTop || document.body.scrollTop;
    }
    getNoticeList=(page)=>{
        runPromise("get_circle_list", {        //获取列表
            user_id: '0',
            per_page: "5",
            page: page
        }, this.handleSend, false, "get");
    }
    onRefresh = (refreshing = true) => {
        //顶部下拉刷新数据
        sessionStorage.removeItem("resdata2"); //下拉刷新时把缓存数据也清空吧
        pageIndex = 0;
        this.setState({ 
            refreshing
        });
        this.getNoticeList(1);
    };

    onEndReached = (event) => {
        // load new data   数据加载完成
        if (!this.state.isLoading && !this.state.hasMore) {
            return;
        }
        // this.getNoticeList(this.state.page);
        this.getNoticeList(pageIndex + 1);
    };

    onScroll = (e) => {
        if (backToTopDoing) {
            return;
        }
        let newScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        this.setState({
            showBackToTop: newScrollTop > 500,
        }, () => {
            scrollTopCircle = newScrollTop;
        });

    }
    addHeart=(e,toId,rowID)=>{    //点赞
        e.persist();
        runPromise("add_love", {
            id: toId,   
            user_id:validate.getCookie('user_id'),
            model:"circle"
        }, this.addheartlis, true, "post",{e:e,idx:rowID});
    }
    onChangeReplyInput=(value)=>{
        if(value.length > 0){
            this.setState({ 
                sendBtnStatus: true,
                content:value
            })
        }else{
            this.setState({
                sendBtnStatus: false,
                content: value
            })
        }
    }
    toggleInput = (key,uid,id) =>{
        if(key == this.state.keyCode  ) {
            this.setState({
                showReplyInput: !this.state.showReplyInput,
            }, () => { this.textarea.focus(); });
        } else if (key != this.state.keyCode && !this.state.showReplyInput){
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
    onTouchSend=()=>{
        if (this.state.sendBtnStatus && this.state.replySendStatus){  //留言
            runPromise("add_comment", {
                type: "circle",               //works=作品；project=需求;news=文章;circle=帖子;
                user_id_to: this.state.commentToId,     //发布文章人的id
                user_id: validate.getCookie('user_id'),                         //评论人的id
                article_id: this.state.commentId,          //文章id
                content: this.state.content   //评论内容
            }, this.addcommentlis, true, "post");
        } else if (this.state.sendBtnStatus && !this.state.replySendStatus){   //回复
            runPromise("rep_comment", {
                user_id: validate.getCookie('user_id'),     //回复人的id
                comment_id: this.state.comment_id,          //留言id
                content: this.state.content,                //评论内容
                rep_user_id: this.state.rep_user_id,       //被回复人的id
                rep_user_nick_name: this.state.replay_name  //被回复人名称
            }, this.addcommentlis, true, "post");
        }
    }
    //点击帖子
    clickPost = () => {
        // this.onRefresh();
        // // console.log("点击帖子");
        // this.setState({
        //     refreshing: true
        // });
    }
    // clickBackToTop = () => {
    //     cancelAnimationFrame(this.toTopTimer);
    //     let then = this;
    //     this.toTopTimer = requestAnimationFrame(function fn() {
    //         var oTop = document.body.scrollTop || document.documentElement.scrollTop;
    //         if (oTop > 0) {
    //             let stepper = 60;
    //             if (oTop > 1000) {
    //                 stepper = 200;
    //             }
    //             if (oTop > 2000) {
    //                 stepper = 300;
    //             }
    //             if (oTop > 3000) {
    //                 stepper = 400;
    //             }
    //             if (oTop > 4000) {
    //                 stepper = 500;
    //             }
    //             if (oTop > 5000) {
    //                 stepper = 600;
    //             }
    //             document.body.scrollTop = document.documentElement.scrollTop = oTop - stepper;
    //             then.toTopTimer = requestAnimationFrame(fn);
    //         } else {
    //             cancelAnimationFrame(then.toTopTimer);
    //         }
    //     });
    // }
    clickBackToTop = () => {
        backToTopDoing = true;
        cancelAnimationFrame(this.toTopTimer);
        let then = this;
        this.toTopTimer = requestAnimationFrame(function fn() {
            var oTop = document.body.scrollTop || document.documentElement.scrollTop;
            if (oTop > 0) {
                let stepper = Math.floor(oTop / 6)
                if (stepper < 5) {
                    stepper = 5;
                }
                document.body.scrollTop = document.documentElement.scrollTop = oTop - stepper;
                then.toTopTimer = requestAnimationFrame(fn);
            } else {
                backToTopDoing = false;
                then.onRefresh(false);
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
                                    obj.attachment_list?obj.attachment_list.map((value, idx) => {
                                        return idx < 6 ? <li>
                                            <a href="javascript:;">
                                                <img src={value.path_thumb} alt="" style={{ height: "100%" }} />
                                            </a>
                                        </li> : ""
                                    }):""
                                }
                            </ul>
                            <div style={{ color: "#949494", overflow: "hidden", borderBottom: "1px dotted #dedcdc", marginBottom: "10px" }}>
                                <div style={{ float: "left", paddingTop: "4px" }}>{obj.add_time_format}</div>
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
                                                            return val.content?<li onClick={() => {
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
                                                            </li>:""
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

        let initialListSize = 5;
        let storageFstdata = sessionStorage.getItem("fstdata");
        if (storageFstdata && JSON.parse(storageFstdata).length > 0) {
            initialListSize = JSON.parse(storageFstdata).length;
        }

        return (
            <Motion defaultStyle={{ left: 300 }} style={{ left: spring(0, { stiffness: 300, damping: 28 }) }}>
                {interpolatingStyle =>
                    <div style={{ ...interpolatingStyle, position: "relative", height: this.state.height }}>
                        <div className="forgetNav">
                            <NavBar
                                mode="light"
                                className="top"
                                icon={<Icon type="left" size="lg" color="#707070" />}
                                onLeftClick={() => hashHistory.goBack()}
                            >帖子</NavBar>
                        </div>
                        <div style={{ height: "1.2rem" }}></div>
                        <div className="homeWrap">
                            <div className="homeWrapMain" id="hkCircle">
                                <div ref={(ref) => { this.backToTopRef = ref }} onTouchEnd={() => { this.touchEndBackToTop(this.backToTopRef) }} onTouchStart={() => { this.touchStartBackToTop(this.backToTopRef) }} onClick={this.clickBackToTop} style={{ "display": this.state.showBackToTop ? "block" : "none" }} className="back-to-top"><img className="back-to-top-img" src={require("../images/backTop.png")} /></div>
                                <ListView
                                    key={this.state.useBodyScroll ? '0' : '1'}
                                    ref={el => this.lv = el}
                                    dataSource={this.state.dataSource}
                                    // renderFooter={() => (<div style={{ padding:"0 10px", textAlign: 'center',marginBottom:"1.4rem" }}>
                                    //     {this.state.isLoading ? '加载中...' : '加载完成'}
                                    // </div>)}
                                    renderFooter={() => (<div style={{ padding: 20, textAlign: 'center' }}>
                                        {this.state.isLoading ? '加载中...' : '加载完成'}
                                    </div>)}
                                    style={{
                                        height: this.state.height,
                                        overflow: "auto"
                                    }}
                                    renderRow={row}
                                    renderSeparator={separator}
                                    distanceToRefresh={1}
                                    useBodyScroll={this.state.useBodyScroll}
                                    pullToRefresh={<PullToRefresh
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />}
                                    onEndReached={this.onEndReached}
                                    pageSize={5}
                                    scrollRenderAheadDistance={900}
                                    onEndReachedThreshold={10}
                                    onScroll={this.onScroll}
                                    scrollEventThrottle={200}
                                    initialListSize={initialListSize}
                                />
                            </div>

                            <div className="popup-comment-input-box circle-popup-comment-input-box "
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
                        </div>
                    </div>
                }
            </Motion>
        )
    }
}

