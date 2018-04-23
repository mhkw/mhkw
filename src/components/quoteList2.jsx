import React from 'react';
import { NavBar, Icon, SegmentedControl, WingBlank, Tabs, Modal, InputItem, Toast, TextareaItem } from 'antd-mobile';
import { hashHistory } from 'react-router';
import { Line,Jiange } from './templateHomeCircle';
import { QuoteItemList } from "./TemplateView";
import { Motion, spring } from 'react-motion';
import BScroll from 'better-scroll'

// require("../css/person.scss");
const urls = [require('../images/touxiang.png')];
const tempNull = require('../images/tempNull2.png'); //空状态的图片
const loadingGif = require('../images/loading.gif'); //图形验证码加载中的GIG动图

let tabsLabel = [
    { title: '全部', quote_status: '' },
    { title: '待处理', quote_status: '1' },
    { title: '报价成功', quote_status: '2' },
    { title: '报价失败', quote_status: '3' },
    { title: '取消报价', quote_status: '4' },
    { title: '报价超时', quote_status: '5' },
];
export default class Account2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            border:"line",
            show:true,
            showConfirmOrder: false, //是否显示确认验收的Modal弹窗
            selectedSegmentIndex: 0,
            picCode: "", //确认验收的图形验证码
            codeNum: 2, //确认验收的图形验证码图片地址后缀
            SMSCode: "", //确认验收的短信验证码
            SMSCodeTxt: "获取验证码", //确认验收的短信验证码上的文字
            confirmOrderPhone: "",
            confirmOrderID:"", //项目ID
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
            item_list_ing: [], //进行中的订单
            item_list_end: [], //历史订单
            showScoreModal: false,
            selectedScore: 0, //选中的弹窗的评分
            selectedScoreComment: "", //选中的弹窗的评论留言
            selectedScoreEnd: false, //选中的评论弹窗是否已经评论。即弹窗是已评论还是没评论，已评论
            item_quote_status_: null, //报价tabs页，报价阶段，全部
            item_quote_status_1: null, //报价tabs页，报价阶段，待处理
            item_quote_status_2: null, //报价tabs页，报价阶段，报价成功
            item_quote_status_3: null, //报价tabs页，报价阶段，报价失败
            item_quote_status_4: null, //报价tabs页，报价阶段，取消报价
            item_quote_status_5: null, //报价tabs页，报价阶段，报价超时
            selectedQuote_status: '', //用户选中的报价阶段，默认为全部
            showPayModal: false,  //是否显示付款的弹窗
            payModel_id: 0,  //付款的模块ID
            payTotalAmount: 0,  //付款的支付总金额
            height:"",
            changeTabIndex: "",
        }
        this.handleSend = (res, quote_status) => {
            if (res.success) {
                let state_key = 'item_quote_status_' + quote_status;
                // console.log(res.data.item_list)
                this.setState({
                    [state_key]: res.data.item_list
                })
            } else {
                Toast.info(res.message, 1.5);
            }         
            
        }
        this.handleChangeProjectStatus = (res) => {
            if (res.success) {
                Toast.info(res.message, 1, () => {
                    this.getMainProjectList();
                });
            } else {
                Toast.info(res.message, 1.5);
            }
        }
        
    }
    componentDidMount(){
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 68.5;
        const scroll = new BScroll(document.querySelector('.wrapper'), { click: true })
        this.setState({
            height: hei
        })
        this.getMainProjectList(0);  //收到的报价（甲方），全部
    }
    onChangeControl = (e) => {
        let selectedSegmentIndex = e.nativeEvent.selectedSegmentIndex;
        this.getMainProjectList(selectedSegmentIndex, this.state.selectedQuote_status);
        this.setState({ selectedSegmentIndex })
    }
    onChangeTabs = (tab, index) => {
        let quote_status = tab.quote_status;
        let state_quote_status = this.state['item_quote_status_' + quote_status];
        if (!state_quote_status) {
            this.getMainProjectList(this.state.selectedSegmentIndex, quote_status);
        }
        this.setState({
            selectedQuote_status: quote_status,
            changeTabIndex: index || ""
        })
    }
    /**
     * ajax获取数据-报价-获取报价列表
     * 
     * @author ZhengGuoQing
     * @param {any} is_quoter 是否报价方（乙方），0否（甲方），1是（乙方）
     * @param {any} quote_status 报价阶段，0草稿，1待处理，2报价成功，3报价失败，4取消报价，5报价超时，可不填，表示全部 (这里只传空字符串表示进行中，传5表示历史订单)
     * @param {number} [per_page=10] 每页大小，默认为10
     * @param {number} [page=1] 第几页，默认为1（从1开始计数）
     * @memberof Account
     */
    getMainProjectList(is_quoter = this.state.selectedSegmentIndex, quote_status = this.state.selectedQuote_status, per_page = 10, page = 1) {
        runPromise("get_main_project_list", {
            "per_page": per_page,
            "page": page,
            "is_quoter": is_quoter,
            "quote_status": quote_status,
            "type": 1, //项目类型，1是报价项目，2是服务项目，可不填，表示全部
        }, this.handleSend, true, "post", quote_status);
    }
    //同意支付下单
    agreeToPay = (model_id, totalAmount) => {
        // console.log(model_id, totalAmount);
        // this.ajaxToPay(model_id, totalAmount);
        this.setState({
            showPayModal: true,  //是否显示付款的弹窗
            payModel_id: model_id,  //付款的模块ID
            payTotalAmount: totalAmount,  //付款的支付总金额
        })
        hashHistory.push({
            pathname: '/quoteList/payModal',
            query: { form: 'quoteList' }
        });
    }
    
    setShowModal = (param) => {
        this.setState({ showPayModal: param })
    }
    /**
     * 报价状态切换
     * 
     * @memberof Account2
     * @param project_id 项目ID
     * @param quote_status 报价状态,3拒绝报价,4取消报价
     */
    refuseQuote = (project_id, quote_status) => {
        //拒绝报价
        if (quote_status == 3) {
            Modal.operation([
                { text: '已找到合作者', onPress: () => this.ajaxChangeProjectStatus(project_id, quote_status, '已找到合作者') },
                { text: '报价内容不满意', onPress: () => this.ajaxChangeProjectStatus(project_id, quote_status, '报价内容不满意') },
                { text: '报价偏高', onPress: () => this.ajaxChangeProjectStatus(project_id, quote_status, '报价偏高') },
                { text: '其他原因', onPress: () => this.ajaxChangeProjectStatus(project_id, quote_status, '其他原因') },
            ])
        }
        //取消报价
        if (quote_status == 4) {
            Modal.alert('确认取消报价?', '对方将不能同意或拒绝您的报价!', [
                { text: '取消', onPress: () => {}, style: 'default' },
                { text: '确定', onPress: () => this.ajaxChangeProjectStatus(project_id, quote_status, '') },
            ]);
        }
    }
    ajaxChangeProjectStatus = (project_id, quote_status, message) => {
        runPromise("change_main_project_status", {
            project_id,
            quote_status,
            message,
        }, this.handleChangeProjectStatus);
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
        return(
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div className="orderListWrap" style={{ ...interpolatingStyle, position: "relative" }}>
                        <NavBar
                            mode="light"
                            className="top"
                            icon={<i className="icon-leftarrow iconfont" style={{color:"#333",fontSize:"28px",marginTop:"4px"}}/>}
                            style={{ borderBottom:"1px solid #C7C7C7"}}
                            onLeftClick={()=>{
                                this.setState({
                                    show: !this.state.show
                                })
                                setTimeout(() => {
                                    hashHistory.goBack()
                                }, 150)
                            }}
                        >
                            <WingBlank 
                                size="lg" 
                                className="sc-example"
                            >
                                <SegmentedControl
                                    values={['收到的报价', '发出的报价']}
                                    tintColor={'#606060'}
                                    style={{ height: '28px', width: '250px' }}
                                    onChange={this.onChangeControl}
                                    selectedIndex={this.state.selectedSegmentIndex}
                                />
                            </WingBlank>
                        </NavBar>
                        <Tabs tabs={tabsLabel}
                            initialPage={0}
                            onChange={this.onChangeTabs}
                        // onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                        >
                            <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                                <div>
                                    <OrderItem
                                        // quote_status={""}
                                        quote_status={this.state.changeTabIndex}
                                        state={this.state}
                                        changeShowConfirmOrder={this.changeShowConfirmOrder}
                                        agreeToPay={this.agreeToPay}
                                        refuseQuote={this.refuseQuote}
                                        setState={this.setState.bind(this)}
                                    />
                                    {/* <OrderItem
                                        quote_status={1}
                                        state={this.state}
                                        changeShowConfirmOrder={this.changeShowConfirmOrder}
                                        agreeToPay={this.agreeToPay}
                                        refuseQuote={this.refuseQuote}
                                        setState={this.setState.bind(this)}
                                    />
                                    <OrderItem
                                        quote_status={2}
                                        state={this.state}
                                        changeShowConfirmOrder={this.changeShowConfirmOrder}
                                        agreeToPay={this.agreeToPay}
                                        refuseQuote={this.refuseQuote}
                                        setState={this.setState.bind(this)}
                                    />
                                    <OrderItem
                                        quote_status={3}
                                        state={this.state}
                                        changeShowConfirmOrder={this.changeShowConfirmOrder}
                                        agreeToPay={this.agreeToPay}
                                        refuseQuote={this.refuseQuote}
                                        setState={this.setState.bind(this)}
                                    />
                                    <OrderItem
                                        quote_status={4}
                                        state={this.state}
                                        changeShowConfirmOrder={this.changeShowConfirmOrder}
                                        agreeToPay={this.agreeToPay}
                                        refuseQuote={this.refuseQuote}
                                        setState={this.setState.bind(this)}
                                    />
                                    <OrderItem
                                        quote_status={5}
                                        state={this.state}
                                        changeShowConfirmOrder={this.changeShowConfirmOrder}
                                        agreeToPay={this.agreeToPay}
                                        refuseQuote={this.refuseQuote}
                                        setState={this.setState.bind(this)}
                                    /> */}
                                </div>
                            </div>
                        </Tabs>
                    
                        {this.props.children && React.cloneElement(this.props.children, { 
                            paySuccessCallback: this.paySuccessCallback, 
                            payFailCallback: this.payFailCallback, 
                            setShowModal: this.setShowModal, 
                            showModal: this.state.showPayModal, 
                            pay_model: 'project', 
                            model_id: this.state.payModel_id, 
                            payment: this.state.payTotalAmount 
                        })}
                    </div>
                }
            </Motion>
        )
    }
}
const OrderItem = (props) => (
    <div className="orderItemList" >
        <div className="orderItem">
            <div className="orderItemLis">
                <ul>
                    {
                        props.state['item_quote_status_' + props.quote_status] && props.state['item_quote_status_' + props.quote_status].length ? (
                            props.state['item_quote_status_' + props.quote_status].map((val, index) => (
                                val.quote_status != 0 ? <div>
                                    <QuoteItemList
                                        {...val}
                                        key={val.project_id} 
                                        is_quoter={props.state.selectedSegmentIndex}
                                        changeShowConfirmOrder={props.changeShowConfirmOrder}
                                        agreeToPay={props.agreeToPay}
                                        refuseQuote={props.refuseQuote}
                                        setState={props.setState}
                                    />
                                    <Jiange name="jianGe"></Jiange>
                                </div> : null
                            ))
                        ) : (
                                <img src={tempNull} />
                            )
                    }
                </ul>
            </div>
        </div>
    </div>
)