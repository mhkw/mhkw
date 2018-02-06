import React from 'react';
import { hashHistory, Link } from 'react-router';
import { NavBar, Icon, Button, WingBlank, Flex, List } from 'antd-mobile';

const OfferItem = (props) => (
    <div className="offer-item">
        <Flex justify="between" align="start">
            <Flex.Item className="title" style={{ "flex": "2" }}>{props.title}</Flex.Item>
            <Flex.Item className="price">{props.price}</Flex.Item>
        </Flex>
        <Flex justify="between" align="start">
            <Flex.Item className="remarks" style={{ "flex": "3" }}>{props.remarks}</Flex.Item>
            <Flex.Item className="number">{props.number}</Flex.Item>
        </Flex>
    </div>
)

export default class ConfirmOffer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            remarks: "15天内完成，满意为止",
            pure_price: "3560.00",
        }
    }
    onClickConfirmOffer() {
        console.log("click confirm offer")
    }
    render() {
        return (
            <div className="confirm-offer" key="1">
                <NavBar
                    className="create-server-nav-bar"
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => hashHistory.goBack()}
                    leftContent={<span style={{ fontSize: "15px" }}>返回</span>}
                >报价确认</NavBar>
                <div className="create-offer-main">
                    <OfferItem
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
                    />
                    <div className="tax-top-rate-box">
                        <p className="tax-top clearfix">
                            <span className="name">税率</span>
                            <span className="price">{this.state.pure_price + "元"}</span>
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
                        <div className="remarks">{this.state.remarks}</div>
                    </div>
                    <div className="tax-top-rate-box confirm-offer-style">
                        <p className="tax-top clearfix">
                            <span className="name subtotal">小计:</span>
                            <span className="price subtotal">5632.00</span>
                        </p>
                        <p className="tax-top clearfix">
                            <span className="name discount">优惠后(含发票):</span>
                            <span className="price discount">5600.00</span>
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
                            <p className="right ellipsis"><span className="name">张兰</span><span className="company">(杭州画客科技有限公司 总经理)</span></p>
                        </p>
                        <p>
                            <span className="left">手机</span>
                            <p className="right">18904815162</p>
                        </p>
                    </div>
                </div>
                <p className="confirm-offer-customer-title">项目信息</p>
                <div className="confirm-offer-customer project">
                    <div className="customer-box">
                        <p>
                            <span className="left">项目名称</span>
                            <p className="right ellipsis">PS简单处理图片</p>
                        </p>
                        <p>
                            <span className="left">截止日期</span>
                            <p className="right">2018-02-15</p>
                        </p>
                    </div>
                </div>
                <div className="confirm-offer-foot">
                    <Button
                        onClick={this.onClickConfirmOffer}
                        className="confirm-offer-button"
                        activeClassName="confirm-offer-button-active"
                    >确认发送并分享</Button>
                </div>
            </div>
        )
    }
}

ConfirmOffer.contextTypes = {
    router: React.PropTypes.object
}