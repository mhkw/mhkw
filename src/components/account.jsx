import React from 'react';
import { NavBar, Icon, Toast, Button, Modal, InputItem } from 'antd-mobile';
import { hashHistory } from 'react-router';
import { Line, AccountListDetails } from './templateHomeCircle';
import { Motion, spring } from 'react-motion';
import BScroll from 'better-scroll'

import { Qbutton } from "./TemplateView";


export default class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            border:"line",
            show:true,
            height:"",
            blance:0,
            frozenCash:0,
            realName:false,
            financialList: sessionStorage.getItem("financialList") ? JSON.parse(sessionStorage.getItem("financialList")) : [],
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
            ],
            showPayInputModal: false,  //是否显示输入金额的弹窗
            showPayModal: false,  //是否显示付款的弹窗,充值
            payRecharge: 0,  //付款的支付总金额， 充值
            scroll: null, //滚动插件实例化对象
            scroll_bottom_tips: "上拉加载更多", //上拉加载的tips
            total_count: 0, //收支明细的总数量
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
        this.handleFinancialList = (res, pullingUp) => {
            // console.log(res.data);

            // this.setState({
            //     financialList: res.data.item_list, total_count: res.data.total_count  })

            if (res.success) {
                let newItemList = this.state.financialList;
                if (pullingUp) {
                    // newItemList.push(res.data.item_list);
                    newItemList = [...this.state.financialList, ...res.data.item_list];
                } else {
                    newItemList = res.data.item_list;
                    sessionStorage.setItem("financialList", JSON.stringify(newItemList));
                }

                this.setState({
                    financialList: newItemList,
                    total_count: res.data.total_count,
                    scroll_bottom_tips: res.data.total_count > 8 ? "上拉加载更多" : ""
                }, () => {
                    this.state.scroll.finishPullUp()
                    this.state.scroll.refresh();
                })
                
            } else {
                Toast.info(res.message, 1.5);
            }
        }
    }
    componentDidMount(){
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 25;
        const scroll = new BScroll(document.querySelector('.wrapper'), { click: true, pullUpLoad: { threshold: -50 }})
        this.setState({
            height: hei,
            scroll,
        })
        scroll.on('pullingUp', () => {
            this.ajaxNextPage();
        });
        runPromise('get_blance', {
            user_id:validate.getCookie('user_id')
        }, this.handleBlance, true, "post");
        runPromise('get_frozen_cash', {
            user_id:validate.getCookie('user_id')
        }, this.handleFrozenCash, true, "post");
        runPromise('get_real_name_auth', {
            user_id:validate.getCookie('user_id')
        }, this.handleRealName, true, "post");
        this.ajaxGetFinancialList();
    }
    ajaxGetFinancialList = (limit = 10, offset = 0, pullingUp = false) => {
        runPromise('get_financial_list', {
            user_id: validate.getCookie('user_id'),
            limit,
            offset,
        }, this.handleFinancialList, true, "post", pullingUp);
    }
    //下拉加载下一页
    ajaxNextPage = () => {
        let hasNextPage = false;

        let offset = this.state.financialList.length;
        if (offset < this.state.total_count) {
            hasNextPage = true;
        }
        
        this.setState({
            scroll_bottom_tips: hasNextPage ? "加载中..." : "加载完成"
        })

        if (hasNextPage) {
            setTimeout(() => {
                this.ajaxGetFinancialList(10, offset, true);
            }, 500);
        }
        
    }
    hasAdmin () {
        // console.log(this.state.realName);
        
        if (this.state.realName == 2){
            // Toast.info('您已实名认证，可以提现', 2, null, false);
        }else{
            Toast.info('您还未实名认证，不能提现', 2, null, false);
        }
        hashHistory.push({
            pathname: '/withdraw',
            query: { form: 'account', blance: this.state.blance },
            // state: {
            //     realName: this.state.realName,
            //     blance: this.state.blance,
            // }
        });
    }
    //校验充值金额
    testPrice(val) {
        if (!(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val))) {
            Toast.info("输入金额错误！", 1);
            return false;
        } else {
            return true;
        }
    }
    //打开充值弹窗
    clickRecharge = () => {
        let payRecharge = this.state.payRecharge;
        if (this.testPrice(payRecharge)) {
            this.setState({ showPayInputModal: false, showPayModal: true })
        }
        hashHistory.push({
            pathname: '/account/payModal',
            query: { form: 'account' }
        });
    }
    setShowModal = (param) => {
        this.setState({ showPayModal: param })
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
    render() {
        return(
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div className="accountWrap" style={{ ...interpolatingStyle, position: "relative" }}>
                        <NavBar
                            className="top"
                            mode="light"
                            icon={<Icon type="left" size="lg" color="#333" />}
                            onLeftClick={() => hashHistory.goBack()}
                            rightContent={<Button className="rechargeButton" onClick={() => { this.setState({ showPayInputModal: true }) }}>充值</Button>}
                        >收支明细</NavBar>
                        <Line border={this.state.border}></Line>
                        <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                            <div>
                                <div className="accountWrapTop">
                                    <p>余额: {this.state.blance}元 &nbsp;&nbsp;{this.state.frozenCash == 0 ? null : '待解冻: ' + this.state.frozenCash + '元'}</p>
                                </div>
                                <div className="accountWrapMid">
                                    <span>{this.state.blance}</span> <Qbutton onClick={() => { this.hasAdmin() }}>提现</Qbutton>
                                </div>
                                <p className="getPayTitle">
                                    <span className="fn-left" ></span> 收支明细 <span className="fn-right"></span>
                                </p>
                                <div className="accountListDetails">
                                    <AccountListDetails item_list={this.state.financialList} blance={this.state.blance}></AccountListDetails>
                                    <div className="scroll-bottom-tips">{this.state.scroll_bottom_tips}</div>
                                </div>
                            </div>
                        </div>
                        <Modal
                            visible={this.state.showPayInputModal}
                            transparent
                            maskClosable={false}
                            onClose={() => { this.setState({ showPayInputModal: false}) }}
                            title="充值金额"
                            footer={[
                                { text: '取消', onPress: () => { this.setState({ showPayInputModal: false, payRecharge: '' }) }},
                                { text: '确定', onPress: () => { this.clickRecharge() }}
                            ]}
                        >
                            <InputItem
                                className="recharge-input"
                                type="text"
                                pattern="[0-9]*"
                                placeholder=""
                                maxLength="12"
                                value={this.state.payRecharge}
                                onChange={(val) => { val = val.trim(); this.setState({ payRecharge: val }) }}
                                clear
                            >
                            </InputItem>
                        </Modal>
                        {this.props.children && React.cloneElement(this.props.children, { 
                            paySuccessCallback: this.paySuccessCallback,
                            payFailCallback: this.payFailCallback, 
                            setShowModal: this.setShowModal, 
                            showModal: this.state.showPayModal, 
                            payment: this.state.payRecharge,
                            pay_model: 'other',
                            model_id: '', 
                        })}
                    </div>
                }
            </Motion>
        )
    }
}