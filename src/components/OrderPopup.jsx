import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Button, WingBlank, List, Modal} from 'antd-mobile';

const PayMethod = (props) => (
    <div className="pay-method-div">
        <NavBar
            className="NewNavBar"
            mode="light"
            icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
            onLeftClick={() => { hashHistory.replace({ pathname: '/payModal'}) }}
        >选择支付方式</NavBar>
        <List className="pay-method-list">
            <List.Item arrow="horizontal" onClick={() => { hashHistory.replace({ pathname: '/payModal' }), props.setState({ "PayMethod": "BankCardPay" }) }}><i className="iconfont icon-yinhangqia"></i>使用银行卡</List.Item>
            <List.Item arrow="horizontal" onClick={() => { hashHistory.replace({ pathname: '/payModal' }), props.setState({ "PayMethod": "AliPay" }) }}><i className="iconfont icon-zhifubao"></i>支付宝</List.Item>
            <List.Item arrow="horizontal" onClick={() => { hashHistory.replace({ pathname: '/payModal' }), props.setState({ "PayMethod": "WxPay" }) }}><i className="iconfont icon-wxpay"></i>微信</List.Item>
        </List>
    </div>
)

const PayModal = (props) => (
    <div className="pay-modal-div">
        <NavBar
            className="NewNavBar"
            mode="light"
            icon={<i className="iconfont icon-untitled94"></i>}
            onLeftClick={() => { props.props.setShowModal(false) }}
        >订单支付</NavBar>
        <List className="pay-list">
            <List.Item
                className="one"
                extra={<span>{props.state.PayMethodText[props.state.PayMethod]}<i className="iconfont icon-jiantou1"></i></span>}
                onClick={() => { hashHistory.replace({ pathname: '/payMethod' }) }}
            >付款方式</List.Item>
            <List.Item
                className="two"
                extra={"￥" + props.props.payment}
            >需付款</List.Item>
        </List>
        <Button
            onClick={props.onClickPay}
            className="pay-button"
            activeClassName="pay-button-active"
        >立即支付</Button>
    </div>
)

class OrderPopup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            PayMethod: "AliPay",
            PayMethodText: {
                "BankCardPay": "使用银行卡",
                "AliPay": "支付宝",
                "WxPay":"微信",
            },
        }
        this.handleAjaxToPay = (res) => {
            Toast.hide();
            // console.log(res);
            if (res.success) {
                let orderInfo;
                if (this.state.PayMethod == "AliPay") {
                    orderInfo = res.data.return_page;
                }
                if (this.state.PayMethod == "WxPay") {
                    orderInfo = res.data;
                }
                this.callPayPlug(this.state.PayMethod, orderInfo);
            } else {
                Toast.info(res.message, 1.5);
            }
        }
    }
    onClickPay = () => {
        console.log({ "payment": this.props.payment, "PayMethod": this.state.PayMethod});
        this.ajaxToPay(this.props.model_id, this.props.payment, this.state.PayMethod, this.props.pay_model,);
        //由于生成订单需要时间，加一个弹窗提示。
        Toast.loading("加载中...", 6);
    }
    //ajax支付,获取签名后的订单参数
    ajaxToPay = (model_id, totalAmount, pay_type = "AliPay", pay_model = "project") => {
        runPromise("get_pay_param", {
            "pay_model": pay_model,
            "pay_type": pay_type,
            "model_id": model_id,
            "totalAmount": totalAmount,
            "show_type": "wap",
        }, this.handleAjaxToPay);
    }
    /**
     * 调用系统原生支付模块
     * 
     * @memberof OrderPopup
     * @param PayMethod 调用支付方式，AliPay：支付宝支付；WxPay：微信支付
     * @param orderInfo 支付信息（由订单信息，签名，签名类型组成）,微信和支付宝处理方式不同
     */
    callPayPlug = (PayMethod, orderInfo) => {
        if (!window.api ) {
            return;
        }
        //支付宝支付
        if (PayMethod == "AliPay") {
            let aliPayPlus = api.require('aliPayPlus');
            aliPayPlus.payOrder({
                orderInfo: orderInfo
            }, (ret, err) => {
                if (ret.code == 9000) {
                    this.props.paySuccessCallback();
                } else {
                    this.props.payFailCallback();
                }
            });
        }
        //微信支付
        // if (PayMethod == "WxPay") {
        //     let config = JSON.parse(orderInfo);
        //     let wxPay = api.require('wxPay');
        //     wxPay.payOrder({
        //         apiKey: '',
        //         orderId: '',
        //         mchId: '',
        //         nonceStr: '',
        //         timeStamp: '',
        //         package: '',
        //         sign: ''
        //     }, function (ret, err) {
        //         if (ret.status) {
        //             //支付成功
        //         } else {
        //             alert(err.code);
        //         }
        //     });
        // }
        
    }
    render() {
        return (
            <WingBlank>
                <Modal
                    popup
                    visible={this.props.showModal}
                    onClose={() => { this.props.setShowModal(false) }}
                    animationType="slide-up"
                >
                    {this.props.children && React.cloneElement(this.props.children, { state: this.state , props: this.props , setState: this.setState.bind(this) , onClickPay: this.onClickPay })}
                </Modal>
            </WingBlank>
        )
    }
}

export { OrderPopup, PayMethod, PayModal};

OrderPopup.contextTypes = {
    router: React.PropTypes.object
};