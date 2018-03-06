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
                                <button>提醒验收</button>
                            ) : (
                                <button>确认验收</button>
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
                                <button>查看评价</button>
                            ) : (
                                <button>评价</button>
                            )
                        ) : null
                    }
                </p>
            </div>
        </li>
    )
}