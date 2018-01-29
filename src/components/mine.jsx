import React from 'react';
import { Link } from 'react-router';
import { List, Badge,WhiteSpace  } from 'antd-mobile';
import { Jiange, Line, PersonalCenterMsg} from './templateHomeCircle';
import QueueAnim from 'rc-queue-anim';
import axios from 'axios';

import '../css/person.scss';

const urls = [require('../images/avatar.png')]
export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bgStyle: "jianGe",
            border: "line",
            hide: false,
            personCenter:{
                nick_name:'用户昵称',
                total_financial:0.00,
                working_order_count:0,
                order_count:0,
                working_quote_count:0,
                quote_count:0
            }
        };
        
    }
    componentDidMount(){
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
        })
        .catch((error) => {
            console.log(error , "错误");
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
    render () {
        return (
            <div className="mineWrap">
                <div className="mineWrapTop">
                    <p>
                        <a href="javascript:;" onClick={()=>{
                            this.showPersonalMsg();
                            this.props.setState({display:"none"})
                        }}>{this.state.personCenter.nick_name}<i className="iconfont icon-tubiao-"></i></a>
                        <span className="iconfont icon-shezhi" style={{ color:"#2a2a34",float:'right' }}></span>                    
                    </p>
                </div>
                <div className="minePic">
                    <div className="minePicTou">
                        <img src={this.state.personCenter.path_thumb || urls[0]} alt=""/>
                        <div className="minePicStages">
                            <span>37%</span>
                        </div>
                    </div>
                </div>
                <PersonalCenterMsg 
                    PersonalCenterAccount = {this.state.personCenter.total_financial}
                    working_order_count={this.state.personCenter.working_order_count}
                    order_count={this.state.personCenter.order_count}
                    working_quote_count={this.state.personCenter.working_quote_count}
                    quote_count={this.state.personCenter.quote_count}
                ></PersonalCenterMsg>
                <div className="showAllList">
                    <List>
                        <Line border={this.state.border}></Line>
                        <Jiange name={this.state.bgStyle}></Jiange>
                        <Line border={this.state.border}></Line>                        
                        <List.Item extra="" arrow="horizontal" className="ListItemLarge ListItemBorder">
                            <Badge>
                                <span 
                                    className="icon-personfill2 iconfont desingerIcon" 
                                />
                            </Badge>
                            <span style={{ marginLeft: 12 }}>申请成为设计师</span>
                        </List.Item>

                        <Jiange name={this.state.bgStyle}></Jiange>
                        <Line border={this.state.border}></Line>

                        <List.Item extra="" arrow="horizontal" className="ListItemBorder amlistitem">
                            <Badge>
                                <span className="iconfont icon-shijian1" />
                            </Badge>
                            <span style={{ marginLeft: 12 }}>我的动态</span>
                        </List.Item>
                        <List.Item extra="52" className="ListItemBorder amlistitem">
                            <Badge>
                                <span className="icon-wodeshoucang iconfont" />
                            </Badge>
                            <span style={{ marginLeft: 12 }}>我的收藏</span>
                        </List.Item>
                        <List.Item extra="" arrow="horizontal" className="ListItemBorder amlistitem">
                            <Badge>
                                <span className="icon-wodeshouhuodizhi iconfont" />
                            </Badge>
                            <span style={{ marginLeft: 12 }}>我的常用地址</span>
                        </List.Item>

                        <Jiange name={this.state.bgStyle}></Jiange>
                        <Line border={this.state.border}></Line>
                        <List.Item 
                            extra="0571-86803103" 
                            className="ListItemLarge"
                        >
                            <Badge>
                                <span className="iconfont icon-wenhao" />
                            </Badge>
                            <span style={{ marginLeft: 12 }}>联系客服</span>
                        </List.Item>
                        <Line border={this.state.border}></Line>
                        
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
                                <div style={{ margin: "0 20px", backgroundColor:"#E8E8E8",height:"1px"}}></div> 
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
                                        onClick={()=>{this.showPersonalMsg();
                                            this.props.setState({display:"block"})
                                        }}
                                    ></span>
                                </div>
                            </div>
                        ] : null}
                    </QueueAnim>
                </div>
            </div>
        )
    }
}