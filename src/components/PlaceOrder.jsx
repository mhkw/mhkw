import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Button, InputItem, WingBlank } from 'antd-mobile';

// import OrderPopup from "./OrderPopup";

export default class PlaceOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navBarTitle: "品牌设计师 Miazhang",
            address: "浙江-杭州",
            orderPrice: "",
            remarks: "",
            payment: "1",
            showModal: false, //显示弹窗
            projectId: 0, //订单号，0默认为充值
        }
        //ajax处理函数，给设计师下单
        this.handleServiceSimple = (res) => {
            if (res.success) {
                this.setState({
                    projectId: res.data,
                    showModal: true
                })
                hashHistory.push({
                    pathname: '/placeOrder/payModal',
                    query: { form: 'placeOrder' },
                    state: {}
                });
            } else {
                Toast.fail(res.message, 2);
            }
        }
    }
    onClickSubmit = () => {
        console.log("tijiao");
        if (!this.state.payment) {
            Toast.offline("请填写金额", 1);
            return;
        }
        // !this.state.payment ? Toast.offline("请填写金额", 1) : this.setState({ "showModal": true })

        //发送ajax,给设计师下单
        runPromise("book_service_simple", {
            user_id: 69590,
            attention: this.state.remarks,
            auth_user_id: 69123,
            total_price: this.state.payment,
        }, this.handleServiceSimple); 

    }
    setShowModal = (param) => {
        this.setState({ showModal: param })
    }
    //支付成功的回调
    paySuccessCallback = () => {
        Toast.success("支付成功!", 1, () => {
            this.setShowModal(false); //关闭支付Modal
            hashHistory.goBack();
            this.getMainProjectList(); //重新刷新项目列表
        })
    }
    //支付失败的回调
    payFailCallback = () => {
        Toast.offline("支付失败!", 1, () => {
            this.setShowModal(false); //关闭支付Modal
            hashHistory.goBack();
        })
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
                    <InputItem
                        className="order-price-box"
                        type="money"
                        placeholder="请输入金额"
                        clear
                        value={this.state.orderPrice}
                        onChange={(val) => { this.setState({ orderPrice: val }) }}
                        onBlur={(val) => { let price = (val - 0).toFixed(2); isNaN(price) || price == 0 ? (Toast.offline("金额错误", 1), this.setState({ orderPrice: "" }) ): this.setState({ payment: price }) }}
                    >订单金额(元)</InputItem>
                    <InputItem
                        className="remarks-input"
                        type="string"
                        placeholder="添加备注"
                        value={this.state.remarks}
                        onChange={(val) => { this.setState({remarks: val}) }}
                    ><i className="iconfont icon-bianji"></i></InputItem>
                    <div className="payment-box">
                        <span className="left">实际付款(元)</span>
                        <span className="right ellipsis">{this.state.payment}</span>
                    </div>
                    <Button onClick={() => { this.onClickSubmit() }} className="payment-bottom" activeClassName="payment-bottom-active" >和设计师已确认，立即下单</Button>
                </WingBlank>
                {/* <OrderPopup setShowModal={this.setShowModal} showModal={this.state.showModal} payment={this.state.payment} /> */}
                {this.props.children && React.cloneElement(this.props.children,{ 
                    paySuccessCallback: this.paySuccessCallback,
                    payFailCallback: this.payFailCallback, 
                    setShowModal: this.setShowModal, 
                    showModal: this.state.showModal,
                    payment: this.state.payment,
                    pay_model: 'other',
                    model_id: '', 
                })}
            </div>
        )
    }
}

PlaceOrder.contextTypes = {
    router: React.PropTypes.object
};