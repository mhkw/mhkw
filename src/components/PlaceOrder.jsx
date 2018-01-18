import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Button, InputItem, WingBlank } from 'antd-mobile';

export default class PlaceOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navBarTitle: "品牌设计师 Miazhang",
            address: "浙江-杭州",
            orderPrice: 9,
            remarks: "",
            payment: 9,
        }
    }
    onClickSubmit = () => {
        console.log("tijiao")
    }
    render() {
        return (
            <div key="1" className="place-order">
                <NavBar
                    className="NewNavBar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                >{this.state.navBarTitle}</NavBar>
                <WingBlank>
                    <p className="address-p">
                        <i className="iconfont icon-dingwei"></i>
                        <span className="address">{this.state.address}</span>
                    </p>
                    <div className="order-price-box">
                        <span className="left">订单金额(元)</span>
                        <span className="right">{this.state.orderPrice}</span>
                    </div>
                    <InputItem
                        className="remarks-input"
                        type="string"
                        placeholder="添加备注"
                        value={this.state.remarks}
                        onChange={(val) => { this.setState({remarks: val}) }}
                    ></InputItem>
                    <div className="payment-box">
                        <span className="left">实际付款(元)</span>
                        <span className="right">{this.state.payment}</span>
                    </div>
                    <Button onClick={this.onClickSubmit} className="payment-bottom" activeClassName="payment-bottom-active" >和设计师已确认，立即下单</Button>
                </WingBlank>
            </div>
        )
    }
}

PlaceOrder.contextTypes = {
    router: React.PropTypes.object
};