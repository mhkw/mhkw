import React from 'react';
import { hashHistory, Link } from 'react-router';
import { NavBar, Icon, Button, WingBlank, Flex, List, ActionSheet } from 'antd-mobile';
import BScroll from 'better-scroll'

const OfferItem = (props) => (
    <div className="offer-item">
        <Flex justify="between" align="start">
            <Flex.Item className="title" style={{ "flex": "2" }}>{props.title}</Flex.Item>
            <Flex.Item className="price">{props.price}</Flex.Item>
        </Flex>
        <Flex justify="between" align="start">
            <Flex.Item className="remarks" style={{ "flex": "3" }}>{props.describe}</Flex.Item>
            <Flex.Item className="number">{props.number}</Flex.Item>
        </Flex>
    </div>
)

const ActionDataList = [{
    icon: <i className="iconfont icon-weixin1" ></i>,
    title: '微信好友'
}]

export default class ConfirmOffer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            remarks: "",
            pure_price: "",
            clicked: 'none',
            height:"",
            SendSuccess: false,
        }
        // this.wx = api.require('wx');
    }
    onClickConfirmOffer = () => {
        if (this.props.state && this.props.state.checkedServerList && this.props.state.checkedServerList.length > 0) {
            if (this.state.SendSuccess) {
                this.showShareActionSheet();
            } else {
                this.props.CreateOfferQuotation(); //点击生成报价单
            }
        } else {
            hashHistory.push({
                pathname: '/',
                query: { form: 'confirmOffer' }
            });
        }
        
        // this.showShareActionSheet();
    }
    showShareActionSheet = () => {
        ActionSheet.showShareActionSheetWithOptions({
            options: ActionDataList,
            title: '分享到',
            cancelButtonIndex: -1, 
            maskClosable: false, 
        },
            (buttonIndex) => {
                this.setState({ clicked: buttonIndex > -1 ? ActionDataList[buttonIndex].title : 'cancel' });
                //如果点击取消
                if (buttonIndex == -1) {
                    hashHistory.push({
                        pathname: '/quoteList',
                        query: { form: 'confirmOffer' }
                    });
                }
                //点击的是微信
                if (buttonIndex == 0) {
                    let otherShareURL = this.props.offerShareURL.replace(/myself/, "other")
                    this.wxShareWebpage(this.props.state.proname, otherShareURL);
                }
            }
        );
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.offerShareURL) {
            if (!this.state.SendSuccess) {
                this.showShareActionSheet();
            }
            this.setState({ SendSuccess: true })
        }
    }
    componentWillMount() {
        if (this.props.location.query && this.props.location.query.form != "CreateOffer") {
            hashHistory.push({
                pathname: '/',
                query: { form: 'confirmOffer' }
            });
        }
        if (this.props.state && this.props.state.checkedServerList && this.props.state.checkedServerList.length > 0) {
        } else {
            hashHistory.push({
                pathname: '/',
                query: { form: 'confirmOffer' }
            });
        }
    }
    componentDidMount(){
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 60;
        const scroll = new BScroll(document.querySelector('.wrapper'), { click: true, bounceTime: 300, swipeBounceTime: 200 })
        this.setState({
            height: hei
        })
    }
    wxShareWebpage = (description, contentUrl, title = '画客网报价', thumb = 'widget://dist/images/huakerappicon.png', scene = 'session', ) => {
        if (window.wx) {
            wx.shareWebpage({
                scene: scene,
                title: title,
                description: description,
                thumb: thumb,
                contentUrl: contentUrl
            }, (ret, err) => {
                if (ret.status) {   
                    // alert(JSON.stringify(ret))

                } else {

                }
                //不管是否分享成功，都跳转到报价列表，发出的报价
                hashHistory.push({
                    pathname: '/quoteList',
                    query: { form: 'confirmOffer' }
                });
            });
        }
    }
    render() {
        return (
            <div className="confirm-offer" key="1">
                <NavBar
                    className="create-server-nav-bar add-server-nav-bar top"
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => hashHistory.goBack()}
                    leftContent={<span style={{ fontSize: "15px" }}>返回</span>}
                >报价确认</NavBar>
                <div className="progress serverStep">
                    <ul>
                        <li className={this.props.progress > 0 ? "finish" : null}>创建/选择内容<div className="triangle-right"></div></li>
                        <li className={this.props.progress > 1 ? "finish" : null}>客户信息<div className="triangle-right"></div></li>
                        <li className={this.props.progress > 2 ? "finish" : null}>生成报价并分享</li>
                    </ul>
                </div>
                <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                    <div>
                        <div className="create-offer-main">
                            {/* <OfferItem
                        title={"PS简单处理图片"}
                        price={"2000.00/天"}
                        remarks={"海报创意，海报定制，创意，营销广告海报创意，海报定制，创意，营销广告海报创意，海报定制，创意，营销广告"}
                        number={"× 1"}
                    />
                    <OfferItem
                        title={"PS简单处理图片"}
                        price={"2000.00/天"}
                        remarks={"海报创意，海报定制，创意，营销广告"}
                        number={"× 1"}
                    /> */}
                            {
                                this.props.state.checkedServerList && this.props.state.checkedServerList.map((val, index) => (
                                    <OfferItem
                                        title={val.Name}
                                        price={val.unit_price + val.unit}
                                        describe={val.describe}
                                        number={`× ${val.number}`}
                                    />
                                ))
                            }
                            <div className="tax-top-rate-box">
                                <p className="tax-top clearfix">
                                    <span className="name">税率</span>
                                    <span className="price">{this.props.state.checkPrice}元</span>
                                </p>
                                <p className="tax-bottom">6%税率</p>
                            </div>
                            {/* <InputItem
                        className="remarks-input-create-offer"
                        type="string"
                        placeholder="添加备注"
                        value={this.state.remarks}
                        onChange={(val) => { this.setState({ remarks: val }) }}
                    ><i className="iconfont icon-bianji"></i></InputItem> */}
                            {/* <Flex className="remarks-div" >
                        <Flex.Item className="title">说明</Flex.Item>
                        <Flex.Item className="remarks" style={{ "flex": "3" }}>{this.state.remarks}</Flex.Item>
                    </Flex> */}
                            <div className="confirm-offer-remarks-div">
                                <span className="title">说明</span>
                                <div className="remarks">{this.props.remarks}</div>
                            </div>
                            <div className="tax-top-rate-box confirm-offer-style">
                                <p className="tax-top clearfix">
                                    <span className="name subtotal">总计:</span>
                                    <span className="price subtotal" style={{ "color": this.props.inputDiscountPrice ? "#464646" : "#ff1212" }}>{this.props.state.checkPriceTax}</span>
                                </p>
                                <p className="tax-top clearfix" style={{ "display": this.props.inputDiscountPrice ? "block" : "none" }}>
                                    <span className="name discount">优惠后(含发票):</span>
                                    <span className="price discount">{this.props.inputDiscountPrice}</span>
                                </p>
                            </div>
                            <div className="tax-top-rate-box confirm-offer-tax">
                                <p className="tax-top clearfix">
                                    <span className="name">到款方式</span>
                                    <span className="price">预付款:<span className="txt">30%</span></span>
                                </p>
                                <p className="tax-bottom">全部完成:<span className="txt">70%</span></p>
                            </div>
                        </div>
                        <p className="confirm-offer-customer-title">客户信息</p>
                        <div className="confirm-offer-customer">
                            <div className="customer-box customer">
                                <p>
                                    <span className="left">姓名</span>
                                    <p className="right ellipsis"><span className="name">{this.props.customer_name}</span><span className="company">({this.props.customer_company})</span></p>
                                </p>
                                <p>
                                    <span className="left">手机</span>
                                    <p className="right">{this.props.customer_phone}</p>
                                </p>
                            </div>
                        </div>
                        <p className="confirm-offer-customer-title">项目信息</p>
                        <div className="confirm-offer-customer project">
                            <div className="customer-box">
                                <p>
                                    <span className="left">项目名称</span>
                                    <p className="right ellipsis">{this.props.proname}</p>
                                </p>
                                <p>
                                    <span className="left">截止日期</span>
                                    <p className="right">{this.props.cut_off_date}</p>
                                </p>
                            </div>
                        </div>
                        <div className="confirm-offer-foot">
                            <Button
                                onClick={this.onClickConfirmOffer}
                                className="confirm-offer-button"
                                activeClassName="confirm-offer-button-active"
                            >{this.state.SendSuccess ? "已发送，分享" : "确认发送并分享"}</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ConfirmOffer.contextTypes = {
    router: React.PropTypes.object
}