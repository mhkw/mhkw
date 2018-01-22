import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Button, WingBlank, List, Modal} from 'antd-mobile';

const PayMethod = (props) => (
    <div className="pay-method-div">
        <NavBar
            className="NewNavBar"
            mode="light"
            icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
            onLeftClick={() => { hashHistory.push({ pathname: '/payModal'}) }}
        >选择支付方式</NavBar>
        <List className="pay-method-list">
            <List.Item arrow="horizontal" onClick={() => { hashHistory.push({ pathname: '/payModal'}), props.setState({ "PayMethod": "BankCardPay" }) }}><i className="iconfont icon-yinhangqia"></i>使用银行卡</List.Item>
            <List.Item arrow="horizontal" onClick={() => { hashHistory.push({ pathname: '/payModal'}), props.setState({ "PayMethod": "AliPay" }) }}><i className="iconfont icon-zhifubao"></i>支付宝</List.Item>
            <List.Item arrow="horizontal" onClick={() => { hashHistory.push({ pathname: '/payModal'}), props.setState({ "PayMethod": "WeiXinPay" }) }}><i className="iconfont icon-wxpay"></i>微信</List.Item>
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
                onClick={() => { hashHistory.push({ pathname: '/payMethod' }) }}
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
                "WeiXinPay":"微信",
            },
        }
    }
    onClickPay = () => {
        console.log({ "payment": this.props.payment, "PayMethod": this.state.PayMethod});
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