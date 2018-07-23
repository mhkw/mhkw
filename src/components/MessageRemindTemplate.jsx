const defaultAvatar = require('../images/avatar.png');
export const Comment = (props) => {
    return (
        <div className="remind-comment-page">
            <div className="item">
                <div className="item-avatar"><img className="remind-avatar" src={defaultAvatar}/> </div>
                <div className="item-box">
                    <div className="item-box-top">
                        <span className="name ellipsis">小庄</span>
                        <span className="tips">回复你</span>
                        <span className="time">6月19日 23:49</span>
                    </div>
                    <div className="item-box-content">
                        我也不知道，后来查了，结果正常。
                    </div>
                    <div className="item-box-source ellipsis">
                        已经做过脐带穿鞋，显示胎儿男色体正常，~\(≧▽≦)/~啦啦啦，破事儿分别放假喝喜酒
                    </div>
                </div>
            </div>
            <div className="item">
                <div className="item-avatar"><img className="remind-avatar" src={defaultAvatar} /> </div>
                <div className="item-box">
                    <div className="item-box-top">
                        <span className="name ellipsis">小庄</span>
                        <span className="tips">回复你</span>
                        <span className="time">6月19日 23:49</span>
                    </div>
                    <div className="item-box-content">
                        我也不知道，后来查了，结果正常。
                    </div>
                    <div className="item-box-source ellipsis">
                        已经做过脐带穿鞋，显示胎儿男色体正常，~\(≧▽≦)/~啦啦啦，破事儿分别放假喝喜酒
                    </div>
                </div>
            </div>

        </div>
    )
}
export const SeeMe = (props) => {
    return (
        <div className="remind-see-me-page">看过我</div>
    )
}
export const Fabulous = (props) => {
    return (
        <div className="remind-fabulous-page">赞</div>
    )
}
export const SystemNotification = (props) => {
    return (
        <div className="remind-system-notification-page">系统通知</div>
    )
}