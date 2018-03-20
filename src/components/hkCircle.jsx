import React from 'react'
import { List, InputItem, PullToRefresh, ListView, Carousel, WingBlank, Modal, TextareaItem, Toast } from 'antd-mobile';
import { Link, hashHistory } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import axios from 'axios';
import { ItemPicLists, PersonalMsg } from './templateHomeCircle';
import '../css/font/iconfont.css'

import update from 'immutability-helper';

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

let realData = [];
let index = realData.length - 1;
let realDataLength = realData.length;

const NUM_ROWS = 7;
let pageIndex = 0;

// function genData(pIndex = 0) {
//     const dataArr = [];
//     for (let i = 0; i < NUM_ROWS; i++) {
//         dataArr.push(`row - ${(pIndex * NUM_ROWS) + i}`);
//     }
//     return dataArr;
// }

export default class LoginView extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            data: [loginUrl.banner01, loginUrl.banner02, loginUrl.banner03],
            imgHeight: 176,
            slideIndex: 0,
            dataSource,
            refreshing: false,
            isLoading: true,
            useBodyScroll: true,
            modal:false,
            showReplyInput:false,
            res: [],
            love_list:[],
            placeholderWords:"留言：",
            commentToId:"",
            commentId:"",
            content:""
        };
        this.genData = (pIndex = 0, realLength, data) => {
            // const dataBlob = {};
            // for (let i = 0; i < NUM_ROWS; i++) {
            //     const ii = (pIndex * NUM_ROWS) + i;
            //     dataBlob[`${ii}`] = data[i];
            // }
            // return dataBlob;
            const dataArr = [];
            for (let i = 0; i < realLength; i++) {
                dataArr.push(data[i]);
            }
            return dataArr;
        };
        this.handleSend = (res) => {
            console.log(res);
            if(res.success) {
                realData = res.data.item_list;
                index = realData.length - 1;
                realDataLength = res.data.item_list.length;
                this.rData = { ...this.rData, ...this.genData(pageIndex++, realDataLength, realData) };
                // sessionStorage.setItem("users", JSON.stringify(realData))
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.rData),
                    hasMore: res.data.total_pages > pageIndex ? true : false,
                    // refreshing: false,
                    isLoading: false,
                    page: ++this.state.page,
                    res: res.data.item_list,
                });
            }else{

            }
        }
        this.addheartlis=(res,para)=>{
            if(res.success) {
                let numStar = para.e.target.parentNode.children[1].innerText;
                let loveLis = this.state.res[para.idx].love_list;
                if(res.message.type == 'delete'){
                    loveLis.map((value,index)=>{
                        if (res.message.nick_name == value.nick_name){
                            loveLis.splice(index,1);
                        }
                    })
                    para.e.target.parentNode.children[0].style.color = "#333";
                    para.e.target.parentNode.children[1].innerHTML = numStar-1;
                    let newList = update(this.state.res, { [para.idx]: { love_list: { $set: loveLis } } });
                    this.setState({ res: newList})
                } else if (res.message.type == 'add') {
                    para.e.target.parentNode.children[0].style.color = "#F95231";
                    para.e.target.parentNode.children[1].innerHTML = numStar - 0 + 1;
                    loveLis.push(res.message);
                    let newList = update(this.state.res, { [para.idx]: { love_list: { $set: loveLis } } });       
                    this.setState({ res: newList })             
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

    componentDidMount() {
        runPromise("get_notice_list", {
            user_id:'0',
            per_page: "5",
            page: "1"
        }, this.handleSend, true, "get");
        
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
    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    }
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }
    onRefresh = () => {   //顶部下拉刷新数据
        this.setState({ 
            refreshing: true, 
            isLoading: true 
        });
        // simulate initial Ajax
        // setTimeout(() => {
        //     this.rData = genData();
        //     this.setState({
        //         dataSource: this.state.dataSource.cloneWithRows(this.rData),
        //         refreshing: false,
        //         isLoading: false
        //     });
        // }, 600);
    };

    onEndReached = (event) => {
        // load new data   数据加载完成
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
        this.setState({ isLoading: true });
    };
    addHeart=(e,toId,rowID)=>{    //点赞
        e.persist();
        runPromise("add_love", {
            id: toId,   
            user_id:validate.getCookie('user_id'),
            model:"circle"
        }, this.addheartlis, true, "post",{e:e,idx:rowID});
    }
    addComment = (e, toId,id,rowID)=>{
        e.persist();
        runPromise("add_comment", {
            type:"circle",               //works=作品；project=需求;news=文章;circle=帖子;
            user_id_to: toId,     //发布文章人的id
            user_id:validate.getCookie('user_id'),                         //评论人的id
            article_id: id,          //文章id
            content: ""   //评论内容
        }, this.addcommentlis, true, "post", { e: e, idx: rowID });
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
        let index = this.state.res.length - 1;
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
                                    <span className="fn-right personalMsg">发布了帖子</span>
                                </p>
                                <p className="personalMsg">
                                    <span>{obj.job_name}</span> | <span>{obj.company}</span>
                                </p>
                            </div>
                        </div>
                        <div className="itemPicList">
                            <p>{obj.title}</p>
                            <ul>
                                {
                                    obj.attachment_list.map((value,idx)=>{
                                        return idx<6?<li>
                                            <a href="javascript:;">
                                                <img src={value.path_thumb} alt="" style={{height:"100%"}}/>
                                            </a>
                                        </li>:""
                                    })
                                }
                            </ul>
                            <div style={{ color: "#949494", overflow: "hidden", borderBottom:"1px dotted #dedcdc",marginBottom:"10px" }}>
                                <div style={{ float: "left",paddingTop:"4px" }}>{obj.add_time_format}</div>
                                <div style={{ float: "right" }}>
                                    <div onClick={(e)=>{
                                            this.addHeart(e,obj.id,rowID);
                                        }}
                                        style={{display:"inline-block",paddingTop:"4px"}}>
                                        <i className="iconfont icon-Pingjia" 
                                            style={{ 
                                                fontSize: "14px", 
                                                verticalAlign: "middle", 
                                                color: obj.islove?"#F95231":"",
                                                position:"relative",
                                                top:"1px"
                                            }}
                                        ></i> <span>{obj.love_count}</span>&nbsp;&nbsp;&nbsp;
                                    </div>
                                    <div style={{ 
                                            display: "inline-block",
                                            paddingTop:"4px" 
                                        }}
                                        onClick={(e) => { this.setState({ 
                                            showReplyInput: !this.state.showReplyInput,
                                            commentToId: obj.uid,
                                            commentId: obj.id,
                                        }, () => { this.textarea.focus();});
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
                        <div className="itemsBtm" style={{display: obj.love_list.length>0?"block":"none"}}>
                            <div className="loveList" style={{backgroundColor:"#f0f0f0",lineHeight:"0.75rem"}}>
                                <i className="iconfont icon-Pingjia" style={{position:"relative",top:"2px",margin:"0 5px"}}></i>
                                <ul style={{ display: "inline-block"}}>
                                    {
                                        obj.love_list.map((value, idx) => {
                                            return <li onClick={() => {
                                                hashHistory.push({
                                                    pathname: '/designerHome',
                                                    query: { userId: value.user_id }
                                                })
                                            }} style={{ float: "left",color: "#1199d2" }}>
                                                {value.nick_name},
                                            </li>
                                        })
                                    } 觉得很赞
                                </ul>
                            </div>
                            <div className="commentList" style={{marginTop:"8px"}}>
                                <ul>
                                    {
                                        obj.comment_data.comment_list.map((value,idx)=>{
                                            return <li style={{ backgroundColor: "#f0f0f0", lineHeight: "0.75rem" }}>
                                                <span style={{ color: "#1199d2",marginLeft:"6px" }}>{value.nick_name}: </span>
                                                <span>{value.content}</span>    
                                                <span style={{float:"right",marginRight:"5px"}}>{value.add_time_format}</span>
                                            </li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div className="homeWrap">
                <div className="lanternLis">
                    <WingBlank>
                        <Carousel
                            autoplay={true}
                            autoplayInterval={3000}
                            infinite
                            dotStyle={{ width: "6px", height: "6px" }}
                            dotActiveStyle={{ backgroundColor: "#fff", width: "10px", height: "6px", borderRadius: "3px" }}
                            selectedIndex={1}
                        >
                            {this.state.data.map(val => (
                                <a
                                    key={val}
                                    style={{ display: 'inline-block' }}
                                >
                                    <img
                                        src={val}
                                        alt=""
                                        style={{ width: '100%', verticalAlign: 'top' }}
                                        onLoad={() => {
                                            window.dispatchEvent(new Event('resize'));
                                            this.setState({ imgHeight: 'auto' });
                                        }}
                                    />
                                </a>
                            ))}
                        </Carousel>
                    </WingBlank>
                    <div className="fourAvt">
                        <ul>
                            <li>
                                <Link>
                                    <img src={loginUrl.demand} />
                                    <p>项目</p>
                                </Link>
                            </li>
                            <li>
                                <Link>
                                    <img src={loginUrl.work} />
                                    <p>作品</p>
                                </Link>
                            </li>
                            <li>
                                <Link>
                                    <img src={loginUrl.tiezi} />
                                    <p>帖子</p>
                                </Link>
                            </li>
                            <li>
                                <Link>
                                    <img src={loginUrl.essay} />
                                    <p>活动</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="homeWrapMain" id="hkCircle">
                    <ListView         //列表渲染
                        key={this.state.useBodyScroll ? '0' : '1'}
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}
                        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                            {this.state.isLoading ? '加载中...' : '加载完成'}
                        </div>)}
                        renderRow={row}
                        renderSeparator={separator}
                        useBodyScroll={this.state.useBodyScroll}
                        pullToRefresh={<PullToRefresh
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}
                        onEndReached={this.onEndReached}
                        pageSize={3}
                    />
                </div>

                <div className="popup-comment-input-box circle-popup-comment-input-box"
                    // style={{ "display": this.state.showReplyInput ? "block" : "none" }}
                    style={{ "visibility": this.state.showReplyInput ? "visible" : "hidden" }}
                >
                    <TextareaItem
                        id="abc"
                        ref="commentInput"
                        className="comment-input"
                        autoHeight
                        ref={(temp) => { this.textarea = temp; }}
                        placeholder={this.state.placeholderWords}
                        maxLength="100"
                        value={this.state.replyText}
                        onChange={this.onChangeReplyInput}
                        onBlur={this.onBlurReplyInput}
                    />
                    <span className="send-btn" ref="abcd"
                        style={this.state.sendBtnStatus ? {
                            "border": "1px solid #0e80d2",
                            "background-color": "#409ad6",
                            "color": "#fff",
                        } : {}}
                        onTouchStart={this.onTouchSend}
                    >发送</span>
                </div>
            </div>
        );
    }
}




