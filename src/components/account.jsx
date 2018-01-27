import React from 'react';
import { NavBar, Icon,Toast } from 'antd-mobile';
import { hashHistory } from 'react-router';
import { Line, AccountListDetails } from './templateHomeCircle';
import QueueAnim from 'rc-queue-anim';

// require("../css/person.scss");

export default class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            border:"line",
            show:true,
            blance:0,
            frozenCash:0,
            realName:false,
            financialList:{
                item_list:[],

            },
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
        this.handleBlance = (res) => {
            this.setState({blance:res.message})
        }
        this.handleFrozenCash = (res) => {
            this.setState({ frozenCash:res.message})
        }
        this.handleRealName = (res) => {
            this.setState({ realName: res.data.real_name_status})
        }
        this.handleFinancialList = (res) => {
            console.log(res.data);

            this.setState({ financialList:res.data })
        }
    }
    componentDidMount(){
        runPromise('get_blance', {
            user_id:validate.getCookie('user_id')
        }, this.handleBlance, true, "post");
        runPromise('get_frozen_cash', {
            user_id:validate.getCookie('user_id')
        }, this.handleFrozenCash, true, "post");
        runPromise('get_real_name_auth', {
            user_id:validate.getCookie('user_id')
        }, this.handleRealName, true, "post");
        runPromise('get_financial_list', {
            user_id:validate.getCookie('user_id'),
            offset: 0,
            limit: 10
        }, this.handleFinancialList, true, "post");
    }
    hasAdmin () {
        console.log(this.state.realName);
        
        if (this.state.realName == 2){
            Toast.info('您已实名认证，可以提现', 2, null, false);
        }else{
            Toast.info('您还未实名认证，不能提现', 2, null, false);
        }
    }
    render() {
        return(
            <QueueAnim className="demo-content" leaveReverse
                animConfig={[
                    { opacity: [1, 0], translateX: [0, 50] }
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
                        <p>余额: {this.state.blance}元 &nbsp;&nbsp;{this.state.frozenCash == 0 ? null : '待解冻: '+this.state.frozenCash+'元'}</p>
                    </div>
                    <div className="accountWrapMid">
                        <span>{this.state.blance}</span> <i onClick={() => { this.hasAdmin()}}>提现</i>
                    </div>
                    <p className="getPayTitle">
                        <span className="fn-left" ></span> 收支明细 <span className="fn-right"></span>
                    </p>
                    <div className="accountListDetails">
                            {console.log(this.state.financialList.item_list , 1111)}
                            
                        <AccountListDetails item_list={this.state.financialList.item_list}></AccountListDetails>
                    </div>
                </div>
                ] : null}
            </QueueAnim>
        )
    }
}