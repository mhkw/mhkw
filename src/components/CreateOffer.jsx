import React from 'react'
import { NavBar, Icon, Button, WingBlank, Flex, InputItem} from 'antd-mobile';
import { hashHistory, Link } from 'react-router';

const OfferItem = (props) => (
    <div className="offer-item">
        <Flex justify="between" align="start">
            <Flex.Item className="title" style={{ "flex": "3" }}>{props.title}</Flex.Item>
            <Flex.Item className="price">{props.price}</Flex.Item>
        </Flex>
        <Flex justify="between" align="start">
            <Flex.Item className="remarks" style={{ "flex": "3" }}>{props.remarks}</Flex.Item>
            <Flex.Item className="number">{props.number}</Flex.Item>
        </Flex>
    </div>
)

export default class CreateOffer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pure_price: "3560.00",
            remarks: "",
        }
    }
    render() {
        return (
            <div className="create-offer" key="1">
                <NavBar
                    className="create-server-nav-bar"
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => hashHistory.goBack()}
                    leftContent={<span style={{ fontSize: "15px" }}>返回</span>}
                >创建报价</NavBar>
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
                    <div className="sum-price-box clearfix">
                        <span className="left-title">总计</span>
                        <span className="right-sum-price">5632.00</span>
                    </div>
                    <InputItem
                        placeholder="auto focus"
                        value={this.state.remarks}
                        onChange={(v) => { this.setState({ remarks: v})}}
                    >标题</InputItem>
                </div>
            </div>
        )
    }
}

CreateOffer.contextTypes = {
    router: React.PropTypes.object
}