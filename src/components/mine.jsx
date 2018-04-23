import React from 'react';
import { Link, hashHistory } from 'react-router';
import { List, Badge,WhiteSpace  } from 'antd-mobile';
import { Jiange, Line, PersonalCenterMsg} from './templateHomeCircle';
import QueueAnim from 'rc-queue-anim';
import axios from 'axios';
import BScroll from 'better-scroll'

import '../css/person.scss';

const urls = [require('../images/avatar.png')]
export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bgStyle: "jianGe",
            border: "line",
            hide: false,
            height: "",
            personCenter:{
                nick_name: sessionStorage.getItem("nick_name") || '用户昵称',
                total_financial:0.00,
                working_order_count:0,
                order_count:0,
                working_quote_count:0,
                quote_count:0,
                path_thumb: sessionStorage.getItem("path_thumb"),
                is_auth: '', //是否是认证设计师
                real_name_status: '', //是否实名认证
            }
        };
        
    }
    componentDidMount(){
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 25;
        const scroll = new BScroll(document.querySelector('.wrapper'), { click: true, bounceTime:300 })
        this.setState({
            height: hei
        })
        axios({
            method: 'post',
            url: 'https://www.huakewang.com/hkw_newapi/get_self_info/' + validate.getCookie('user_id'),
            withCredentials: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' 
            },
            responseType: 'json',
        })
        .then((response) => {
            this.setState({
                personCenter: response.data.data
            })
            if (response.data.data.nick_name) {
                sessionStorage.setItem("nick_name", response.data.data.nick_name)
            }
            if (response.data.data.path_thumb) {
                sessionStorage.setItem("path_thumb", response.data.data.path_thumb)
            }
        })
        .catch((error) => {
            // console.log(error , "错误");
            //如果没登录，跳转到登录页
            validate.setCookie('user_id', '');
            hashHistory.push({
                pathname: '/login',
                query: { form: 'mine' }
            });
        });

    }
    // shouldComponentUpdate() {
    //     return (this.props.router.location.action === 'POP')
    // }
    showPersonalMsg=()=>{
        this.setState({
            hide:!this.state.hide
        })
    }
    //点击右上角的设置按钮
    clickSettings = () => {
        hashHistory.push({
            pathname: '/settings',
            query: { form: 'mine' }
        });
    }
    //点击常用地址
    clickCommonAddress = () => {
        hashHistory.push({
            pathname: '/commonAddress',
            query: { form: 'mine' }
        });
    }
    //点击常用地址
    clickMyContacts = () => {
        hashHistory.push({
            pathname: '/myContacts',
            query: { form: 'mine' }
        });
    }
    //原生APP，打电话, 联系客服，这个客户电话是常量
    callPhone() {
        const phone = "057186803103";
        if (window.api) {
            //APP处理
            window.api.call({
                type: 'tel_prompt',
                number: phone
            });
        } else {
            //H5页面处理
        }
    }
    //点击黑名单
    clickUserBlackList = () => {
        hashHistory.push({
            pathname: '/userBlackList',
            query: { form: 'mine' }
        });
    }
    //点击粉丝
    clickUserFansList = () => {
        hashHistory.push({
            pathname: '/userFansList',
            query: { form: 'mine' }
        });
    }
    //点击收藏
    clickCollect = () => {
        hashHistory.push({
            pathname: '/collect',
            query: { form: 'mine' }
        });
    }
    clickNotice =()=>{
        hashHistory.push({
            pathname: '/myNotice',
            query: { form: 'mine' }
        });
    }
    //账户设置
    clickSetUp = () => {
        hashHistory.push({
            pathname: '/setUp',
            query: { form: 'mine' }
        });
    }
    //点击头像
    clickPersonAvatar = () => {
        hashHistory.push({
            pathname: '/perfectInfo',
            query: { form: 'mine' }
        });
    }
    //点击设计师认证
    clickDesignerAuth = () => {
        // console.log("ads");
        
        hashHistory.push({
            pathname: '/designerAuth',
            query: { form: 'mine' }
        });
    }
    clickWorks = () => {
        hashHistory.push({
            pathname: '/userWorks',
            query: { form: 'allWorks' }
        });
    }
    //点击实名认证
    clickRealName = () => {
        hashHistory.push({
            pathname: '/realName',
            query: { form: 'allWorks' }
        });
    }
    render () {
        return (
            <div className="mineWrap">
                <div className="top">
                    <div className="mineWrapTop">
                        <p>
                            <a href="javascript:;" onClick={() => {
                                this.showPersonalMsg();
                                this.props.setState({ display: "none" })
                            }}>{this.state.personCenter.nick_name}<i className="iconfont icon-tubiao-"></i></a>
                            <span onClick={this.clickSettings} className="iconfont icon-shezhi" style={{ color: "#2a2a34", float: 'right' }}></span>
                        </p>
                    </div>
                    <div className="minePic">
                        <div className="minePicTou" onClick={this.clickPersonAvatar}>
                            <img src={this.state.personCenter.path_thumb || urls[0]} alt="" />
                            <div className="minePicStages">
                                <span>37%</span>
                            </div>
                        </div>
                    </div>
                    <PersonalCenterMsg
                        PersonalCenterAccount={this.state.personCenter.total_financial}
                        working_order_count={this.state.personCenter.working_order_count}
                        order_count={this.state.personCenter.order_count}
                        working_quote_count={this.state.personCenter.working_quote_count}
                        quote_count={this.state.personCenter.quote_count}
                    ></PersonalCenterMsg>
                    <Line border={this.state.border}></Line>                    
                </div>
                <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                    <div>
                        <div className="showAllList">
                            <List>
                                <Line border={this.state.border}></Line>
                                <Jiange name={this.state.bgStyle}></Jiange>
                                {/* <Line border={this.state.border}></Line> */}
                                <List.Item extra="" arrow="horizontal" className="ListItemLarge ListItemBorder" onClick={this.clickDesignerAuth}>
                                    <Badge>
                                        <span
                                            className="icon-personfill2 iconfont desingerIcon"
                                        />
                                    </Badge>
                                    <span style={{ marginLeft: 12 }}>
                                        {this.state.personCenter.is_auth == "1" ? "我是设计师" : null}
                                        {this.state.personCenter.is_auth == "1" ? <i className="iconfont auth icon-renzhengguanli"></i> : null}
                                        {this.state.personCenter.is_auth == "0" ? "申请成为设计师" : null}
                                    </span>
                                </List.Item>
                                <List.Item extra="" arrow="horizontal" className="ListItemLarge ListItemBorder" onClick={this.clickRealName}>
                                    <Badge>
                                        <span
                                            className="icon-yirenzheng iconfont desingerIcon"
                                        />
                                    </Badge>
                                    <span style={{ marginLeft: 12 }}>
                                        实名认证
                                {this.state.personCenter.real_name_status == "2" ? <i className="iconfont auth icon-Id"></i> : null}
                                        {this.state.personCenter.real_name_status != "" && this.state.personCenter.real_name_status != "2" ? <span className="no-auth">(未认证)</span> : null}
                                    </span>
                                </List.Item>

                                <Jiange name={this.state.bgStyle}></Jiange>
                                <Line border={this.state.border}></Line>

                                <List.Item extra="" arrow="horizontal" className="ListItemBorder amlistitem" onClick={this.clickWorks}>
                                    <Badge>
                                        <span className="iconfont icon-sheji" />
                                    </Badge>
                                    <span style={{ marginLeft: 12 }}>我的作品</span>
                                </List.Item>
                                <List.Item extra="" arrow="horizontal" className="ListItemBorder amlistitem" onClick={this.clickNotice}>
                                    <Badge>
                                        <span className="iconfont icon-shijian1" />
                                    </Badge>
                                    <span style={{ marginLeft: 12 }}>我的动态</span>
                                </List.Item>
                                <List.Item extra="" arrow="horizontal" className="ListItemBorder amlistitem" onClick={this.clickCollect}>
                                    <Badge>
                                        <span className="icon-wodeshoucang iconfont" />
                                    </Badge>
                                    <span style={{ marginLeft: 12 }}>我的收藏</span>
                                </List.Item>
                                <List.Item extra="" arrow="horizontal" className="ListItemBorder amlistitem" onClick={this.clickCommonAddress}>
                                    <Badge>
                                        <span className="icon-wodeshouhuodizhi iconfont" />
                                    </Badge>
                                    <span style={{ marginLeft: 12 }}>我的常用地址</span>
                                </List.Item>

                                <Jiange name={this.state.bgStyle}></Jiange>
                                <List.Item extra="" arrow="horizontal" className="ListItemBorder amlistitem" onClick={this.clickMyContacts}>
                                    <Badge>
                                        <span className="icon-geren3 iconfont" />
                                    </Badge>
                                    <span style={{ marginLeft: 12 }}>联系人</span>
                                </List.Item>
                                <List.Item extra="" arrow="horizontal" className="ListItemBorder amlistitem" onClick={this.clickUserFansList}>
                                    <Badge>
                                        <span className="icon-fensi iconfont" style={{ "font-weight": "bold" }} />
                                    </Badge>
                                    <span style={{ marginLeft: 12 }}>粉丝</span>
                                </List.Item>
                                <List.Item extra="" arrow="horizontal" className="ListItemBorder amlistitem" onClick={this.clickUserBlackList}>
                                    <Badge>
                                        <span className="icon-heimingdan iconfont" />
                                    </Badge>
                                    <span style={{ marginLeft: 12 }}>黑名单</span>
                                </List.Item>
                                <List.Item extra="" arrow="horizontal" className="ListItemBorder amlistitem" onClick={this.clickSetUp}>
                                    <Badge>
                                        <span className="icon-shezhi1 iconfont" />
                                    </Badge>
                                    <span style={{ marginLeft: 12 }}>个人设置</span>
                                </List.Item>

                                <Jiange name={this.state.bgStyle}></Jiange>
                                <Line border={this.state.border}></Line>
                                <List.Item
                                    extra="0571-86803103"
                                    className="ListItemLarge"
                                    onClick={this.callPhone}
                                >
                                    <Badge>
                                        <span className="iconfont icon-wenhao" />
                                    </Badge>
                                    <span style={{ marginLeft: 12 }}>联系客服</span>
                                </List.Item>
                                <Line border={this.state.border}></Line>
                                <div className="bottom" style={{ "height": "60px", "background-color": "#f7f7f7" }}></div>
                            </List>
                        </div>
                        <div className="navPlus" >
                            <QueueAnim className="demo-content"
                                animConfig={[
                                    { opacity: [1, 0], translateY: [0, -800] },
                                    { opacity: [1, 0], translateY: [0, -80] }
                                ]}>
                                {this.state.hide ? [
                                    <div className="demo-thead navPlusAnim" key="a">
                                        <div className="mineWrapTop">
                                            <p>
                                                <a href="javascript:;">我的名片</a>
                                            </p>
                                        </div>
                                        <WhiteSpace size="lg" />
                                        <div className="minePic">
                                            <div className="minePicTou">
                                                <img src={this.state.personCenter.path_thumb || urls[0]} alt="" />
                                            </div>
                                        </div>
                                        <WhiteSpace size="lg" />
                                        <div style={{ margin: "0 20px", backgroundColor: "#E8E8E8", height: "1px" }}></div>
                                        <div className="personalMsgList">
                                            <List>
                                                <List.Item extra={this.state.personCenter.nick_name}>
                                                    <p>称呼</p>
                                                </List.Item>
                                                <List.Item extra={this.state.personCenter.sex}>
                                                    <p>性别</p>
                                                </List.Item>
                                                <List.Item extra={this.state.personCenter.company}>
                                                    <p>公司</p>
                                                </List.Item>
                                                <List.Item extra={this.state.personCenter.job_name}>
                                                    <p>职务</p>
                                                </List.Item>
                                                <List.Item extra={this.state.personCenter.mobile}>
                                                    <p>手机</p>
                                                </List.Item>
                                                <List.Item extra={this.state.personCenter.qq}>
                                                    <p>Q Q</p>
                                                </List.Item>
                                                <List.Item extra={this.state.personCenter.long_lat_address}>
                                                    <p>所在地</p>
                                                </List.Item>
                                            </List>
                                            <span
                                                className="iconfont icon-chuyidong1-copy"
                                                onClick={() => {
                                                    this.showPersonalMsg();
                                                    this.props.setState({ display: "block" })
                                                }}
                                            ></span>
                                        </div>
                                    </div>
                                ] : null}
                            </QueueAnim>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}