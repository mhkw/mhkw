import React from 'react';
import { NavBar, Icon, SegmentedControl, WingBlank } from 'antd-mobile';
import { hashHistory } from 'react-router';
import { Line,Jiange } from './templateHomeCircle';
import QueueAnim from 'rc-queue-anim';

// require("../css/person.scss");
const urls = [require('../images/touxiang.png')]

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
        this.handleSend = (res,fg) =>{
            console.log(res);            
            if(res.success) {
                if(fg == "a") {
                    // console.log(res);
                }
            }else{
                // console.log(res,"失败");
            }
        }
    }
    componentDidMount(){
        runPromise("get_main_project_list", {
            "user_id": "70220",
            "per_page": 5,
            "page": 1,
            /*quote_status：2表示订单*/
            "quote_status": 2,
            /*is_quoter：0表示服务方*/
            "is_quoter": 0,
            "type": "",
            stage_id: "",
            send_time: "",
            project_name: "" 
        }, this.handleSend, false, "post", "a");
    }
    onChange = (e) => {
        console.log(`selectedIndex:${e.nativeEvent.selectedSegmentIndex}`);
    }
    onValueChange = (value) => {
        console.log(value);
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
                            />
                        </WingBlank>
                    </NavBar>
                    <div className="orderIng">
                        <p>进行中的订单</p>
                    </div>
                    <div className="orderItemList" >
                        <div className="orderItem">
                            <div className="orderItemLis">
                                <ul>
                                    <li className="clearfix">
                                        <h3>技术咨询约见服务<span className="fn-right">约见订单</span></h3>                                    
                                        <div className="orderItemLisWrap clearfix">
                                            <div className="fn-left">
                                                <img src={urls[0]} alt=""/>
                                            </div>
                                            <div className="fn-right personMsg">
                                                <div>
                                                    <i 
                                                        className="iconfont icon-location" 
                                                        style={{float:"left",position:"relative",top:"5px",marginRight:"3px"}}>
                                                    </i>
                                                    <p> 杭州市西湖区转塘街道西湖区转塘街道回龙雅苑9幢3单元601</p>
                                                </div>
                                                <p><i className="iconfont icon-ren12"></i> 冰原落泪（16656565156）</p>
                                                <p><i className="iconfont icon-shijian2"></i> 2017年11月20日 15:50</p>
                                            </div>
                                        </div>
                                        <div className="btnWrap">
                                            <p>
                                                <span style={{ color: "red", fontSize: "18px" }}>300元</span> 
                                                <i style={{ fontSize: "18px", color:"#DEDEDE"}}> 对方已付款</i> 
                                                <button style={{marginLeft:"0.7rem"}}>现在出发</button> <button>取消订单</button>
                                            </p>
                                        </div>
                                    </li>
                                    <Jiange name="jianGe"></Jiange>
                                    <li className="clearfix">
                                        <h3>《中控企业》画册设计服务<span className="fn-right">项目订单</span></h3>                                    
                                        <div className="orderItemLisWrap clearfix spelis">
                                            <div className="fn-left floatWrap">
                                                <span className="order fn-left">1</span>
                                                <h4 className="fn-left"> 整体策划</h4>
                                                    <p className="fn-left" style={{ color: "#676767" }}>融合产品需要参与策划与数据整合</p>
                                            </div>
                                            <div className="fn-right" style={{ color:"#676767"}}>
                                                <h4>2000</h4>
                                                <p>x1套</p>
                                            </div>
                                        </div>
                                        <div className="orderItemLisWrap clearfix spelis">
                                            <div className="fn-left floatWrap">
                                                <span className="order fn-left">2</span>
                                                <h4 className="fn-left"> 整体策划</h4>
                                                    <p className="fn-left" style={{ color: "#676767" }}>融合产品需要参与策划与数据整合</p>
                                            </div>
                                            <div className="fn-right" style={{ color:"#676767"}}>
                                                <h4>2000</h4>
                                                <p>x1套</p>
                                            </div>
                                        </div>
                                        <div className="orderItemLisWrap clearfix spelis">
                                            <div className="fn-left floatWrap">
                                                <span className="order fn-left">3</span>
                                                <h4 className="fn-left"> 整体策划</h4>
                                                <p className="fn-left" style={{ color: "#676767" }}>融合产品需要参与策划与数据整合</p>
                                            </div>
                                            <div className="fn-right" style={{ color:"#676767"}}>
                                                <h4>2000</h4>
                                                <p>x1套</p>
                                            </div>
                                        </div>
                                        <div className="orderItemLisWrap fn-clear spelis paysteps">
                                            <div className="fn-left floatWrap">
                                                <span className="order fn-left">4</span>                                        
                                                <h4 style={{marginBottom:"0"}}>付款方式: <span style={{fontWeight:"normal"}}>30% 20% 50%</span></h4>
                                            </div>
                                        </div>
                                        <div className="fn-clear orderItemLisWrap" style={{ backgroundColor: "#fff" }}>
                                            <div className="fn-left floatWrap">                                        
                                                <p style={{marginLeft:".6rem"}}>有效邮箱: 152565458@qq.com</p>
                                            </div>
                                        </div>
                                        <div className="btnWrap">
                                            <p>
                                                <span style={{ color: "red", fontSize: "18px" }}>300元</span>
                                                <i style={{ fontSize: "18px", color: "#DEDEDE" }}> 对方已付款</i>
                                                <button style={{ marginLeft: "0.7rem" }}>接受订单</button> <button>修改报价</button>
                                            </p>
                                        </div>
                                    </li>
                                    {/* <Jiange name="jianGe"></Jiange>        */}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="orderIng" >
                        <p>历史订单</p>
                    </div>
                    <div className="orderItemList" >
                        <div className="orderItem">
                            <div className="orderItemLis">
                                <ul>
                                    <li className="clearfix">
                                        <h3>技术咨询约见服务<span className="fn-right">约见订单</span></h3>
                                        <div className="orderItemLisWrap clearfix">
                                            <div className="fn-left">
                                                <img src={urls[0]} alt="" />
                                            </div>
                                            <div className="fn-right personMsg">
                                                <div>
                                                    <i
                                                        className="iconfont icon-location"
                                                        style={{ float: "left", position: "relative", top: "5px", marginRight: "3px" }}>
                                                    </i>
                                                    <p> 杭州市西湖区转塘街道西湖区转塘街道回龙雅苑9幢3单元601</p>
                                                </div>
                                                <p><i className="iconfont icon-ren12"></i> 冰原落泪（16656565156）</p>
                                                <p><i className="iconfont icon-shijian2"></i> 2017年11月20日 15:50</p>
                                            </div>
                                        </div>
                                        <div className="btnWrap">
                                            <p>
                                                <span style={{ color: "red", fontSize: "18px" }}>300元</span>
                                                <i style={{ fontSize: "18px", color: "#DEDEDE" }}> 对方已付款</i>
                                                <button style={{ marginLeft: "0.7rem" }}>评价</button> <button>删除记录</button>
                                            </p>
                                        </div>
                                    </li>
                                    <Jiange name="jianGe"></Jiange>
                                    <li className="clearfix">
                                        <h3>《中控企业》画册设计服务<span className="fn-right">项目订单</span></h3>
                                        <div className="orderItemLisWrap clearfix spelis">
                                            <div className="fn-left floatWrap">
                                                <span className="order fn-left">1</span>
                                                <h4 className="fn-left"> 整体策划</h4>
                                                <p className="fn-left" style={{ color: "#676767" }}>融合产品需要参与策划与数据整合</p>
                                            </div>
                                            <div className="fn-right" style={{ color: "#676767" }}>
                                                <h4>2000</h4>
                                                <p>x1套</p>
                                            </div>
                                        </div>
                                        <div className="orderItemLisWrap clearfix spelis">
                                            <div className="fn-left floatWrap">
                                                <span className="order fn-left">2</span>
                                                <h4 className="fn-left"> 整体策划</h4>
                                                <p className="fn-left" style={{ color: "#676767" }}>融合产品需要参与策划与数据整合</p>
                                            </div>
                                            <div className="fn-right" style={{ color: "#676767" }}>
                                                <h4>2000</h4>
                                                <p>x1套</p>
                                            </div>
                                        </div>
                                        <div className="orderItemLisWrap clearfix spelis">
                                            <div className="fn-left floatWrap">
                                                <span className="order fn-left">3</span>
                                                <h4 className="fn-left"> 整体策划</h4>
                                                <p className="fn-left" style={{ color: "#676767" }}>融合产品需要参与策划与数据整合</p>
                                            </div>
                                            <div className="fn-right" style={{ color: "#676767" }}>
                                                <h4>2000</h4>
                                                <p>x1套</p>
                                            </div>
                                        </div>
                                        <div className="orderItemLisWrap fn-clear spelis paysteps">
                                            <div className="fn-left floatWrap">
                                                <span className="order fn-left">4</span>
                                                <h4 style={{ marginBottom: "0" }}>付款方式: <span style={{ fontWeight: "normal" }}>30% 20% 50%</span></h4>
                                            </div>
                                        </div>
                                        <div className="fn-clear orderItemLisWrap" style={{ backgroundColor: "#fff" }}>
                                            <div className="fn-left floatWrap">
                                                <p style={{ marginLeft: ".6rem" }}>有效邮箱: 152565458@qq.com</p>
                                            </div>
                                        </div>
                                        <div className="btnWrap">
                                            <p>
                                                <span style={{ color: "red", fontSize: "18px" }}>300元</span>
                                                <i style={{ fontSize: "18px", color: "#DEDEDE" }}> 对方已付款</i>
                                                <button style={{ marginLeft: "0.7rem" }}>接受订单</button> <button>删除</button>
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                ] : null}
            </QueueAnim>
        )
    }
}