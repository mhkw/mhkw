// orderList.jsx的展示组件
export const OrderItemList = (props) => {
    let pay_stages_str = "";
    if (props.pay_stages) {
        for (let i = 0; i < props.pay_stages.length; i++) {
            pay_stages_str += props.pay_stages[i].percent + "%　";;
        }
    }
    return (
        <li className="clearfix">
            <h3><span className="name ellipsis">{props.project_name ? props.project_name : "快速下单"}</span><span className="fn-right">{props.type == "1" ? "报价订单" : "服务订单"}</span></h3>
            {
                props.content && props.content.map((val, index) => (
                    <div className="orderItemLisWrap clearfix spelis">
                        <div className="fn-left floatWrap">
                            <span className="order fn-left">{index + 1}</span>
                            <h4 className="fn-left"> {val.name}</h4>
                            <p className="fn-left" style={{ color: "#676767" }}>融合产品需要参与策划与数据整合</p>
                        </div>
                        <div className="fn-right" style={{ color: "#676767" }}>
                            <h4>{val.total_price}</h4>
                            <p>x{val.num}套</p>
                        </div>
                    </div>
                ))
            }
            {
                props.type == "2" && props.content.length < 1 ? (
                    <div className="orderItemLisWrap clearfix spelis">
                        <div className="fn-left floatWrap">
                            <span className="order fn-left">1</span>
                            <h4 className="fn-left"> 自定义服务订单</h4>
                            <p className="fn-left" style={{ color: "#676767" }}>融合产品需要参与策划与数据整合</p>
                        </div>
                        <div className="fn-right" style={{ color: "#676767" }}>
                            <h4>{props.price_after_discount ? props.price_after_discount : (props.price_before_discount ? props.price_before_discount : "0")}</h4>
                            <p>x{1}套</p>
                        </div>
                    </div>
                ) : null
            }

            <div className="orderItemLisWrap fn-clear spelis paysteps" style={{ "display": props.pay_stages ? "block" : "none" }}>
                <div className="fn-left floatWrap">
                    {
                        props.pay_stages ? (
                            <h4 className="pay-stages">付款方式: <span style={{ fontWeight: "normal" }}>{pay_stages_str}</span></h4>
                        ) : null
                    }
                </div>
            </div>
            {/* <div className="fn-clear orderItemLisWrap" style={{ backgroundColor: "#fff" }}>
                <div className="fn-left floatWrap">
                    <p>有效邮箱: 152565458@qq.com</p>
                </div>
            </div> */}
            <div className="btnWrap">
                <p>
                    <span style={{ color: "red", fontSize: "18px" }}>{ props.price_after_discount ? props.price_after_discount : (props.price_before_discount ? props.price_before_discount : "0")}元</span>
                    {
                        props.stage_id == "4" || props.stage_id == "5" ? (
                            <i>项目完成</i>
                        ) : null
                    }
                    {
                        props.stage_id != "4" && props.stage_id != "5" ? (
                            props.type == "1" ? (
                                <i>作业中</i>
                            ) : (
                                <i>已付款</i>
                            )
                        ) : null
                    }
                    {/* {
                        props.is_quoter == "1" && props.stage_id != "4" && props.stage_id != "5" ? (
                            <button>提醒验收</button>
                        ) : (
                            <button>确认验收</button>
                        )
                    } */}
                    {
                        props.stage_id != "4" && props.stage_id != "5" ? (
                            props.is_quoter == "1" ? (
                                <button
                                    onClick={() => { props.setState({ confirmOrderID: props.project_id }, () => { props.remindOrder()}) }}
                                >提醒验收</button>
                            ) : (
                                <button
                                    onClick={() => { props.changeShowConfirmOrder(true), props.setState({ confirmOrderID: props.project_id}) }}
                                >确认验收</button>
                            )
                        ) : null
                    }
                    {/* {
                        props.clt_appraise_score && (props.stage_id == "4" || props.stage_id == "5") ? (
                            <button>查看评价</button>
                        ) : (
                            <button>评价</button>
                        )
                    } */}
                    {
                        props.stage_id == "4" || props.stage_id == "5" ? (
                            props.clt_appraise_score ? (
                                <button
                                    onClick={() => { props.changeShowScoreModal(true), props.setState({ selectedScore: props.clt_appraise_score, selectedScoreComment: props.clt_appraise_txt, selectedScoreEnd: true }) }}
                                >已评价</button>
                            ) : (
                                <button
                                    onClick={() => { props.changeShowScoreModal(true), props.setState({ confirmOrderID: props.project_id, selectedScoreEnd: false }) }}
                                >评价</button>
                            )
                        ) : null
                    }
                </p>
            </div>
        </li>
    )
}
//自定义狂拽酷炫吊炸天的自定义button，手指按下去时背景有阴影
export const Qbutton = (props) => {
    let oldBackgroundColor = "#fff";
    const touchStart = (e) => { 
        oldBackgroundColor = e.target.style.backgroundColor;
        e.target.style.backgroundColor = "#eee";
    }
    const touchEnd = (e) => { 
        e.target.style.backgroundColor = oldBackgroundColor;
    }
    return <button
        {...props}
        onTouchStart={touchStart}
        onTouchEnd={touchEnd}
    >{props.children}</button>
}
// orderList.jsx的展示组件
export const QuoteItemList = (props) => {
    //最后的价格
    let price_discount = props.price_after_discount ? props.price_after_discount : (props.price_before_discount ? props.price_before_discount : "0");
    //最后展现的字符方式字符串
    let pay_stages_str = "";
    if (props.pay_stages) {
        for (let i = 0; i < props.pay_stages.length; i++) {
            pay_stages_str += props.pay_stages[i].percent + "%　";;
        }
    }
    let btnWrapA;
    switch (props.quote_status) {
        case "1":
            btnWrapA = <span>
                    <i>待处理</i> 
                    <Qbutton className="button-1" onClick={() => { props.refuseQuote(props.project_id, 3) }}>拒绝</Qbutton>
                    <Qbutton onClick={() => { props.agreeToPay(props.project_id, price_discount) }} >同意并支付</Qbutton>
                </span>
            break;
        case "2":
            btnWrapA = <i>已同意！可在&lt;我的订单&gt;中查看</i>
            break;
        case "3":
            btnWrapA = <i>已拒绝！{props.error_message ? " " + props.error_message : ""}</i>
            break;
        case "4":
            btnWrapA = <i>对方已取消！</i>
            break;
        case "5":
            btnWrapA = <i>超时未处理，已取消！</i>
            break;
    }
    let btnWrapB;
    switch (props.quote_status) {
        case "1":
            btnWrapB = <span>
                    <i>等待对方处理</i> 
                    <Qbutton onClick={() => { props.refuseQuote(props.project_id, 4) }}>取消报价</Qbutton>
                </span>
            break;
        case "2":
            btnWrapB = <i>对方已同意！可在&lt;我的订单&gt;中查看</i>
            break;
        case "3":
            btnWrapB = <i>对方不满意！{props.error_message ? '原因：' + props.error_message : ""}</i> 
            break;
        case "4":
            btnWrapB = <i>已取消</i> 
            break;
        case "5":
            btnWrapB = <i>对方超时未处理，已取消！</i>
            break;
    }
    return (
        <li className="clearfix">
            <h3><span className="name ellipsis">{props.project_name ? props.project_name : "报价单"}</span><span className="fn-right">{props.send_time ? props.send_time.split(" ")[0] : "" }</span></h3>
            {
                props.content && props.content.map((val, index) => (
                    <div className="orderItemLisWrap clearfix spelis">
                        <div className="fn-left floatWrap">
                            <span className="order fn-left">{index + 1}</span>
                            <h4 className="fn-left"> {val.name}</h4>
                            <p className="fn-left" style={{ color: "#676767" }}>融合产品需要参与策划与数据整合</p>
                        </div>
                        <div className="fn-right" style={{ color: "#676767" }}>
                            <h4>{val.total_price}</h4>
                            <p>x{val.num}套</p>
                        </div>
                    </div>
                ))
            }
            <div className="orderItemLisWrap fn-clear spelis paysteps" style={{ "display": props.pay_stages ? "block" : "none" }}>
                <div className="fn-left floatWrap">
                    {
                        props.pay_stages ? (
                            <h4 className="pay-stages">付款方式: <span style={{ fontWeight: "normal" }}>{pay_stages_str}</span></h4>
                        ) : null
                    }
                </div>
            </div>
            {/* <div className="fn-clear orderItemLisWrap" style={{ backgroundColor: "#fff" }}>
                <div className="fn-left floatWrap">
                    <p>有效邮箱: 152565458@qq.com</p>
                </div>
            </div> */}
            <div className="btnWrap">
                <p>
                    <span style={{ color: "red", fontSize: "18px" }}>{price_discount}元</span>
                    {
                        props.is_quoter == '0' ? btnWrapA : btnWrapB
                    }
                </p>
            </div>
        </li>
    )
}