import React from 'react';
import { NavBar, Icon, SegmentedControl, WingBlank, Tabs, Modal, InputItem, Toast, TextareaItem } from 'antd-mobile';
import { hashHistory } from 'react-router';
import { Line,Jiange } from './templateHomeCircle';
import { OrderItemList } from "./TemplateView";
import QueueAnim from 'rc-queue-anim';

// require("../css/person.scss");
const urls = [require('../images/touxiang.png')];
const tempNull = require('../images/tempNull2.png'); //空状态的图片
const loadingGif = require('../images/loading.gif'); //图形验证码加载中的GIG动图

let tabsLabel = [
    { title: '进行中的订单', sub: '1' },
    { title: '历史订单', sub: '2' },
];

export default class Account extends React.Component {
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
            selectedScoreEnd: false //选中的评论弹窗是否已经评论。即弹窗是已评论还是没评论，已评论
        }
        this.handleSend = (res,fg) =>{
            // console.log(res,fg);            
            if (fg == 2) {
                this.setState({
                    item_list_ing: res.data.item_list
                });
            }
            if (fg == 5) {
                this.setState({
                    item_list_end: res.data.item_list
                });
            }
        }
        //图形验证码发送成功后的执行函数
        this.handlePicSend = (res, param) => {
            console.log(res);
            if (res.success) {
                //发送短信验证码
                this.sendMessage(param.phone, param.secode);
            } else {
                Toast.info('图形验证码不正确', 2, null, false);
                this.setState({ codeNum: ++this.state.codeNum });
            }
        }
        //短信验证码发送成功后的执行函数
        this.handleMsgSend = (res) => {
            if (res.success) {
                this.SMSCountdown();
            } else {
                this.setState({ codeNum: ++this.state.codeNum });
            }
            Toast.info(res.message, 1.5);
        }
        //确认验收发送成功后的执行函数
        this.handleConfirmOrder = (res) => {
            if (res.success) {
                Toast.info(res.message, 1.5, ()=>{
                    this.changeShowConfirmOrder(false);
                });
            } else {
                Toast.info(res.message, 1.5);
            }
        }
        //订单评价后的处理函数
        this.handleAppraise = (res) => {
            if (res.success) {
                Toast.info(res.message, 1.5, () => {
                    this.changeShowScoreModal(false);
                    let index = this.state.selectedSegmentIndex;
                    this.getMainProjectList(index, 2);  //进行中的订单
                    this.getMainProjectList(index, 5);  //历史订单
                });
            } else {
                Toast.info(res.message, 1.5);
            }
        }
        //提醒验收后的处理函数
        this.handleRemindOrder = (res) => {
            if (res.success) {
                Toast.info("成功提醒对方验收!", 1.5);
            } else {
                Toast.info(res.message, 1.5);
            }
        }
    }
    componentDidMount(){
        this.getMainProjectList(0, 2);  //进行中的订单
        this.getMainProjectList(0, 5);  //历史订单
        //用state保存用户手机号
        this.setState({
            confirmOrderPhone: validate.getCookie("user_phone")
        });
    }
    onChangeControl = (e) => {
        let selectedSegmentIndex = e.nativeEvent.selectedSegmentIndex;
        this.getMainProjectList(selectedSegmentIndex, 2);  //进行中的订单
        this.getMainProjectList(selectedSegmentIndex, 5);  //历史订单
        this.setState({ selectedSegmentIndex })
    }
    onValueChange = (value) => {
        console.log(value);
    }
    /**
     * ajax获取数据-报价-获取报价列表
     * 
     * @author ZhengGuoQing
     * @param {any} is_quoter 是否报价方（乙方），0否（甲方），1是（乙方）
     * @param {any} quote_status 报价阶段，0草稿，1待处理，2报价成功，3报价失败，4取消报价，5报价超时，可不填，表示全部 (这里只传空字符串表示进行中，传5表示历史订单)
     * @param {number} stage_id 项目状态，1甲方付首款，2乙方作业中，3甲方付尾款，4双方互评5，项目完成，可不填，表示全部
     * @param {number} [per_page=10] 每页大小，默认为10
     * @param {number} [page=1] 第几页，默认为1（从1开始计数）
     * @memberof Account
     */
    getMainProjectList(is_quoter, stage_id, per_page = 10, page = 1) {
        runPromise("get_main_project_list", {
            "per_page": per_page,
            "page": page,
            /*quote_status：2表示订单*/
            "quote_status": 2,
            /*is_quoter：0表示服务方*/
            "is_quoter": is_quoter,
            stage_id: stage_id, //项目状态，进度
        }, this.handleSend, true, "post", stage_id);
    }
    //判断是打开还是关闭确认验收的弹窗
    changeShowConfirmOrder = (isShow) => {
        this.setState({ showConfirmOrder: isShow});
        //如果是关闭，则清空图形验证码和短信验证码
        if (!isShow) {
            this.setState({
                picCode: "", //确认验收的图形验证码
                SMSCode: "", //确认验收的短信验证码
            })
        }
    }
    //发送确认验收的请求
    ConfirmOrder() {
        let { confirmOrderPhone, picCode, SMSCode, confirmOrderID} = this.state;
        if (this.testPhone(confirmOrderPhone) && this.testPicCode(picCode) && this.testSMSCode(SMSCode)) {
            //发送确认验收的请求,报价订单，同意验收
            runPromise('project_pay_confirm', {
                "project_id": confirmOrderID,
                "code": SMSCode
            }, this.handleConfirmOrder, true, "post");
        }
    }
    //图形验证码输入
    onChangeYzm = (value) => {   
        this.setState({
            picCode: value.toUpperCase()
        })
    }
     //短信验证码输入
    onChangeSMSCode = (value) => {  
        this.setState({
            SMSCode: value
        })
    }
    numPlus(e) {     //图形验证码刷新
        e.currentTarget.setAttribute("src", loadingGif);
        setTimeout(() => {
            this.setState({
                codeNum: ++this.state.codeNum
            })
        }, 200)
    }
    testPhone(val) {
        if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(val))) {
            Toast.info("手机号错误！", 1);
            return false;
        } else {
            return true;
        }
    }
    //验证图形验证码是否输入
    testPicCode(val) {
        let value = val.replace(" ", "");
        if (!(/^.{4}$/.test(value))) {
            Toast.info("请输入4位图形验证码", 1);
            return false;
        } else {
            return true;
        }
    }
    testSMSCode(val, noLimitSMSCode = false) {
        if (this.state.SMSCodeTxt == "获取验证码" || noLimitSMSCode) {
            if (!(/^\d{1,6}$/.test(val))) {
                Toast.info("请输入6位短信验证码", 1);
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
    SMSCountdown() {
        let second = 60;
        let then = this;
        var value = second + "S后重试";
        then.setState({ SMSCodeTxt: value });
        function render() {
            var value = second + "S后重试";
            then.setState({ SMSCodeTxt: value });
            second--;
            if (second === 0) {
                window.clearInterval(token);
                then.setState({ SMSCodeTxt: "获取验证码" });
            }
        }
        let token = window.setInterval(render, 1000);
    }
    //点击获取短信验证码按钮
    handleSMSCode = () => {
        let phoneValue = this.state.confirmOrderPhone;
        let picCode = this.state.picCode;
        if (this.testPhone(phoneValue) && this.testPicCode(picCode) && this.state.SMSCodeTxt == "获取验证码") {
            //发送ajax验证图形验证码
            // this.onPicCode(picCode, phoneValue);
            //发送ajax获取短信验证码
            this.sendMessage(picCode, phoneValue);
        }
    }
    //发送请求验证图形验证码
    onPicCode(secode, phone) {   
        runPromise("check", {
            secode: secode
        }, this.handlePicSend, false, "post", { phone: phone, secode: secode});
    }
    //发送短信验证码
    sendMessage(secode, phone) {     
        runPromise('get_reg_sms_code', {
            "type": "project_pay_confirm",
            "mobile": phone,
            "tokeen": secode
        }, this.handleMsgSend, false, "post");
    }
    //判断是打开还是关闭评价的弹窗
    changeShowScoreModal = (isShow) => {
        this.setState({ showScoreModal: isShow });
        //如果是关闭，则清空图形验证码和短信验证码
        if (!isShow) {
            this.setState({
                selectedScore: 0, //选中的弹窗的评分
                selectedScoreComment: "" //选中的弹窗的评论留言
            })
        } else {
            let token = setTimeout(() => {
                if (this.state.selectedScoreEnd) {
                    document.querySelector(".comment textarea").value = this.state.selectedScoreComment;
                }
                clearTimeout(token);
            }, 300);
        }
    }
    //确认评价
    ConfirmScore() {
        let { selectedScore, selectedScoreComment, confirmOrderID, selectedScoreEnd} = this.state;
        if (selectedScoreEnd) {
            this.changeShowScoreModal(false);
            return;
        }
        if (selectedScore < 1) {
            Toast.info("请选择评分", 1);
            return ;
        }
        if (selectedScoreComment.trim().length < 1) {
            Toast.info("请输入评价", 1);
            return;
        }
        //ajax发送评价的请求
        runPromise('do_appraise', {
            "project_id": confirmOrderID,
            "appraise_score": selectedScore,
            "appraise_txt": selectedScoreComment
        }, this.handleAppraise);
    }
    //ajax提醒验收
    remindOrder = () => {
        let { confirmOrderID } = this.state;
        //ajax发送提醒验收的请求,项目验收提醒
        runPromise('project_pay_ask', {
            "project_id": confirmOrderID,
        }, this.handleRemindOrder);

        //ajax发送提醒验收的请求,项目验收提醒
        runPromise('project_pay_remind', {
            "project_id": confirmOrderID,
        }, () => {});
    }
    render() {
        return(
            <QueueAnim className="demo-content" type={['right', 'right']}>
                {this.state.show ? [
                <div className="orderListWrap" key="0">
                    <NavBar
                        mode="light"
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
                                values={['作为需求方', '作为服务方']}
                                tintColor={'#606060'}
                                style={{ height: '28px', width: '250px' }}
                                onChange={this.onChangeControl}
                                selectedIndex={this.state.selectedSegmentIndex}
                            />
                        </WingBlank>
                    </NavBar>
                    <Jiange name="jianGe"></Jiange>
                    <Tabs tabs={tabsLabel}
                        initialPage={0}
                        // onChange={(tab, index) => { console.log('onChange', index, tab); }}
                        // onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                    >
                        <div className="orderItemList" >
                            <div className="orderItem">
                                <div className="orderItemLis">
                                    <ul>
                                        {
                                            this.state.item_list_ing.length ? (
                                                this.state.item_list_ing.map((val, index) => (
                                                    <div>
                                                        <OrderItemList 
                                                            {...val} 
                                                            is_quoter={this.state.selectedSegmentIndex}
                                                            changeShowConfirmOrder={this.changeShowConfirmOrder}
                                                            changeShowScoreModal={this.changeShowScoreModal}
                                                            remindOrder={this.remindOrder}
                                                            setState={this.setState.bind(this)} 
                                                        />
                                                        <Jiange name="jianGe"></Jiange>
                                                    </div>
                                                ))
                                            ) : (
                                                <img src={tempNull} />
                                            )
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="orderItemList" >
                            <div className="orderItem">
                                <div className="orderItemLis">
                                    <ul>
                                        {
                                            this.state.item_list_end.length ? (
                                                this.state.item_list_end.map((val, index) => (
                                                    <div>
                                                        <OrderItemList 
                                                            {...val} 
                                                            is_quoter={this.state.selectedSegmentIndex}
                                                            changeShowConfirmOrder={this.changeShowConfirmOrder}
                                                            changeShowScoreModal={this.changeShowScoreModal}
                                                            remindOrder={this.remindOrder}
                                                            setState={this.setState.bind(this)}  
                                                        />
                                                        <Jiange name="jianGe"></Jiange>
                                                    </div>
                                                ))
                                            ) : (
                                                <img src={tempNull} />
                                            )
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Tabs>
                    <Modal
                        className="Confirm-order-modal"
                        visible={this.state.showConfirmOrder}
                        transparent
                        maskClosable={false}
                        closable={true}
                        onClose={() => { this.changeShowConfirmOrder(false) }}
                        title={
                            <div style={{ marginTop:'10px' ,textAlign: 'left', lineHeight: '20px', fontSize: '14px' }}>
                                <p>请确认是否收到设计师的提交成果！付款后，资金将直接从您的账户转到设计师的账户！</p>
                                <p style={{ "margin-top":"15px","font-size": "16px", "color": "#090909"}}>验证手机号：{this.state.confirmOrderPhone}</p>
                            </div>
                        }
                        footer={[
                            { text: '取消', onPress: () => { this.changeShowConfirmOrder(false) } },
                            { text: '确定', onPress: () => { this.ConfirmOrder(); } }
                        ]}
                    >
                        <div className="verification-phone-box" style={{"margin-bottom": "0.3rem"}}>
                            {/* <input type="text" value="" className="verification-code h5offerInput"/> */}
                            <InputItem
                                className="verification-code h5offerInput"
                                type="text"
                                placeholder="图形验证码"
                                maxLength={4}
                                value={this.state.picCode}
                                onChange={this.onChangeYzm}
                            ></InputItem>
                            <span className="code allow codeH5offerSheet">
                                <img 
                                    className="codePouup" 
                                    src={'https://www.huakewang.com/index.php/verifycode/index/' + this.state.codeNum}
                                    onClick={(e) => { this.numPlus(e) }}
                                />
                            </span>
                        </div>
                        <div className="verification-phone-box">
                            {/* <input type="number" value="" className="verification-code"/> */}
                            <InputItem
                                className="verification-code"
                                type="tel"
                                pattern="[0-9]*"
                                placeholder="短信验证码"
                                maxLength={4}
                                value={this.state.SMSCode}
                                onChange={this.onChangeSMSCode}
                            ></InputItem>
                            <span 
                                className="code allow h5offerSpan"
                                onClick={this.handleSMSCode}
                            >{this.state.SMSCodeTxt}</span>
                        </div>
                    </Modal>
                    <Modal
                        className="score-modal"
                        visible={this.state.showScoreModal}
                        transparent
                        maskClosable={false}
                        closable={true}
                        onClose={() => { this.changeShowScoreModal(false) }}
                        footer={[
                            { text: '取消', onPress: () => { this.changeShowScoreModal(false) } },
                            { text: '确定', onPress: () => { this.ConfirmScore(); } }
                        ]}
                    >
                        <div className="info">
                            <span className="scoreTitle">评分</span>
                            <i onClick={() => { !this.state.selectedScoreEnd ? this.setState({selectedScore: 1}) : null }} className={ this.state.selectedScore > 0 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing" } ></i>
                            <i onClick={() => { !this.state.selectedScoreEnd ? this.setState({selectedScore: 2}) : null }} className={ this.state.selectedScore > 1 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing" } ></i>
                            <i onClick={() => { !this.state.selectedScoreEnd ? this.setState({selectedScore: 3}) : null }} className={ this.state.selectedScore > 2 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing" } ></i>
                            <i onClick={() => { !this.state.selectedScoreEnd ? this.setState({selectedScore: 4}) : null }} className={ this.state.selectedScore > 3 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing" } ></i>
                            <i onClick={() => { !this.state.selectedScoreEnd ? this.setState({selectedScore: 5}) : null }} className={ this.state.selectedScore > 4 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing" } ></i>
                        </div>
                        <TextareaItem
                            className="comment"
                            title="评价"
                            count={200}
                            autoHeight 
                            disabled={this.state.selectedScoreEnd}
                            // value={this.state.selectedScoreComment}
                            // onChange={(val) => { this.setState({ selectedScoreComment: val}) }}
                            // ref={el => this.commentTextarea = el }
                            onBlur={(val) => { this.setState({ selectedScoreComment: val }) }}
                        />
                    </Modal>
                </div>
                ] : null}
            </QueueAnim>
        )
    }
}