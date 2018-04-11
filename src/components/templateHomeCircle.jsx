import { Link, hashHistory } from 'react-router';

/**
 * 设计师作品展示4张
 * @param {*} props 
 */
const loginUrl = {
    "selec": require('../images/selec.png'),
}
const zhanWei = require('../images/logoZhanWei.png');

const defaultAvatar = require("../images/selec.png");

export const ItemPicLists = (props) => (
    <ul>
        {
            props.works_list.slice(0, 4).map(function (value, idx) {
                const handleClickWorksDetails = (works_id) => {
                    hashHistory.push({
                        pathname: '/worksDetails',
                        query: {
                            form: 'home',
                            works_id,
                        },
                    });
                }
                const onErrorImg = (e) => {
                    // console.log(e.target);
                    e.target.src = zhanWei;
                    // e.target.className = "zhan-wei";
                }
                return <li onClick={() => { handleClickWorksDetails(value.id) }} >
                        <img 
                            // src={value.path.indexOf('upaiyun.com') != -1 ? value.path + '!540x390' : value.path}
                            src={value.path_thumb}
                            onError={(e) => { onErrorImg(e) }}
                        />
                    </li>
            })
        }
    </ul>
)
/**
 * 设计师个人信息展示
 */
export const PersonalMsg = (props) => (
    <div className="itemsTop">
        <div className="itemsTopPic fn-left" onClick={()=>{hashHistory.push({pathname: '/designerHome',query: { userId: props.id }})}}>
            <img src={props.path_thumb || loginUrl.selec} alt="" onError={(e) => { e.target.src = defaultAvatar }} />
        </div>
        <div className="itemsTopRight">
            <p>
                <span className="fn-left" onClick={() => { hashHistory.push({ pathname: '/designerHome', query: { userId: props.id } }) }} style={{ fontSize: '16px' }}>
                    {props.nick_name}&nbsp;
                    {props.sex == '女' ? <i className="iconfont icon-xingbienv_f" style={{ color: '#F46353', fontWeight: "800", fontSize: "12px" }} /> : props.sex == '男' ? <i className="iconfont icon-xingbienanxuanzhong" style={{ color: '#4DA7E0', fontWeight: "800", fontSize: "12px" }} /> : ""}
                </span>
                <span className="fn-right personalMsg">
                <i className="iconfont icon-dingwei"></i>
                {/* {props.distance}km */}
                    {((props.distance - 0) / 1000).toFixed(2) > 200 || ((props.distance - 0) / 1000).toFixed(2) == 0 ?
                        props.txt_address == "" ?
                            "[未知]" : props.txt_address.split(" ").length > 1 ?
                                props.txt_address.split(" ").slice(1).join(" ") : props.txt_address : ((props.distance - 0) / 1000).toFixed(2) + 'km'}
                </span>
            </p>
            <p className="personalMsg">
                <span>{props.group_name}</span> | <span>{props.experience}</span> | <span>{props.works_count}件作品</span> | <span>{props.hits_count}人喜欢</span>
            </p>
        </div>
    </div>
)
// 分隔块
export const Jiange = (props) => (
    <div className={props.name}>

    </div>
)
//分隔线
export const Line = (props) => (
    <div className={props.border}>

    </div>
)
export const CategoryPub = (props) => (
    <div className={props.className} 
        onClick={(e) => { props.changeCategory(e)}}
        id={props.id}
    >{props.text}</div>
);
export const AccountListDetails = (props) => (
    <ul>
        {
            props.item_list.map(function (value, idx) {    
                let newDate = new Date(parseInt(value.add_time) * 1000);
                let year = newDate.getFullYear();
                let month = newDate.getMonth() + 1;
                let day = newDate.getDate();
                // let add_time_format = year + '-' + month + '-' + day;   
                let add_time_format = `${year}-${month}-${day}`;
                return <li>
                    <div className="fn-left">
                        <p className="ellipsis" style={{ fontSize: "16px" }}>{ value.cause }</p>
                        <p className="blance">余额: {props.blance}</p>
                    </div>
                    <div className="fn-right accountListDetailsRight">
                        <p style={{ color: "#888888", fontSize: "14px" }}>{add_time_format}</p>
                        <p className="ellipsis" style={{ fontWeight: "800", fontSize: "16px" }}>{value.price > 0 ? '+' + value.price : value.price}</p>
                    </div>
                </li>
            })
        }
    </ul>
)
//需求方订单（服务订单/约见订单）
export const serverOrderOwn = (props) => (
    <ul>
        {
            props.orderList.map(function (value,idx) {
                if (value.type == "1"){
                    return <li className="clearfix">
                        <h3>{value.project_name}<span className="fn-right">项目订单</span></h3>
                        <div className="orderItemLisWrap clearfix spelis">
                            <div className="fn-left floatWrap">
                            {
                                value.content.map(function (value, idx) {
                                    <div>
                                        return <span className="order fn-left">{value.num}</span>
                                        <h4 className="fn-left"> {value.name}</h4>
                                        <p className="fn-left" style={{ color: "#676767" }}>{value}</p>
                                    </div>
                                })
                            }
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
                                <button style={{ marginLeft: "0.7rem" }}>接受订单</button> <button>修改报价</button>
                            </p>
                        </div>
                    </li>
                }
            })
        }
    </ul>
)
export const serverOrderMeet = (props) => (
    props.meetList.map(function (params) {
        return <li className="clearfix">
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
                    <button style={{ marginLeft: "0.7rem" }}>现在出发</button> <button>取消订单</button>
                </p>
            </div>
        </li>
    })
)
//服务方订单


//个人中心个人信息
export const PersonalCenterMsg = (props) => (
    <ul className="mineThingsTodo">
        <li>
            <Link to="/account">
                <p className="num">{props.PersonalCenterAccount}</p>
                <p>账户</p>
            </Link>
        </li>
        <li>
            <Link to="/quoteList">
                <p className="num"><i style={{ color: "red" }}>{props.working_quote_count}</i>/{props.quote_count}</p>
                <p>报价</p>
            </Link>
        </li>
        <li>
            <Link to="/orderList">
                <p className="num"><i style={{ color: "red" }}>{props.working_order_count}</i>/{props.order_count}</p>
                <p>订单</p>
            </Link>
        </li>
    </ul>
)

