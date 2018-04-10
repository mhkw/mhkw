import React from 'react'
import { NavBar, Icon, Toast, Button, Flex, WingBlank  } from 'antd-mobile';
import { Link, hashHistory } from 'react-router';

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
        hideAnimationDuration: 100
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

        }
        this.handleGetWorks = (res) => {
            if (res.success) {
                let { batch_video_urls, content, attachment_list, hits, comment_count, love_count, add_time_format, title } = res.data;
                this.setState({
                    batch_video_urls,
                    content,
                    attachment_list,
                    hits,
                    comment_count,
                    love_count,
                    add_time_format,
                    title,
                });
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
    }
    componentWillMount() {
        let { id, path_thumb, nick_name } = this.props.designer;
        let { works_id, form} = this.props.location.query;
        this.setState({
            id,
            nick_name,
            avatarUrl: path_thumb,
            works_id,
        })
    }
    componentDidMount() {
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
    render() {
        return (
            <div className="WorksDetails" key="0">
                <NavBar
                    mode="light"
                    icon={<Icon type="left" size="lg" color="#333" />}
                    onLeftClick={() => hashHistory.goBack()}
                    // leftContent={<span style={{ fontSize: "15px" }}>返回</span>}
                    rightContent={<Button className="rechargeButton" style={{ "line-height": "26px", "font-size": "14px"}} onClick={() => { console.log("交流")  }}>交流</Button>}
                >
                <p
                    className="works-details-navbar-title"
                    onClick={ this.clickDesignerTitle }
                >
                    <img onError={(e) => { e.target.src = defaultAvatar }} src={this.state.avatarUrl ? this.state.avatarUrl : defaultAvatar} />
                    <span className="avatar-name">{this.state.nick_name}</span>
                </p>
                </NavBar>
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
                        dangerouslySetInnerHTML={{__html: this.state.content}}
                    ></pre>
                    <div className="attachment-box">
                        {
                            this.state.attachment_list.length > 0 && 
                            this.state.attachment_list.map((value, index, elem)=>(
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
                <div style={{ "height": "1.2rem" }}></div>
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
                <PhotoSwipeItem />
            </div>
        )
    }
}