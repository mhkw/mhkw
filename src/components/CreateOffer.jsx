import React from 'react'
import { NavBar, Icon, Button, WingBlank, Flex, InputItem, DatePicker, List, Toast} from 'antd-mobile';
import { hashHistory, Link } from 'react-router';
import BScroll from 'better-scroll'

const OfferItem = (props) => (
    <div className="offer-item">
        <Flex justify="between" align="start">
            <Flex.Item className="title" style={{ "flex": "2" }}>{props.title}</Flex.Item>
            <Flex.Item className="price">{props.price}</Flex.Item>
        </Flex>
        <Flex justify="between" align="start">
            <Flex.Item className="remarks" style={{ "flex": "3" }}>{props.describe}</Flex.Item>
            <Flex.Item className="number">{props.number}</Flex.Item>
        </Flex>
    </div>
)

export default class CreateOffer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pure_price: "3560.00",
            remarks: "",
            customer_name: "",
            customer_company: "",
            customer_phone: "",
            project_name: "",
            cut_off_date: "",
            cut_off_day: "",
            height: "",
            inputDiscountPrice: "", //用户输入的优惠价格
            inputDiscountPriceError: false, //用户输入的优惠价格是否错误
            howManyDiscount: "",//几折优惠
            checkedServerList: [], //选中的服务项，即报价列表也页传递过来的数据
            checkPrice: 0, //选中的服务项的总价，即报价列表也页传递过来的数据
            checkPriceTax: 0, //选中的服务项的总价加上%6的税价。这个价格是这个页面生成的，还不是最后的价格，不保存到HOCoffer.jsx里
        }
    }
    componentWillMount() {
        // if (this.props.location.state) {
        //     let { checkedServerList, checkPrice } = this.props.location.state;
        //     this.setState({ 
        //         checkedServerList, 
        //         checkPrice,
        //         checkPriceTax: (parseFloat(checkPrice).toFixed(2) * 1.06).toFixed(2)
        //      });
        // }
        if (this.props.state.checkedServerList) {
            let { checkedServerList, checkPrice, checkPriceTax } = this.props.state;
            this.setState({
                checkedServerList,
                checkPrice,
                checkPriceTax,
            });
        }
        // if (this.props.customer_name) {
        //     this.setState({
        //         customer_name: this.props.customer_name,
        //         customer_company: this.props.customer_company,
        //         customer_phone: this.props.customer_phone,
        //     })
        // }
    }
    componentDidMount(){
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 25;
        const scroll = new BScroll(document.querySelector('.wrapper'), { click: true, bounceTime: 300, swipeBounceTime: 200 })
        this.setState({
            height: hei
        })
    }
    onOkDatePicker(date) {
        let year = date.getFullYear();
        let month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let formatDate = `${year}-${month}-${day}`;
        
        let nowTime = (new Date()).getTime(); //现在的时间
        let curTime = (new Date(date)).getTime(); //选择的时间
        let cut_off_day = Math.ceil( (curTime - nowTime) / (1000 * 60 * 60 * 24) );
        this.props.setState({ 
            cut_off_date: formatDate,
            cut_off_day: cut_off_day
        });
    }
    onClickCreateOffer = () => {
        // this.props.CreateOfferQuotation(); //点击生成报价单
        if (!this.checkInputEnter()) {
            return;
        }
        hashHistory.push({
            pathname: '/confirmOffer',
            query: { form: 'CreateOffer' },
        });
    }
    //检查用户是否输入了所有该填的输入框
    checkInputEnter = () => {
        if (this.state.checkedServerList.length < 1) {
            Toast.info('请选择服务', 1);
            return false;
        }
        if (!this.props.customer_name) {
            Toast.info('请输入客户姓名', 1);
            return false;
        }
        if (!this.props.customer_company) {
            Toast.info('请输入客户公司', 1);
            return false;
        }
        if (!this.props.customer_phone) {
            Toast.info('请输入客户手机', 1);
            return false;
        }
        if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.props.customer_phone))) {
            Toast.info('客户手机号错误', 1);
            return false;
        }
        if (!this.props.proname) {
            Toast.info('请输入项目名称', 1);
            return false;
        }
        if (!this.props.cut_off_date) {
            Toast.info('请选择截止日期', 1);
            return false;
        }
        return true;
    }
    hikeUpKeyboard = (param) => {
        let DOMCover = this.refs.coverCustomKeyboard;
        let DOMInput = ReactDOM.findDOMNode(this.refs.cover);
        DOMInput.scrollIntoView(true)
        if (param) {
            DOMCover.style.display = "block";
        } else {
            DOMCover.style.display = "none";
        }
    }
    selectContacts = () => {
        hashHistory.push({
            pathname: '/contacts',
            query: { form: 'CreateOffer' },
        });
    }
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.inputDiscountPrice) {
    //         this.setState({
    //             inputDiscountPrice: nextProps.inputDiscountPrice
    //         })
    //     }
    // }
    onChangeDiscount = (val) => {
        if ( (val - 0) < (this.state.checkPriceTax - 0) ) {
            this.setState({
                inputDiscountPrice: val,
                inputDiscountPriceError: false,
                howManyDiscount: (parseFloat(val / this.state.checkPriceTax) * 10).toFixed(2)
            })
            if (val > 0) {
                this.props.setState({ 
                    inputDiscountPrice: parseFloat(val).toFixed(2),
                    howManyDiscount: (parseFloat(val / this.state.checkPriceTax) * 10).toFixed(2)
                 });
            }
        } else {
            this.setState({ inputDiscountPrice: val, inputDiscountPriceError: true})
        }
    }
    onBlurDiscount = (val) => {
        if ((val - 0) > (this.state.checkPriceTax - 0) * 0.6 && (val - 0) < (this.state.checkPriceTax - 0) ) {
            this.props.setState({ inputDiscountPrice: parseFloat(val).toFixed(2) });
            this.setState({ inputDiscountPriceError: false })
        } else {
            this.setState({ inputDiscountPriceError: true })
        }
    }
    //切换是否有优惠，如果切换成没有优惠了，则把优惠的值设成0
    switchHaveDiscount = () => {
        if (this.props.haveDiscount) {
            this.props.setState({ haveDiscount: !this.props.haveDiscount, inputDiscountPrice: '' });
            this.setState({
                inputDiscountPrice: '',
                inputDiscountPriceError: false,
                howManyDiscount: (10).toFixed(2)
            })
        } else {
            this.props.setState({ haveDiscount: !this.props.haveDiscount });
        }
    }
    render() {
        return (
            <div className="create-offer" key="1">
                <NavBar
                    className="create-server-nav-bar add-server-nav-bar top"
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => hashHistory.goBack()}
                    leftContent={<span style={{ fontSize: "15px" }}>返回</span>}
                >创建报价</NavBar>
                <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                    <div>
                        <div className="create-offer-main">
                            {/* {console.log(this.state.checkedServerList)} */}
                            {
                                this.state.checkedServerList.map((val, index) => (
                                    <OfferItem
                                        title={val.Name}
                                        price={val.unit_price + val.unit}
                                        describe={val.describe}
                                        number={`× ${val.number}`}
                                    />
                                ))
                            }
                            <div className="tax-top-rate-box">
                                <p className="tax-top clearfix">
                                    <span className="name">税率</span>
                                    <span className="price">{this.state.checkPrice + "元"}</span>
                                </p>
                                <p className="tax-bottom">6%税率</p>
                            </div>
                            <div className="sum-price-box clearfix">
                                <span className="left-title">总计</span>
                                <span className="right-sum-price">{this.state.checkPriceTax}</span>
                            </div>
                            <InputItem
                                className="remarks-input-create-offer"
                                type="string"
                                placeholder="添加备注"
                                value={this.props.remarks}
                                onChange={(val) => { this.props.setState({ remarks: val }) }}
                            ><i className="iconfont icon-bianji"></i></InputItem>
                        </div>
                        <div className="create-offer-customer">
                            <p className="customer-title">
                                <span className="left">客户信息</span>
                                <div className="float right" onClick={this.selectContacts}>
                                    <span style={{"margin-right":"5px"}}>联系人</span>
                                    <i className="iconfont icon-geren3"></i>
                                </div>
                            </p>
                            <div className="customer-input-box">
                                <InputItem
                                    className="input-name"
                                    type="string"
                                    maxLength="10"
                                    placeholder=""
                                    value={this.props.customer_name}
                                    onChange={(val) => { this.props.setState({ customer_name: val.trim() }) }}
                                >姓名</InputItem>
                                <InputItem
                                    className="input-company"
                                    type="string"
                                    maxLength="30"
                                    placeholder="用于身份确认"
                                    value={this.props.customer_company}
                                    onChange={(val) => { this.props.setState({ customer_company: val.trim() }) }}
                                >公司</InputItem>
                                <InputItem
                                    className="input-phone"
                                    type="number"
                                    maxLength="11"
                                    placeholder="输入手机号用于接收短信"
                                    value={this.props.customer_phone}
                                    onChange={(val) => { this.props.setState({ customer_phone: val.trim() }) }}
                                >手机</InputItem>
                            </div>
                        </div>
                        <div className="create-offer-project">
                            <p className="project-title">
                                <span className="left">项目信息</span>
                                <span className="right">请输入项目信息</span>
                            </p>
                            <div className="customer-input-box project-input">
                                <InputItem
                                    className="input-project-name"
                                    type="string"
                                    maxLength="20"
                                    placeholder=""
                                    value={this.props.proname}
                                    onChange={(val) => { this.props.setState({ proname: val }) }}
                                >项目名称</InputItem>
                                <DatePicker
                                    className="cut-off-date"
                                    mode="date"
                                    title="请选择截止日期(至少5天)"
                                    // extra={<span>报价在<span className="num">{this.state.cut_off_date}</span>天后自动截止</span>}
                                    // extra="请选择截止日期"
                                    extra={this.props.cut_off_day ? `报价在${this.props.cut_off_day}天后自动截止` : "请选择截止日期"}
                                    format={date => `报价在${this.props.cut_off_day}天后自动截止`}
                                    // value={this.state.date}
                                    value={this.props.date}
                                    onChange={date => this.props.setState({ date })}
                                    onOk={date => this.onOkDatePicker(date)}
                                    minDate={new Date((new Date()).getTime() + (5 * 24 * 60 * 60 * 1000))}
                                >
                                    <List.Item className="cut_off_date-item" arrow="horizontal">截止日期</List.Item>
                                </DatePicker>
                            </div>
                        </div>
                        <div className="create-offer-foot">
                            {/* <div className="discount-select-div">
                        <div className="discount-left">
                            <span className="dot-box"><span className="dot"></span></span>
                            <span className="txt">设置优惠</span>
                        </div>
                        <InputItem
                            className="discount-middle"
                            type="money"
                            moneyKeyboardAlign="left"
                            placeholder=""
                            value={this.state.inputDiscountPrice}
                            onChange={(val) => { this.setState({ inputDiscountPrice: val }) }}
                        ></InputItem>
                        <span className="how-many-discount"></span>
                    </div> */}
                            <Flex className="discount-select-div">
                                <Flex.Item className="discount-left" style={{ "flex": "1" }} onClick={() => { this.switchHaveDiscount() }}>
                                    <span className="dot-box"><span style={{ "visibility": this.props.haveDiscount ? "visible" : "hidden" }} className="dot"></span></span>
                                    <span className="txt">设置优惠</span>
                                </Flex.Item>
                                <Flex.Item className="discount-middle" style={{ "flex": "1" }} style={{ "visibility": this.props.haveDiscount ? "visible" : "hidden" }} >
                                    <InputItem
                                        ref="cover"
                                        className="discount-middle"
                                        type="text"
                                        // moneyKeyboardAlign="left"
                                        placeholder=""
                                        error={this.state.inputDiscountPriceError}
                                        onErrorClick={() => {
                                            Toast.fail("优惠后的价格低于原价但不能低于原价的60%！", 2);
                                        }}
                                        value={this.state.inputDiscountPrice ? this.state.inputDiscountPrice : this.props.inputDiscountPrice}
                                        onChange={(val) => { this.onChangeDiscount(val) }}
                                        onBlur={(val) => { this.onBlurDiscount(val) }}
                                    // onFocus={() => { this.hikeUpKeyboard(true) } }
                                    ></InputItem>
                                </Flex.Item>
                                <Flex.Item className="how-many-discount" style={{ "visibility": this.props.haveDiscount ? "visible" : "hidden" }} >约{this.state.howManyDiscount ? this.state.howManyDiscount : (this.props.state.howManyDiscount ? this.props.state.howManyDiscount : '10')}折</Flex.Item>
                            </Flex>
                            <div className="discount">
                                <span className="unit">
                                    <span className="title">总计:</span>
                                    <span className="price">{this.state.checkPriceTax}</span>
                                </span>
                                <span className="unit" style={{ "visibility": this.props.haveDiscount ? "visible" : "hidden" }} >
                                    <span className="title">优惠后:</span>
                                    <span className="price">{this.state.inputDiscountPrice && (this.state.inputDiscountPrice > 0) ? this.state.inputDiscountPrice : (this.props.inputDiscountPrice ? this.props.inputDiscountPrice : this.state.checkPriceTax)}</span>
                                </span>
                                <span className="tax-unit">(含6%税票)</span>
                            </div>
                            <Button
                                id="create-offer-foot"
                                onClick={this.onClickCreateOffer}
                                className="create-offer-button"
                                activeClassName="create-offer-button-active"
                            >生成报价单</Button>
                            {/* <div ref="coverCustomKeyboard" style={{"height":"200px"}} className="cover-customKeyboard"></div> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

CreateOffer.contextTypes = {
    router: React.PropTypes.object
}