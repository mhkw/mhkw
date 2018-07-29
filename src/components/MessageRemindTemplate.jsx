import { List, Flex } from 'antd-mobile';
const defaultAvatar = require('../images/avatar.png');

function getTimeText(argument) {
    var timeS = argument;
    var todayT = ''; //  
    var yestodayT = '';
    var timeCha = getTimeS(timeS);
    timeS = timeS.slice(-8);
    todayT = new Date().getHours() * 60 * 60 * 1000 + new Date().getMinutes() * 60 * 1000 + new Date().getSeconds() * 1000;
    yestodayT = todayT + 24 * 60 * 60 * 1000;
    if (timeCha > yestodayT) {
        return argument.slice(0, 11);
    }
    if (timeCha > todayT && timeCha < yestodayT) {
        return timeS.slice(0, 2) > 12 ? '昨天 下午' + (timeS.slice(0, 2) == 12 ? 12 : timeS.slice(0, 2) - 12) + timeS.slice(2, 5) : '昨天 上午' + timeS.slice(0, 5);
    }
    if (timeCha < todayT) {
        return timeS.slice(0, 2) >= 12 ? '下午' + (timeS.slice(0, 2) == 12 ? 12 : timeS.slice(0, 2) - 12) + timeS.slice(2, 5) : '上午' + timeS.slice(0, 5);
    }

    function getTimeS(argument) {
        var timeS = argument;
        timeS = timeS.replace(/[年月]/g, '/').replace(/[日]/, '');
        return new Date().getTime() - new Date(timeS).getTime() - 1000; //有一秒的误差  
    }
}
//格式化时间处理
function FormatDate(Date, fmt) {
    var o = {
        "M+": Date.getMonth() + 1, //月份
        "d+": Date.getDate(), //日
        "h+": Date.getHours(), //小时
        "m+": Date.getMinutes(), //分
        "s+": Date.getSeconds(), //秒
        "q+": Math.floor((Date.getMonth() + 3) / 3), //季度
        "S": Date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (Date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export const Comment = (props) => {
    return (
        <div className="remind-comment-page">
            <div className="item" key={1}>
                <div className="item-avatar"><img className="remind-avatar" src={defaultAvatar} onError={(e) => { e.target.src = defaultAvatar }} /> </div>
                <div className="item-box">
                    <div className="item-box-top">
                        <span className="name ellipsis">小庄</span>
                        <span className="tips">回复你</span>
                        <span className="time">6月19日 23:49</span>
                    </div>
                    <div className="item-box-content">
                        我也不知道，后来查了，结果正常。
                    </div>
                    <div className="item-box-source">
                        <span className="arrow"></span>
                        <p className="ellipsis">已经做过脐带穿鞋，显示胎儿男色体正常，~\(≧▽≦)/~啦啦啦，破事儿分别放假喝喜酒</p>
                    </div>
                </div>
            </div>
            {
                props.data && props.data.length > 0 &&
                props.data.map((value) => {
                    let timestamp = parseInt(value.add_time) * 1000;
                    let showTimeText = getTimeText(FormatDate(new Date(parseInt(timestamp)), 'yyyy年MM月dd日 hh:mm:ss'));
                    return (
                        <div className="item" key={value.id}>
                            <div className="item-avatar"><img className="remind-avatar" src={value.path_thumb} onError={(e) => { e.target.src = defaultAvatar }} /> </div>
                            <div className="item-box">
                                <div className="item-box-top">
                                    <span className="name ellipsis">{value.nick_name}</span>
                                    <span className="tips">{value.direction == "1" ? "评论你" : "回复你" }</span>
                                    <span className="time">{showTimeText}</span>
                                </div>
                                <div className="item-box-content">
                                    {value.title}
                                </div>
                                <div className="item-box-source">
                                    <span className="arrow"></span>
                                    <p className="ellipsis">{value.content}</p>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
export const SeeMe = (props) => {
    return (
        <div className="remind-see-me-page">
            <Flex className="see-me-item" key={1}>
                <div className="flex-item-left">
                    <img className="black-img" src={defaultAvatar} onError={(e) => { e.target.src = defaultAvatar }} />
                </div>
                <Flex.Item className="flex-item-middle">
                    <p className="black-p-title">
                        <span className="name ellipsis">小庄</span>
                        <span className="time">6月19日 23:49</span>
                    </p>
                    <p className="black-p-middle ellipsis">
                        <span className="label">交互设计师</span>
                        <span className="label">界面设计师</span>
                        <span className="label">网页设计师</span>
                    </p>
                </Flex.Item>
            </Flex>
            <Flex className="see-me-item" key={1}>
                <div className="flex-item-left">
                    <img className="black-img" src={defaultAvatar} onError={(e) => { e.target.src = defaultAvatar }} />
                </div>
                <Flex.Item className="flex-item-middle">
                    <p className="black-p-title">
                        <span className="name ellipsis">小庄</span>
                        <span className="time">6月19日 23:49</span>
                    </p>
                    <p className="black-p-middle ellipsis">
                        <span className="label">交互设计师</span>
                        <span className="label">界面设计师</span>
                        <span className="label">网页设计师</span>
                    </p>
                </Flex.Item>
            </Flex>
            {
                props.data && props.data.length > 0 &&
                props.data.map((value)=>{
                    let timestamp = parseInt(value.add_time) * 1000;
                    let showTimeText = getTimeText(FormatDate(new Date(parseInt(timestamp)), 'yyyy年MM月dd日 hh:mm:ss'));
                    return ( 
                        <Flex className="see-me-item" key={value.id}>
                            <div className="flex-item-left">
                                <img className="black-img" src={value.path_thumb} onError={(e) => { e.target.src = defaultAvatar }} />
                            </div>
                            <Flex.Item className="flex-item-middle">
                                <p className="black-p-title">
                                    <span className="name ellipsis">{value.nick_name}</span>
                                    <span className="time">{showTimeText}</span>
                                </p>
                                <p className="black-p-middle ellipsis">
                                    <span className="label">{value.jobs}</span>
                                </p>
                            </Flex.Item>
                        </Flex>
                    ) 
                })
            }
        </div>
    )
}
export const Fabulous = (props) => {
    return (
        <div className="remind-fabulous-page remind-comment-page">
            <div className="item" key={1}>
                <div className="item-avatar"><img className="remind-avatar" src={defaultAvatar} onError={(e) => { e.target.src = defaultAvatar }} /> </div>
                <div className="item-box">
                    <div className="item-box-top">
                        <span className="name ellipsis">小庄</span>
                        <span className="tips">赞帖子</span>
                        <span className="time">6月19日 23:49</span>
                    </div>
                    <div className="item-box-content">
                        <i className="iconfont icon-zan fabulous"></i>
                    </div>
                    <div className="item-box-source">
                        <span className="arrow"></span>
                        <p className="ellipsis">已经做过脐带穿鞋，显示胎儿男色体正常，~\(≧▽≦)/~啦啦啦，破事儿分别放假喝喜酒</p>
                    </div>
                </div>
            </div>
            {
                props.data && props.data.length > 0 &&
                props.data.map((value) => {
                    let timestamp = parseInt(value.add_time) * 1000;
                    let showTimeText = getTimeText(FormatDate(new Date(parseInt(timestamp)), 'yyyy年MM月dd日 hh:mm:ss'));
                    return (
                        <div className="item" key={value.id}>
                            <div className="item-avatar"><img className="remind-avatar" src={value.path} onError={(e) => { e.target.src = defaultAvatar }} /> </div>
                            <div className="item-box">
                                <div className="item-box-top">
                                    <span className="name ellipsis">{value.nick_name}</span>
                                    <span className="tips">赞帖子</span>
                                    <span className="time">{showTimeText}</span>
                                </div>
                                <div className="item-box-content">
                                    <i className="iconfont icon-zan fabulous"></i>
                                </div>
                                {/* <div className="item-box-source">
                                    <span className="arrow"></span>
                                    <p className="ellipsis">已经做过脐带穿鞋，显示胎儿男色体正常，~\(≧▽≦)/~啦啦啦，破事儿分别放假喝喜酒</p>
                                </div> */}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
export const SystemNotification = (props) => {
    return (
        <div className="remind-system-notification-page remind-comment-page">
            {/* <div className="item" key={1}>
                <div className="icon-box"><i className="iconfont icon-ios-guangbo-outline"></i></div>
                <div className="item-box">
                    <div className="item-box-top">
                        <span className="name">系统通知</span>
                        <span className="time">6月19日 23:49</span>
                    </div>
                    <div className="item-box-content">
                        心理因素直播，多动，爱哭闹，脾气暴躁，教你8招，让孩子听话. >>
                    </div>
                </div>
            </div> */}
            {
                props.data && props.data.length > 0 &&
                props.data.map((value) => {
                    let timestamp = parseInt(value.add_time) * 1000;
                    let showTimeText = getTimeText(FormatDate(new Date(parseInt(timestamp)), 'yyyy年MM月dd日 hh:mm:ss'));
                    return (
                        <div className="item" key={value.id}>
                            <div className="icon-box"><i className="iconfont icon-ios-guangbo-outline"></i></div>
                            <div className="item-box">
                                <div className="item-box-top">
                                    <span className="name">系统通知</span>
                                    <span className="time">{showTimeText}</span>
                                </div>
                                <div className="item-box-content">
                                    {value.content}
                            </div>
                            </div>
                        </div>
                    )
                } )
            }
        </div>
    )
}