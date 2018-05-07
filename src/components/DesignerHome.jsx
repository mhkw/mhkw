import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Flex, Popover, Modal, TextareaItem } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import BScroll from 'better-scroll'

const defaultAvatar = require("../images/selec.png");
const tempNull = require('../images/tempNull2.png'); //空状态的图片

export default class DesignerHome extends React.Component {
    constructor(props) {
        super( props)
        this.state = {
            id: 0, //设计师ID
            user_name: "",
            avatarUrl:require("../images/avatar.png"),
            sex: "女",
            address: "杭州-滨江区", 
            experience: "6年经验", 
            works:"22作品", 
            slogan:'"传播现代的高雅艺术文化"',
            Get_demand: "6",
            Feedback_rate: "100%",
            Praise_rate: "100%",
            huake_info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis dicta voluptatibus voluptatum fuga amet eius modi! Repellat, labore fuga. In, atque dolores! Unde, placeat incidunt quaerat dolorem, asperiores praesentium ipsa dolor nulla ab alias delectus amet doloremque aperiam molestias quibusdam tenetur vero corporis id aliquam quae expedita tempora impedit non.",
            works_collect: "8",
            comment: "10",
            tab_index: 0, //设计师主页展示作品集还是评论，就看这个状态
            buttomBackgroundColor1: "#2068ab", //底部栏原始的背景颜色
            buttomBackgroundColor2: "#2068ab", //底部栏原始的背景颜色
            buttomBackgroundColor3: "#2068ab", //底部栏原始的背景颜色
            touchButtomBackgroundColor: "#4ba8ff", //底部栏按下去的背景颜色
            endButtomBackgroundColor: "#2068ab", //底部栏按下去的背景颜色
            buttomBackgroundColorLast: "#00a0e9", //底部栏最后那个按钮原始的背景颜色
            touchButtomBackgroundColorLast: "#4ba8ff", //底部栏最后那个按钮按下去的背景颜色
            endButtomBackgroundColorLast: "#00a0e9", //底部栏最后那个按钮按下去的背景颜色
            Popover_visible: false, //下拉框显示或隐藏的状态
            showReportModal: false, //投诉Modal是否显示
            reportText:'', //投诉的内容
            is_black_TA: 0, //是否拉黑他了a
            is_favorite: 0, //是否关注他
            height:""
        }
        this.handleReport = (res) => {
            if (res.success) {
                // console.log(res);
                this.setState({ showReportModal: false}); //关闭投诉弹窗
                Toast.success(res.message, 1)
            } else {
                Toast.fail(res.message, 1)
            }
        }
        this.handleUserBlack = (res) => {
            if (res.success) {
                // console.log(res);
                this.setState({ is_black_TA: 1 });
                Toast.success(res.message, 1)
            } else {
                Toast.fail(res.message, 1)
            }
        }
        this.handleDeleteUserBlack = (res) => {
            if (res.success) {
                // console.log(res);
                this.setState({ is_black_TA: 0 });
                Toast.success(res.message, 1)
            } else {
                Toast.fail(res.message, 1)
            }
        }
        this.handleAddFavorite = (res) => {
            if (res.success) {
                if (res.message.type == "add") {
                    this.setState({ is_favorite: 1 });
                    Toast.success("关注成功", 1)
                }
                if (res.message.type == "delete") {
                    this.setState({ is_favorite: 0 });
                    Toast.success("取消关注成功", 1)
                }
            } else {
                Toast.fail(res.message, 1)
            }
        }
    }
    handleGo(index) {
        let path = index == 0 ? "/designerHome/indexWorksCollection" : "/designerHome/designerComment";
        // this.setState({
        //     tab_index: index
        // })
        this.props.updateTabIndex(index);
        //类似tab切换
        // this.context.router.push({
        //     pathname: path,
        //     state: this.state
        // });
        hashHistory.replace({
            pathname: path,
            query: { form: 'designerHome' },
            // state: this.state
        });

    }
    touchStartStyle = (index) => {
        this.setState({
            ["buttomBackgroundColor" + index]: this.state.touchButtomBackgroundColor
        })
    }
    touchEndStyle = (index) => {
        this.setState({
            ["buttomBackgroundColor" + index]: this.state.endButtomBackgroundColor
        })
    }
    //底部栏最后那个按钮
    touchStartStyleLast = () => {
        this.setState({
            buttomBackgroundColorLast: this.state.touchButtomBackgroundColorLast
        })
    }
    //底部栏最后那个按钮
    touchEndStyleLast = () => {
        this.setState({
            buttomBackgroundColorLast: this.state.endButtomBackgroundColorLast
        })
    }
    //打电话
    handleCall = () => {
        console.log(1)
    }
    //交谈，即时聊天
    handleTalk = () => {
        console.log(2)
    }
    //评论
    handleComment = () => {
        hashHistory.push({
            pathname: '/writerComment',
            query: { form: 'designerHome' }
        });
    }
    //立即下单,快速服务下单
    handleStartOrder = () => {
        hashHistory.push({
            pathname: '/placeOrder',
            query: { form: 'designerHome' }
        });
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
                if (this.state.is_black_TA) {
                    this.ajaxDeleteUserBlack() //移除黑名单
                } else {
                    this.alertUserBlackModal(); //拉黑
                }
                break;
            case "3":
                this.ajaxAddFavorite();
                break;
        }
    }
    handleVisibleChange = (Popover_visible) => {
        console.log(Popover_visible);
        
        this.setState({
            Popover_visible,
        });
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
            Toast.info("请输入内容",1);
        }
    }
    ajaxReport = () => {
        let reportText = this.state.reportText;
        //投诉某个人
        runPromise('user_report', {
            "user_id_to": this.state.id,
            "content": reportText,
        }, this.handleReport);
    }
    //点击拉黑
    alertUserBlackModal = () => {
        Modal.alert('确定拉黑此用户?', '屏蔽此用户后你将不会收到TA发送给你的私信、留言，TA也无法评论回复你的创作，TA将从粉丝列表自动移除并且不能再次关注你。', [
            { text: '取消', onPress: () => {} },
            { text: '确定', onPress: () => this.ajaxUserBlack() },
        ])
    }
    //aja拉黑某个人
    ajaxUserBlack = () => {
        runPromise('add_user_black', {
            "to_user_id": this.state.id,
        }, this.handleUserBlack);
    }
    //aja将某个人移出黑名单
    ajaxDeleteUserBlack = () => {
        runPromise('delete_user_black', {
            "to_user_id": this.state.id,
        }, this.handleDeleteUserBlack);
    }
    //点击关注
    //如果已经关注了则取消关注，后端自动判断是关注还行取消关注
    ajaxAddFavorite = () => {
        runPromise('add_favorite', {
            "id": this.state.id,
            type: "user",
        }, this.handleAddFavorite);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.designer) {
            let { is_black_TA, id, is_favorite } = nextProps.designer;
            this.setState({
                is_black_TA,
                id,
                is_favorite,
            });
        }
    }
    //删掉popover气泡的DOM, 这是BUG
    componentWillUnmount() {
        let popoverArrayDOM = document.querySelectorAll(".am-popover-mask");
        
        for (let i = 0; i < popoverArrayDOM.length; i++) {
            const popover = popoverArrayDOM[i];
            let popoverRoot =  popover.parentNode.parentNode;
            popoverRoot.parentNode.removeChild(popoverRoot);
        }
    }
    componentDidMount(){
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 25;
        const scroll = new BScroll(document.querySelector('.wrapper'), { click: true, bounceTime: 300, swipeBounceTime: 200 })
        this.setState({
            height: hei
        })
    }
    render() {
        
        let { path, nick_name, sex, txt_address, experience, works_count, signature, signature_bbs, comment_count } = this.props.designer;
        return (
            // <QueueAnim className="designer-home-anim"
            //     animConfig={[
            //         { opacity: [1, 0], translateX: [0, 150] }
            //     ]}>
                <div className="designer-home" key="1">
                    <NavBar
                        // className="NewNavBar"
                        className="new-nav-bar top"
                        mode="light"
                        icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                        onLeftClick={() => hashHistory.goBack()}
                        // rightContent={<Icon key="1" type="ellipsis" style={{ "color": "#5f5f5f" }} />}
                        rightContent={
                            <DesignerPopover 
                                Popover_visible={this.state.Popover_visible} 
                                onPopoverSelect={this.onPopoverSelect}
                                is_black_TA={this.state.is_black_TA}
                                is_favorite={this.state.is_favorite}
                            />
                        }
                    ></NavBar>
                    <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                    <div>
                        <div className="brief-box-out">
                            <div className="avatar-box"><img src={path ? path : defaultAvatar} /></div>
                                <p className="nick-name">
                                    <span className="text">{nick_name}</span>
                                    {
                                        sex == '女' && <i className="iconfont icon-icccxingbie-female"></i>
                                    }
                                    {
                                        sex == '男' && <i className="iconfont icon-xingbie-male"></i>
                                    }
                                    {/* <i className={sex == "女" ? "iconfont icon-icccxingbie-female" : "iconfont icon-xingbie-male"}></i> */}
                                </p>
                                {/* <Flex className="brief-more-flex">
                            <Flex.Item style={{ "flex": "2", "text-align": "right" }} className="ellipsis"><i className="iconfont icon-dizhi"></i><span>{txt_address}</span> </Flex.Item>
                            <Flex.Item style={{ "flex": "1.5" }} className="ellipsis"><i className="iconfont icon-shijian"></i><span>{experience}经验</span> </Flex.Item>
                            <Flex.Item style={{ "flex": "2", "text-align": "left" }} className="ellipsis"><i className="iconfont icon-tupian"></i><span>{works_count}件作品</span> </Flex.Item>
                            </Flex> */}
                                <p className="brief-more">
                                    <i className="iconfont icon-dizhi"></i><span>{txt_address}</span>
                                    <i className="iconfont icon-shijian"></i><span>{experience}经验</span>
                                    <i className="iconfont icon-tupian"></i><span>{works_count}件作品</span>
                                </p>
                                <p className="slogan">{signature ? '“' + signature + '”' : null}</p>
                                <Flex className="brief-data-flex">
                                    <Flex.Item className="ellipsis">
                                        <p className="content">{this.state.Get_demand}</p>
                                        <p className="text">获取需求</p>
                                    </Flex.Item>
                                    <Flex.Item className="ellipsis">
                                        <p className="content">{this.state.Feedback_rate}</p>
                                        <p className="text">反馈率</p>
                                    </Flex.Item>
                                    <Flex.Item className="ellipsis">
                                        <p className="content">{this.state.Feedback_rate}</p>
                                        <p className="text">好评率</p>
                                    </Flex.Item>
                                </Flex>
                                <div className="brief-box-out-bottom">画客信息</div>
                            </div>
                            <p className="huake-info-box">{signature_bbs}</p>
                            <Flex className="brief-comment-flex">
                                <Flex.Item style={{ "flex": "1", "text-align": "right" }} className={this.props.tab_index == 0 ? "ellipsis active" : "ellipsis"}>
                                    <span
                                        onClick={() => { this.handleGo(0) }}
                                    >
                                        <span className="txt">作品集</span>
                                        ({works_count})
                                </span>
                                </Flex.Item>
                                <Flex.Item style={{ "flex": "0.2" }}></Flex.Item>
                                <Flex.Item style={{ "flex": "1", "text-align": "left" }} className={this.props.tab_index == 1 ? "ellipsis active" : "ellipsis"}>
                                    <span
                                        onClick={() => { this.handleGo(1) }}
                                    >
                                        <span className="txt">评论</span>
                                        ({comment_count})
                                </span>
                                </Flex.Item>
                            </Flex>
                            {this.props.children &&
                                React.cloneElement(
                                    this.props.children,
                                    {
                                        state: this.props.state,
                                        setState: this.props.setState,
                                        designer: this.props.designer,
                                        indexWorksList: this.props.indexWorksList,
                                        updateSelectedComment: this.props.updateSelectedComment,
                                    }
                                )
                            }
                            <div style={{"height":"1.2rem"}}></div>
                        </div>
                    </div>
                    
                    <Flex className="bottom-features">
                        <Flex.Item
                        style={{ "background-color": this.state.buttomBackgroundColor1}}
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
                        <Flex.Item
                        style={{ "flex": "2", "background-color": this.state.buttomBackgroundColorLast }}
                        onTouchStart={this.touchStartStyleLast}
                        onTouchEnd={this.touchEndStyleLast}
                        onClick={this.handleStartOrder}
                        >立即下单</Flex.Item>
                    </Flex>
                    <UserReportModal
                        showReportModal={this.state.showReportModal}
                        changeShowReportModal={this.changeShowReportModal}  
                        ConfirmReport={this.ConfirmReport}
                        reportText={this.state.reportText}
                        setState={this.setState.bind(this)}
                    />
                </div>
            // </QueueAnim>
        )
    }
}

DesignerHome.contextTypes = {
    router: React.PropTypes.object
};

export const IndexWorksCollection = (props) => {
    let oldBackgroundColor = "#fff";
    const touchStart = (e) => {
        oldBackgroundColor = e.target.style.backgroundColor;
        e.target.style.backgroundColor = "#eee";
    }
    const touchEnd = (e) => {
        e.target.style.backgroundColor = oldBackgroundColor;
    }
    const handleClick = () => {
        hashHistory.push({
            pathname: '/worksCollection',
            query: { form: 'designerHome' },
        });
    }
    const handleClickWorksDetails = (works_id) => {
        hashHistory.push({
            pathname: '/designerWorksDetails',
            query: { 
                form: 'designerHome', 
                works_id,
            },
        });
    }
    return (
        <div className="index-works-collection">
            {
                props.indexWorksList.map((value, index) => (
                    <WorksItem
                        {...value}
                        handleClickWorksDetails={handleClickWorksDetails}
                    />
                ))
            }
            <div
                style={{ "display": props.indexWorksList.length < 1 ? "none" : "block" }}
                className="view-more"
                onTouchStart={touchStart}
                onTouchEnd={touchEnd}
                onClick={handleClick}
            >查看更多</div>
            <img
                style={{ 
                    "display": props.indexWorksList.length < 1 ? "block" : "none",
                    "width": "142px",
                    "height": "150px",
                    "margin": "0px auto 0",
                }}
                src={tempNull} 
            />
        </div>
    )
}

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

//设计师右上角的气泡，点击显示更多操作。
const DesignerPopover = (props) => (
    <Popover
        mask
        visible={props.Popover_visible}
        overlay={[
            (<Popover.Item key="1" icon={<i className="iconfont icon-tousu"></i> }>投诉</Popover.Item>),
            (<Popover.Item key="2" icon={<i className="iconfont icon-heimingdan"></i>}>{props.is_black_TA ? "已拉黑" : "拉黑"}</Popover.Item>),
            (<Popover.Item key="3" icon={<i className={props.is_favorite ? "iconfont designer icon-xin-1" : "iconfont icon-Pingjia"}></i>}>{props.is_favorite ? "已关注" : "关注"}</Popover.Item>),
        ]}
        onSelect={props.onPopoverSelect}
    >
        <Icon key="1" type="ellipsis" style={{ "color": "#5f5f5f" }} />
    </Popover>
)

const WorksItem = (props) => (
    <div key={props.id} onClick={() => { props.handleClickWorksDetails(props.id) }} style={{ display: "inline-block", width: "50%", boxSizing: "border-box", padding: "5px" }}>
        <div className="items" style={{
            border: "1px solid #ccc",
            boxSizing: "border-box",
            borderRadius: "3px",
            backgroundColor: "#f5f5f5",
            boxShadow: "0px 0px 10px #ccc",
        }}>
            <div>
                <img src={props.path_thumb ? props.path_thumb : props.path} style={{ width: "100%", height: "5rem" }} />
                <div style={{ height: "26px", overflow: "hidden" }}>
                    <p className="exlips" style={{ lineHeight: "24px", padding: "0 4px" }}>{props.title}</p>
                </div>
            </div>
        </div>
    </div>
)