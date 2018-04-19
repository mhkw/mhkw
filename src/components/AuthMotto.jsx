import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, InputItem, List, Modal, WhiteSpace, WingBlank, Tag, Button, TextareaItem } from "antd-mobile";

export default class AuthMotto extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            signature_bbs: '',
            content: '',
        }
    }
    clickSave = () => {
        let { signature_bbs, content } = this.state;
        if (signature_bbs.length < 1) {
            Toast.info("请输入一句话介绍",1);
        } else {
            this.props.propsSetState("Self", {
                signature_bbs,
                content,
            });
            this.props.ajaxChangeMotto({ signature_bbs, content });
        }
        
    }
    getSelfInfo = (props) => {
        if (props.Self && props.Self.signature_bbs) {
            let { signature_bbs, content } = props.Self;
            this.setState({ signature_bbs, content });
        }
    }
    componentWillMount() {
        this.getSelfInfo(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getSelfInfo(nextProps);
    }
    render() {
        return (
            <div className="auth-motto-page designer-auth-page" key="1">
                <NavBar
                    className="new-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                    rightContent={<Button className="rechargeButton" onClick={this.clickSave}>保存</Button>}
                >关于我</NavBar>
                <List renderHeader={<span className="render-header">一句话介绍</span>} className="auth-motto-list">
                    <InputItem
                        type="string"
                        value={this.state.signature_bbs}
                        onChange={(val) => { this.setState({ signature_bbs: val }) }}
                        placeholder="请填写一句话介绍"
                        maxLength="30"
                        clear
                    ></InputItem>
                </List>
                <List renderHeader={<span className="render-header">我的介绍</span>} className="auth-motto-list">
                    <TextareaItem
                        placeholder="请填写详细介绍"
                        autoHeight
                        rows={5}
                        count={200}
                        value={this.state.content}
                        onChange={(val) => { this.setState({ content: val }); }}
                    />
                </List>
            </div>
        )
    }
}