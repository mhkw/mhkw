import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

export default class DesignerHome extends React.Component {
    constructor(props) {
        super( props)
        this.state = {
            user_name: "",
            avatarUrl:require("../images/avatar.png")
        }
    }
    render() {
        return (
            <QueueAnim className="designer-home-anim"
                animConfig={[
                    { opacity: [1, 0], translateX: [0, 150] }
                ]}>
                <div className="designer-home" key="1">
                    <NavBar
                        className="NewNavBar"
                        mode="light"
                        icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                        onLeftClick={() => hashHistory.goBack()}
                        rightContent={<Icon key="1" type="ellipsis" style={{ "color": "#5f5f5f" }}  />}
                    ></NavBar>
                    <div className="brief-box-out">
                        <div className="avatar-box"><img src={this.state.avatarUrl}/></div>
                        <p className="nick-name"><span className="text">Miazhang</span></p>
                    </div>
                </div>
            </QueueAnim>
        )
    }
}

DesignerHome.contextTypes = {
    router: React.PropTypes.object
};