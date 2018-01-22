import React from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { hashHistory } from 'react-router';
import { Line, AccountListDetails } from './templateHomeCircle';
import QueueAnim from 'rc-queue-anim';

require("../css/person.scss");

export default class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            border:"line",
            show:true,
            account:[
                {
                    type:"充值",
                    numLeave:"8566.00",
                    time:"2017-12-20",
                    showMoney:"+88.00"
                },
                {
                    type: "在线支付",
                    numLeave: "8566.00",
                    time: "2017-12-20",
                    showMoney: "-88.90"
                }
            ]
        }
    }
    render() {
        return(
            <QueueAnim className="demo-content" leaveReverse
                animConfig={[
                    { opacity: [1, 0], translateX: [0, 50] },
                    { opacity: [1, 0], translateX: [0, -50] }
                ]}>
                {this.state.show ? [
                <div className="accountWrap" key="0">
                    <NavBar
                        mode="light"
                        icon={<Icon type="left" size="lg" color="#333" />}
                        onLeftClick={() => hashHistory.goBack()}
                    >收支明细</NavBar>
                    <Line border={this.state.border}></Line>
                    <div className="accountWrapTop">
                        <p>余额: 5000.00元 待解冻: 100.00元</p>
                    </div>
                    <div className="accountWrapMid">
                        <span>4900.00</span> <i>提现</i>
                    </div>
                    <p className="getPayTitle">
                        <span className="fn-left" ></span> 收支明细 <span className="fn-right"></span>
                    </p>
                    <div className="accountListDetails">
                        <AccountListDetails account={this.state.account}></AccountListDetails>
                    </div>
                </div>
                ] : null}
            </QueueAnim>
        )
    }
}