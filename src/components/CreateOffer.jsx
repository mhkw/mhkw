import React from 'react'
import { NavBar, Icon, Button, WingBlank, Flex, InputItem, DatePicker, List} from 'antd-mobile';
import { hashHistory, Link } from 'react-router';

const OfferItem = (props) => (
    <div className="offer-item">
        <Flex justify="between" align="start">
            <Flex.Item className="title" style={{ "flex": "2" }}>{props.title}</Flex.Item>
            <Flex.Item className="price">{props.price}</Flex.Item>
        </Flex>
        <Flex justify="between" align="start">
            <Flex.Item className="remarks" style={{ "flex": "3" }}>{props.remarks}</Flex.Item>
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
        }
    }
    onOkDatePicker(date) {
        let year = date.getFullYear();
        let month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let formatDate = `${year}-${month}-${day}`;
        
        let nowTime = (new Date()).getTime(); //现在的时间
        let curTime = (new Date(date)).getTime(); //选择的时间
        let cut_off_day = Math.ceil( (curTime - nowTime) / (1000 * 60 * 60 * 24) );
        this.setState({ 
            cut_off_date: formatDate,
            cut_off_day: cut_off_day
        });
    }
    onClickCreateOffer() {
        console.log("click create offer")
    }
    render() {
        return (
            <div className="create-offer" key="1">
                <NavBar
                    className="create-server-nav-bar"
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => hashHistory.goBack()}
                    leftContent={<span style={{ fontSize: "15px" }}>返回</span>}
                >创建报价</NavBar>
                <div className="create-offer-main">
                    <OfferItem
                        title={"PS简单处理图片"}
                        price={"2000.00/天"}
                        remarks={"海报创意，海报定制，创意，营销广告海报创意，海报定制，创意，营销广告海报创意，海报定制，创意，营销广告"}
                        number={"× 1"}
                    />
                    <OfferItem
                        title={"PS简单处理图片"}
                        price={"2000.00/天"}
                        remarks={"海报创意，海报定制，创意，营销广告"}
                        number={"× 1"}
                    />
                    <div className="tax-top-rate-box">
                        <p className="tax-top clearfix">
                            <span className="name">税率</span>
                            <span className="price">{this.state.pure_price + "元"}</span>
                        </p>
                        <p className="tax-bottom">6%税率</p>
                    </div>
                    <div className="sum-price-box clearfix">
                        <span className="left-title">总计</span>
                        <span className="right-sum-price">5632.00</span>
                    </div>
                    <InputItem
                        className="remarks-input-create-offer"
                        type="string"
                        placeholder="添加备注"
                        value={this.state.remarks}
                        onChange={(val) => { this.setState({ remarks: val }) }}
                    ><i className="iconfont icon-bianji"></i></InputItem>
                </div>
                <div className="create-offer-customer">
                    <p className="customer-title">
                        <span className="left">客户信息</span>
                        <span className="right">请输入客户信息</span>
                        <i className="iconfont icon-geren3"></i>
                    </p>
                    <div className="customer-input-box">
                        <InputItem
                            className="input-name"
                            type="string"
                            maxLength="10"
                            placeholder=""
                            value={this.state.customer_name}
                            onChange={(val) => { this.setState({ customer_name: val }) }}
                        >姓名</InputItem>
                        <InputItem
                            className="input-company"
                            type="string"
                            maxLength="30"
                            placeholder="用于身份确认"
                            value={this.state.customer_company}
                            onChange={(val) => { this.setState({ customer_company: val }) }}
                        >公司</InputItem>
                        <InputItem
                            className="input-phone"
                            type="number" 
                            maxLength="11"
                            placeholder="输入手机号用于接收短信"
                            value={this.state.customer_phone}
                            onChange={(val) => { this.setState({ customer_phone: val }) }}
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
                            value={this.state.project_name}
                            onChange={(val) => { this.setState({ project_name: val }) }}
                        >项目名称</InputItem>
                        <DatePicker
                            className="cut-off-date"
                            mode="date"
                            title="请选择截止日期(至少5天)"
                            // extra={<span>报价在<span className="num">{this.state.cut_off_date}</span>天后自动截止</span>}
                            // extra="请选择截止日期"
                            extra={this.state.cut_off_day ? `报价在${this.state.cut_off_day}天后自动截止` : "请选择截止日期"}
                            format={date => `报价在${this.state.cut_off_day}天后自动截止`}
                            // value={this.state.date}
                            value={this.state.date}
                            onChange={date => this.setState({ date })}
                            onOk={date => this.onOkDatePicker(date)}
                            minDate={new Date((new Date()).getTime() + (5 * 24 * 60 * 60 * 1000))}
                        >
                            <List.Item className="cut_off_date-item" arrow="horizontal">截止日期</List.Item>
                        </DatePicker>
                    </div>
                </div>
                <div className="create-offer-foot">
                    <div className="discount">
                        <span className="unit">
                            <span className="title">总计:</span>
                            <span className="price">5632.00</span>
                        </span>
                        <span className="unit">
                            <span className="title">优惠后:</span>
                            <span className="price">5000.00</span>
                        </span>
                        <span className="tax-unit">(含3%税票)</span>
                    </div>
                    <Button
                        onClick={this.onClickCreateOffer}
                        className="create-offer-button"
                        activeClassName="create-offer-button-active"
                    >生成报价单</Button>
                </div>
            </div>
        )
    }
}

CreateOffer.contextTypes = {
    router: React.PropTypes.object
}