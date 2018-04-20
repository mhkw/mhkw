import React from 'react'
import { NavBar, Icon, Toast, Button, Flex, WingBlank, Popover, Modal, TextareaItem  } from 'antd-mobile';
import { Link, hashHistory } from 'react-router';
import BScroll from 'better-scroll'

const zhanWei = require('../images/logoZhanWei.png');
const defaultAvatar = require("../images/selec.png");

import PhotoSwipeItem from './photoSwipeElement.jsx';

import '../js/photoswipe/photoswipe.css';
import '../js/photoswipe/default-skin/default-skin.css';
import PhotoSwipe from '../js/photoswipe/photoswipe.min.js';
import PhotoSwipeUI_Default from '../js/photoswipe/photoswipe-ui-default.min.js';

let openPhotoSwipe = function (items, index) {
    let pswpElement = document.querySelectorAll('.pswp')[0];
    let options = {
        index: index,
        showAnimationDuration: 100,
        hideAnimationDuration: 100,
        height:""
    }
    let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
}

export default class WorksDetails extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            id: '', //设计师的ID
            nick_name: "",
            avatarUrl: "",
            works_id: '', //作品的ID
            batch_video_urls: [], //视频列表
            content: '', //文章主体
            attachment_list: [], //图片列表
            hits: '', //浏览量
            comment_count: '', //评论数
            love_count: '', //点赞数
            add_time_format: '', //添加时间，格式化
            title: '', //作品标题
            buttomBackgroundColor1: "#2068ab", //底部栏原始的背景颜色
            buttomBackgroundColor2: "#2068ab", //底部栏原始的背景颜色
            buttomBackgroundColor3: "#2068ab", //底部栏原始的背景颜色
            touchButtomBackgroundColor: "#4ba8ff", //底部栏按下去的背景颜色
            endButtomBackgroundColor: "#2068ab", //底部栏按下去的背景颜色
            Popover_visible: false, //下拉框显示或隐藏的状态
            showReportModal: false, //投诉Modal是否显示
            reportText: '', //投诉的内容
            is_favorite: 0, //是否关注了作品（收藏）
            islove: 0, //是否点赞了作品

        }
        this.handleGetWorks = (res) => {
            if (res.success) {
                let { batch_video_urls, content, attachment_list, hits, comment_count, love_count, add_time_format, title, islove, is_favorite } = res.data;
                this.setState({
                    batch_video_urls,
                    content,
                    attachment_list,
                    hits,
                    comment_count,
                    love_count,
                    add_time_format,
                    title,
                    islove,
                    is_favorite,
                });
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
        this.handleReport = (res) => {
            if (res.success) {
                // console.log(res);
                this.setState({ showReportModal: false }); //关闭投诉弹窗
                Toast.success(res.message, 1)
            } else {
                Toast.fail(res.message, 1)
            }
        }
        this.handleAddFavorite = (res) => {
            if (res.success) {
                if (res.message.type == "add") {
                    this.setState({ is_favorite: 1 });
                    Toast.success("收藏成功", 1)
                }
                if (res.message.type == "delete") {
                    this.setState({ is_favorite: 0 });
                    Toast.success("取消收藏成功", 1)
                }
            } else {
                Toast.fail(res.message, 1)
            }
        }
        this.handleAddLove = (res) =>{
            if (res.success) {
                let { count, type } = res.message;
                if (type == "add") {
                    Toast.success("点赞成功", 1)
                }
                if (type == "delete") {
                    Toast.success("取消点赞成功", 1)
                }
                this.setState({
                    love_count: count,
                    islove: type == "add" ? 1 : 0
                })
            } else {
                Toast.fail(res.message, 1)
            }
        }

    }
    componentWillMount() {
        let { id, path_thumb, nick_name } = this.props.designer;
        let { works_id, form} = this.props.location.query;
        // console.log(nick_name)
        this.setState({
            id,
            nick_name,
            avatarUrl: path_thumb,
            works_id,
        })
    }
    componentDidMount() {
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 25;
        setTimeout(() => {
            new BScroll(document.querySelector('.wrapper'), { click: true })
        }, 500);
        this.setState({
            height: hei
        })
        this.ajaxGetWorks(this.state.works_id);
    }
    ajaxGetWorks = (works_id) => {
        runPromise('get_works_info', {
            works_id,
        }, this.handleGetWorks, false, 'get');
    }
    clickDesignerTitle = () => {
        let query = this.props.location.query;
        if (query && query.form == "designerHome") {
            hashHistory.goBack();
        } else {
            hashHistory.push({ 
                pathname: '/designerHome', 
                query: { userId: this.state.id } 
            })
        }
    }
    onTouchImg = (index, attachment_list) => {
        // console.log(dishPic);
        let items = [];
        attachment_list.length > 0 &&
        attachment_list.map((value) => {
            let item = {};
            item.src = value.path;
            item.w = parseInt(value.width) || 540;
            item.h = parseInt(value.height) || 390;
            items.push(item);
        })
        openPhotoSwipe(items, index)
    }
    //点击右上角气泡时的效果
    onPopoverSelect = (opt) => {
        // console.log(opt.key);
        this.setState({
            Popover_visible: false,
        });
        switch (opt.key) {
            case "1":
                this.changeShowReportModal("true");
                break;
            case "2":
                this.ajaxAddFavorite();
                break;
            case "3":
                this.ajaxAddLove();
                break;
        }
    }
    //修改是否显示投诉弹窗
    changeShowReportModal = (boolean = false) => {
        this.setState({
            showReportModal: boolean
        })
    }
    //确认投诉
    ConfirmReport = () => {
        let reportText = this.state.reportText;
        if (reportText.length > 0) {
            this.ajaxReport();
        } else {
            Toast.info("请输入内容", 1);
        }
    }
    //ajax发送投诉内容
    ajaxReport = () => {
        let reportText = this.state.reportText;
        //投诉某个人
        runPromise('user_report', {
            "user_id_to": this.state.id,
            "content": reportText,
        }, this.handleReport);
    }
    //点击关注,也就是：收藏，个人中心可见
    //如果已经关注了则取消关注，后端自动判断是关注还行取消关注
    ajaxAddFavorite = () => {
        runPromise('add_favorite', {
            "id": this.state.works_id,
            type: "works",
        }, this.handleAddFavorite);
    }
    //ajax发送点赞
    ajaxAddLove = () => {
        runPromise("add_love", {
            id: this.state.works_id,
            user_id: validate.getCookie('user_id'),
            model: "works",
        }, this.handleAddLove);
    }
    //删掉popover气泡的DOM, 这是BUG
    componentWillUnmount() {
        let popoverArrayDOM = document.querySelectorAll(".am-popover-mask");

        for (let i = 0; i < popoverArrayDOM.length; i++) {
            const popover = popoverArrayDOM[i];
            let popoverRoot = popover.parentNode.parentNode;
            popoverRoot.parentNode.removeChild(popoverRoot);
        }
    }
    render() {
        return (
            <div className="WorksDetails" key="0">
                <NavBar
                    mode="light"
                    className="top"
                    icon={<Icon type="left" size="lg" color="#333" />}
                    onLeftClick={() => hashHistory.goBack()}
                    // leftContent={<span style={{ fontSize: "15px" }}>返回</span>}
                    // rightContent={<Button className="rechargeButton" style={{ "line-height": "26px", "font-size": "14px"}} onClick={() => { console.log("交流")  }}>交流</Button>}
                    rightContent={
                        <DesignerPopover
                            Popover_visible={this.state.Popover_visible}
                            onPopoverSelect={this.onPopoverSelect}
                            is_favorite={this.state.is_favorite}
                            islove={this.state.islove}
                        />
                    }
                >
                <p
                    className="works-details-navbar-title"
                    onClick={ this.clickDesignerTitle }
                >
                    <img onError={(e) => { e.target.src = defaultAvatar }} src={this.state.avatarUrl ? this.state.avatarUrl : defaultAvatar} />
                    <span className="avatar-name">{this.state.nick_name}</span>
                </p>
                </NavBar>
                <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                    <div>
                        <WingBlank>
                            <h1 className="works-title">{this.state.title}</h1>
                            <Flex className="works-base-info">
                                <Flex.Item className="left">
                                    <i className="iconfont icon-yanjing"></i>
                                    {this.state.hits}
                                    <i className="iconfont icon-Pingjia"></i>
                                    {this.state.love_count}
                                    <i className="iconfont icon-liuyan"></i>
                                    {this.state.comment_count}
                                </Flex.Item>
                                <Flex.Item className="right">
                                    <i className="iconfont icon-shijian1"></i>
                                    {this.state.add_time_format}
                                </Flex.Item>
                            </Flex>
                            {/* {
                                this.state.batch_video_urls.length > 0 &&
                                this.state.batch_video_urls.map((value,index)=>(
                                    // <video
                                    //     src={value}
                                    //     style={{"height": "auto","width": "100%"}}
                                    //     controls="controls"
                                    //     // quality="high"
                                    //     // align="middle" allowScriptAccess="always"
                                    //     // allowFullScreen="true"
                                    //     // mode="transparent"
                                    //     // type="application/x-shockwave-flash"
                                    // >
                                    // </video>
                                    <iframe 
                                    width="100%" 
                                    height="auto" 
                                    src='https://v.youku.com/v_show/id_XMjk1Mjc0MzA0OA==.html?spm=a2hzp.8253869.0.0' 
                                    frameborder="0"
                                    allowfullscreen='allowfullscreen'
                                    ></iframe>
                                ))
                            } */}
                            <pre
                                className="content-box"
                                dangerouslySetInnerHTML={{ __html: this.state.content }}
                            ></pre>
                            <div className="attachment-box">
                                {
                                    this.state.attachment_list.length > 0 &&
                                    this.state.attachment_list.map((value, index, elem) => (
                                        <img
                                            key={value.id}
                                            className="mb-img"
                                            src={value.path_thumb ? value.path_thumb : value.path}
                                            // src={value.path_thumb ? (value.path_thumb).split("!")[0] + '!209x150' : value.path}
                                            onError={(e) => { e.target.src = zhanWei; }}
                                            onClick={() => { this.onTouchImg(index, elem) }}
                                        />
                                    ))
                                }
                            </div>
                        </WingBlank>
                        <div style={{ "height": "1.6rem" }}></div>
                    </div>
                </div>
                <Flex className="bottom-features works-details">
                    <Flex.Item
                        style={{ "background-color": this.state.buttomBackgroundColor1 }}
                        onTouchStart={() => this.touchStartStyle(1)}
                        onTouchEnd={() => this.touchEndStyle(1)}
                        onClick={this.handleCall}
                    ><i className="iconfont icon-icon-phone"></i>电话</Flex.Item>
                    <Flex.Item
                        style={{ "background-color": this.state.buttomBackgroundColor2 }}
                        onTouchStart={() => this.touchStartStyle(2)}
                        onTouchEnd={() => this.touchEndStyle(2)}
                        onClick={this.handleTalk}
                    ><i className="iconfont icon-icon-talk"></i>交谈</Flex.Item>
                    <Flex.Item
                        style={{ "background-color": this.state.buttomBackgroundColor3 }}
                        onTouchStart={() => this.touchStartStyle(3)}
                        onTouchEnd={() => this.touchEndStyle(3)}
                        onClick={this.handleComment}
                    ><i className="iconfont icon-icon-comment"></i>评论</Flex.Item>
                </Flex>
                <UserReportModal
                    showReportModal={this.state.showReportModal}
                    changeShowReportModal={this.changeShowReportModal}
                    ConfirmReport={this.ConfirmReport}
                    reportText={this.state.reportText}
                    setState={this.setState.bind(this)}
                />
                <PhotoSwipeItem />
            </div>
        )
    }
}

//设计师右上角的气泡，点击显示更多操作。
const DesignerPopover = (props) => (
    <Popover
        mask
        visible={props.Popover_visible}
        overlay={[
            (<Popover.Item key="1" icon={<i className="iconfont icon-tousu"></i>}>投诉</Popover.Item>),
            (<Popover.Item key="2" icon={<i className={props.is_favorite ? "iconfont designer icon-xin-1" : "iconfont icon-Pingjia"}></i>}>{props.is_favorite ? "已收藏" : "收藏"}</Popover.Item>),
            (<Popover.Item key="3" icon={<i className={props.islove ? "iconfont work icon-xingxing_xuanzhong" : "iconfont icon-xingxingxianmiao"}></i>}>{props.islove ? "已点赞" : "点赞"}</Popover.Item>),
        ]}
        onSelect={props.onPopoverSelect}
    >
        <Icon key="1" type="ellipsis" style={{ "color": "#5f5f5f" }} />
    </Popover>
)

const UserReportModal = (props) => (
    <Modal
        title={"请输入投诉内容"}
        className="report-modal"
        visible={props.showReportModal}
        transparent
        maskClosable={false}
        closable={true}
        onClose={() => { props.changeShowReportModal(false) }}
        footer={[
            { text: '取消', onPress: () => { props.changeShowReportModal(false) } },
            { text: '确定', onPress: () => { props.ConfirmReport(); } }
        ]}
    >
        <TextareaItem
            className="report-textarea"
            count={200}
            rows={3}
            onBlur={(val) => { props.setState({ reportText: val }) }}
        // ref={el => this.commentTextarea = el }
        />
    </Modal>
)