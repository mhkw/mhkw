import React from 'react'
import { NavBar, Icon, Button, WingBlank, Checkbox, Stepper } from 'antd-mobile';
import { hashHistory, Link } from 'react-router';

import update from 'immutability-helper';

const ServerItem = (props) => (
    <div className="server-item clearfix">
        <Checkbox.CheckboxItem key={props.index} onChange={() => props.onChangeisChecked(props.index)}>
            {[
                <h2 className="ellipsis">{props.title}</h2>, 
                <Link to="/addServer">编辑</Link>
            ]}
        </Checkbox.CheckboxItem>
        <p className="describe ellipsis-lines">{props.describe}</p>
        <div className="unit-box"><span className="unit_price">{props.unit_price}</span>/<span className="unit">{props.unit}</span></div>
        <Stepper
            className="my-stepper"
            showNumber
            min={1}
            max={100000}
            step={1}
            value={props.number}
            onChange={(val) => props.onChangeThisNumber(val, props.index)}
            onBlur={(e) => { e.target.value < 1 ? props.onChangeThisNumber(1, props.index) : null} }
        />
    </div>
)


export default class ServerCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 2, //添加服务输入信息的进度：0,1,2,3
            serverList: [{
                id: "1",
                server_name: "PS简单处理图片",
                unit_price: "2000.00", //单价
                unit: "小时", //单位
                describe: "海报设计定制图片海报设计定制图片海报设计定制图片", //简介
                number: 1,
                isChecked: false
            },
            {
                id: "2",
                server_name: "PS简单处理图片2",
                unit_price: "1000.00", //单价
                unit: "天", //单位
                describe: "巴拉巴拉", //简介
                number: 1,
                isChecked: false
            }],
        };
    }

    componentDidMount(){

    }
    onChangeisChecked = (index) => {
        const isChecked = this.state.serverList[index].isChecked;
        const newServerList = update(this.state.serverList, { [index]: { isChecked: { $set: !isChecked }} });
        this.setState({
            serverList: newServerList
        })
    }
    onChangeThisNumber = (val, index) => {
        let value = (isNaN(val) || val == "" ) ? "" : parseInt(val);
        const newServerList = update(this.state.serverList, { [index]: { number: { $set: value } } });
        this.setState({
            serverList: newServerList
        })
    }
    // handleToggle() {
    //     this.setState(({ show }) => ({
    //         show: !show
    //     }))
    // }
    render () {
        return (
            <div className="createServer" key="1">
                <NavBar
                    className="create-server-nav-bar"
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => hashHistory.goBack()}
                    leftContent={<span style={{fontSize:"15px"}}>返回</span>}
                    rightContent={[
                        <i className="iconfont icon-tianjiajiahaowubiankuang" style={{ color:"#A8A8A8",marginRight:"3px"}}></i>,
                        <span style={{ color: "#000", fontSize: "14px"}}>添加</span>
                    ]}
                >报价</NavBar>
                <div className="serverStep">
                    <ul>
                        <li className={this.state.progress > 0 ? "finish" : null}>创建/选择内容<div className="triangle-right"></div></li>
                        <li className={this.state.progress > 1 ? "finish" : null}>客户信息<div className="triangle-right"></div></li>
                        <li className={this.state.progress > 2 ? "finish" : null}>生成报价并分享<div className="triangle-right"></div></li>
                    </ul>
                </div>
                
                <div className="serverContent" style={{"display": this.state.serverList.length > 0 ? "none" : "block" }}>
                    <h3>您需要先添加一个服务</h3>
                    <p>我的服务包含了线上服务和线下服务，由您和客户自行商定</p>
                </div>
                {
                    this.state.serverList.map((val, index) => {
                        return (
                            <ServerItem
                                index={index}
                                id={val.id}
                                onChangeisChecked={this.onChangeisChecked}
                                title={val.server_name}
                                describe={val.describe}
                                unit_price={val.unit_price}
                                unit={val.unit}
                                number={val.number}
                                onChangeThisNumber={this.onChangeThisNumber}
                            ></ServerItem>
                        )
                    })
                }
                <div className="serverButton">
                    <Button 
                        type="ghost"
                        icon={<i className="iconfont icon-tianjiajiahaowubiankuang"></i>}
                        size="large"
                        style={{ margin: "0 2.3rem", color: "#009AE8", border:"1px solid #009AE8",height:"1.2rem"}}
                        activeStyle={{ backgroundColor: "#259EEF", color: "#fff",border:"1px solid #259EEF"}}
                    >
                        添加服务内容
                    </Button>
                </div>
            </div>
        )
    }
}

ServerCreate.contextTypes = {
    router: React.PropTypes.object
};