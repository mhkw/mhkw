import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Button, TextareaItem, ImagePicker, InputItem } from 'antd-mobile';

export default class PlaceOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navBarTitle: "品牌设计师 Miazhang",
        }
    }
    render() {
        return (
            <div key="1" className="place-order">
                <NavBar
                    className="NewNavBar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                >{this.state.navBarTitle}</NavBar>
            </div>
        )
    }
}