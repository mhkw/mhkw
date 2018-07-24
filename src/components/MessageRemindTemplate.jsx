import { List, Flex } from 'antd-mobile';
const defaultAvatar = require('../images/avatar.png');
export const Comment = (props) => {
    return (
        <div className="remind-comment-page">
            <div className="item" key={1}>
                <div className="item-avatar"><img className="remind-avatar" src={defaultAvatar}  onError={(e) => { e.target.src = avatar }} /> </div>
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
        </div>
    )
}
export const SeeMe = (props) => {
    return (
        <div className="remind-see-me-page">
            {/* <div className="see-me-item">
                <div className="see-me-item-avatar"><img className="see-me-avatar" src={defaultAvatar} /> </div>
                <div className="see-me-item-box">
                    <div className="item-box-top">
                        <span className="name ellipsis">小庄</span>
                        <span className="time">6月19日 23:49</span>
                    </div>
                    <div className="item-box-content">
                        <span className="label">产品经理</span>
                        <span className="label">自由职业</span>
                        <span className="label">努力工作</span>
                    </div>
                </div>
            </div> */}
            <Flex className="see-me-item" key={1}>
                <div className="flex-item-left">
                    <img className="black-img" src={defaultAvatar} onError={(e) => { e.target.src = avatar }} />
                </div>
                <Flex.Item className="flex-item-middle">
                    <p className="black-p-title">
                        <span className="name ellipsis">小庄</span>
                        <span className="time">6月19日 23:49</span>
                    </p>
                    <p className="black-p-middle ellipsis">
                        <span className="label">产品经理</span>
                        <span className="label">自由职业</span>
                        <span className="label">努力工作</span>
                    </p>
                </Flex.Item>
            </Flex>
        </div>
    )
}
export const Fabulous = (props) => {
    return (
        <div className="remind-fabulous-page remind-comment-page">
            <div className="item" key={1}>
                <div className="item-avatar"><img className="remind-avatar" src={defaultAvatar} onError={(e) => { e.target.src = avatar }} /> </div>
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
        </div>
    )
}
export const SystemNotification = (props) => {
    return (
        <div className="remind-system-notification-page remind-comment-page">
            <div className="item" key={1}>
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
            </div>
        </div>
    )
}