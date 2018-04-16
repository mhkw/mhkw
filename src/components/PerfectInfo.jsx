import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, InputItem, List, WhiteSpace, Button, Accordion, Radio  } from "antd-mobile";

const defaultAvatar = [require('../images/selec.png')]

export default class PerfectInfo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            AccordionIsOpen: false,
            avatar: "",
            sex: "保密",
            nick_name: '',
            company: '',
            job_name: '',
            qq: '',
            weixin: '',
            email: '',
            username: '', //手机号
            saveImgObject: false,
        }
        //获取到个人基本信息后的执行函数
        this.handleUserBaseInfo = (res) => {
            if (res.success) {
                let { path_thumb: avatar, sex, nick_name, company, job_name, qq, weixin, email, username } = res.data;
                this.setState({
                    avatar,
                    sex,
                    nick_name,
                    company,
                    job_name,
                    qq,
                    weixin,
                    email,
                    username
                })
            } else {
                Toast.info(res.message, 1.5);
            }
        }
        //修改个人基本信息后的执行函数
        this.handleChangeUserInfo = (res) => {
            Toast.info(res.message, 1.5);
        }
    }
    changeAccordionOpenStatus = () => {
        this.setState({
            AccordionIsOpen: !this.state.AccordionIsOpen
        })
    }
    changeMoreInfo = () => {
        hashHistory.push({
            pathname: '/setUp',
            query: { form: 'PerfectInfo' }
        });
    }
    clickSave = () => {
        let { nick_name } = this.state;
        if (this.testNickName(nick_name)) {
            this.ajaxChangeUserInfo();
        }
        
    }
    changeSex = (value) => {
        this.setState({sex: value})
    }
    //校验昵称，昵称怎么着也不能为空吧
    testNickName(val) {
        if (val.trim().length < 1) {
            Toast.info("昵称不能为空!", 1);
            return false;
        }
        if (!(/^.{1,20}$/.test(val))) {
            Toast.info("昵称错误！", 1);
            return false;
        } else {
            return true;
        }
    }
    //ajax获取个人基本信息
    ajaxGetUserBaseInfo = () => {
        runPromise('get_user_base_info', {}, this.handleUserBaseInfo);
    }
    //ajax修改基本信息
    ajaxChangeUserInfo = () => {
        let { sex, nick_name, company, job_name, qq, weixin, email, username } = this.state;
        let formatSex = '1';
        switch (sex) {
            case "男":
                formatSex = '1';
                break;
            case "女":
                formatSex = '2';
                break;
            case "保密":
                formatSex = '3';
                break;
        }
        runPromise('change_user_info', {
            sex: formatSex, 
            nick_name, 
            company, 
            job_name, 
            qq, 
            weixin,
        }, this.handleChangeUserInfo);
    }
    componentDidMount() {
        this.ajaxGetUserBaseInfo();
    }
    //上传图片
    onChangeFile = (e) => {
        this.props.propsSetState("UploadAvatar", {
            img: e.target.files[0]
        });
        this.setState({
            saveImgObject: true
        },()=>{
            //跳转到裁切图片页
            hashHistory.push({
                pathname: '/uploadAvatar',
                query: { form: 'PerfectInfo' },
            });
        })
    }
    componentWillUnmount() {
        if (!this.state.saveImgObject) {
            this.props.propsSetState("UploadAvatar", {
                img: null
            });
        }
    }
    render() {
        return (
            <div className="perfect-info-page" key="1">
                <NavBar
                    className="new-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                    rightContent={<Button className="rechargeButton" onClick={this.clickSave}>保存</Button>}
                >完善资料</NavBar>
                <WhiteSpace size="md" />
                <List>
                    <List.Item 
                        className="avatar-list"
                        extra={
                            <div className="avatar-input">
                                <input className="img-input" type="file" accept="image/*" onChange={this.onChangeFile} />
                                <img 
                                    src={this.state.avatar ? this.state.avatar : defaultAvatar}
                                    className="perfect-info-avatar"
                                    onError={(e) => { e.target.src = defaultAvatar }} 
                                />
                            </div>
                        }
                        arrow="horizontal" 
                    >头像</List.Item>
                </List>
                <WhiteSpace size="md" />
                <List className="perfect-info-main">
                    <InputItem
                        type="string"
                        value={this.state.nick_name}
                        onChange={(val) => { this.setState({ nick_name: val }) }}
                        placeholder="请输入昵称"
                        maxLength="20"
                        clear
                    >昵称</InputItem>
                    <InputItem
                        type="string"
                        value={this.state.company}
                        onChange={(val) => { this.setState({ company: val }) }}
                        placeholder="请输入公司名称"
                        maxLength="20"
                        clear
                    >公司</InputItem>
                    <InputItem
                        type="string"
                        value={this.state.job_name}
                        onChange={(val) => { this.setState({ job_name: val }) }}
                        placeholder="请输入职位"
                        maxLength="20"
                        clear
                    >职位</InputItem>
                    <InputItem
                        type="string"
                        value={this.state.qq}
                        onChange={(val) => { this.setState({ qq: val }) }}
                        placeholder="请输入QQ"
                        maxLength="20"
                        clear
                    >QQ</InputItem>
                    <InputItem
                        type="string"
                        value={this.state.weixin}
                        onChange={(val) => { this.setState({ weixin: val }) }}
                        placeholder="请输入微信"
                        maxLength="20"
                        clear
                    >微信</InputItem>
                </List>
                <List renderHeader={"性别"} className="perfect-info-sex">
                    <Accordion className="perfect-info-accordion" activeKey={this.state.AccordionIsOpen ? "1" : "0"} onChange={() => { this.changeAccordionOpenStatus()}}>
                        <Accordion.Panel header={this.state.sex} key="1">
                            <Radio.RadioItem checked={this.state.sex === "男"} onChange={() => {this.changeSex("男"),this.changeAccordionOpenStatus()} }>
                                {"男"}
                            </Radio.RadioItem>
                            <Radio.RadioItem checked={this.state.sex === "女"} onChange={() => { this.changeSex("女"), this.changeAccordionOpenStatus() } }>
                                {"女"}
                            </Radio.RadioItem>
                            <Radio.RadioItem checked={this.state.sex === "保密"} onChange={() => { this.changeSex("保密"), this.changeAccordionOpenStatus() } }>
                                {"保密"}
                            </Radio.RadioItem>
                        </Accordion.Panel>
                    </Accordion>
                </List>
                <List renderHeader={"更多设置"} className="perfect-info-more">
                    <List.Item arrow="horizontal" onClick={this.changeMoreInfo} thumb={<span className="info-thumb">邮箱</span>}>{this.state.email}</List.Item>
                    <List.Item arrow="horizontal" onClick={this.changeMoreInfo} thumb={<span className="info-thumb">手机号</span>}>{this.state.username}</List.Item>
                </List>
            </div>
        )
    }
}