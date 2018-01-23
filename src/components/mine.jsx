import React from 'react';
import { Link } from 'react-router';
import { List, Badge,WhiteSpace  } from 'antd-mobile';
import { Jiange,Line } from './templateHomeCircle';
import QueueAnim from 'rc-queue-anim';

require ('../css/person.scss');

const urls = [require('../images/touxiang.png')]
export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bgStyle: "jianGe",
            border: "line",
            hide: false
        }
    }
    componentDidMount(){

    }
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
                        <a href="javascript:;" onClick={()=>{this.showPersonalMsg();this.props.setState({display:"none"})}}>用户名称<i className="iconfont icon-tubiao-"></i></a>
                        <span className="iconfont icon-shezhi" style={{ color:"#2a2a34",float:'right' }}></span>                    
                    </p>
                </div>
                <div className="minePic">
                    <div className="minePicTou">
                        <img src={urls[0]} alt=""/>
                        <div className="minePicStages">
                            <span>37%</span>
                        </div>
                    </div>
                </div>
                <ul className="mineThingsTodo">
                    <li>
                        <Link to="/account">
                            <p className="num">5000.00</p>
                            <p>账户</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/quoteList">
                            <p className="num"><i style={{ color: "red" }}>1</i>/12</p>
                            <p>报价</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/orderList">
                            <p className="num"><i style={{ color: "red" }}>1</i>/12</p>
                            <p>订单</p>
                        </Link>
                    </li>
                </ul>
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
                        <List.Item extra="20" className="ListItemBorder amlistitem">
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
                                        <img src={urls[0]} alt="" />
                                    </div>
                                </div>
                                <WhiteSpace size="lg" />
                                <div style={{ margin: "0 20px", backgroundColor:"#E8E8E8",height:"1px"}}></div> 
                                <div className="personalMsgList">
                                    <List>
                                        <List.Item extra="冰原落泪">
                                            <p>称呼</p>
                                        </List.Item>
                                        <List.Item extra="男">
                                            <p>性别</p>
                                        </List.Item>
                                        <List.Item extra="画客网">
                                            <p>公司</p>
                                        </List.Item>
                                        <List.Item extra="前端开发攻城狮">
                                            <p>职务</p>
                                        </List.Item>
                                        <List.Item extra="15666668888">
                                            <p>手机</p>
                                        </List.Item>
                                        <List.Item extra="15666668888@163.com">
                                            <p>邮箱</p>
                                        </List.Item>
                                        <List.Item extra="浙江-杭州">
                                            <p>所在地</p>
                                        </List.Item>
                                    </List>
                                    <span className="iconfont icon-chuyidong1-copy" onClick={()=>{this.showPersonalMsg();this.props.setState({display:"block"})}}></span>
                                </div>
                            </div>
                        ] : null}
                    </QueueAnim>
                </div>
            </div>
        )
    }
}