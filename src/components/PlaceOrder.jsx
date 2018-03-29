import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Button, InputItem, WingBlank, List, Switch, Stepper  } from 'antd-mobile';

// import OrderPopup from "./OrderPopup";

export default class PlaceOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navBarTitle: "品牌设计师 Miazhang",
            address: "浙江-杭州",
            orderPrice: "",
            remarks: "",
            payment: '',
            showModal: false, //显示弹窗
            projectId: 0, //订单号，0默认为充值
            Switch: false, //是否需要发票的Switch，默认不需要发票
            StepperDay: 1, //约定完成周期,天数,默认7天
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
        if (!this.state.payment) {
            Toast.offline("请填写金额", 1);
            return;
        }
        // !this.state.payment ? Toast.offline("请填写金额", 1) : this.setState({ "showModal": true })

        //发送ajax,给设计师下单
        runPromise("book_service_simple", {
            attention: this.state.remarks,
            need_invoice: this.state.Switch ? 1 : 0,
            days: this.state.StepperDay,
            tax: ((this.state.orderPrice - 0)*0.06).toFixed(2),
            total_price: this.state.payment,
            auth_user_id: 69123,
            // auth_user_id: this.props.designer.id,
            project_id: 0,
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
        })
    }
    //支付失败的回调
    payFailCallback = () => {
        Toast.offline("支付失败!", 1, () => {
            this.setShowModal(false); //关闭支付Modal
            hashHistory.goBack();
        })
    }
    onChangeStepperDay = (val) => {
        if (isNaN(val) || val == "") {
            return;
        } else {
            let token = setTimeout(() => {
                this.setState({ StepperDay: val })
                clearTimeout(token);
            }, 200);
        }
    }
    onBlurOrderPrice = (val) => {
        let price = (val - 0).toFixed(2); 
        if (isNaN(price) || price == 0) {
            Toast.info("请输入订单金额", 1);
            this.setState({ orderPrice: "", payment: null})
        } else {
            //如果需要发票，就得加上6%的税
            if (this.state.Switch) {
                price = (price * 1.06).toFixed(2);
            }
            this.setState({ payment: price })
        }
    }
    onClickSwitch = (checked) => {
        this.setState({ Switch: checked },()=>{
            //是否需要发票将影响总价格
            this.onBlurOrderPrice(this.state.orderPrice);
        });
    }
    render() {
        return (
            <div key="1" className="place-order">
                <NavBar
                    className="NewNavBar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                >{this.props.designer.nick_name}</NavBar>
                <WingBlank>
                    <p className="address-p">
                        <i className="iconfont icon-dingwei"></i>
                        <span className="address">{this.props.designer.txt_address}</span>
                    </p>
                    <List className="order-price-out-box">
                        <InputItem
                            className="order-price-box"
                            type="money"
                            placeholder="请输入金额"
                            clear
                            value={this.state.orderPrice}
                            onChange={(val) => { this.setState({ orderPrice: val }) }}
                            onBlur={(val) => { this.onBlurOrderPrice(val) }}
                        >订单金额(元)</InputItem>
                        <List.Item
                            className="list-switch"
                            extra={<Switch
                                checked={this.state.Switch}
                                onClick={(checked) => { this.onClickSwitch(checked) }}
                            />}
                        >{this.state.Switch ? '需要发票(税率6%)' : '不需要发票'}</List.Item>
                        <List.Item
                            extra={
                                <Stepper
                                    style={{ width: '100%', minWidth: '100px' }}
                                    className="my-stepper"
                                    showNumber
                                    max={500}
                                    min={1}
                                    value={this.state.StepperDay}
                                    // onChange={(value) => { this.setState({ StepperDay: value}) }}
                                    onChange={(val) => this.onChangeStepperDay(val)}
                                    onBlur={(e) => { e.target.value < 1 ? this.onChangeStepperDay(1) : null }}
                                />}
                        >约定完成天数</List.Item>
                    </List>
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
                    pay_model: 'project',
                    model_id: this.state.projectId, 
                })}
            </div>
        )
    }
}

PlaceOrder.contextTypes = {
    router: React.PropTypes.object
};