import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, WhiteSpace, InputItem, List} from "antd-mobile";

export default class Address extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            address: "",
            city: "", //通过城市列表选择的城市
            currentLocation: "", //定位当前位置的地址
        }
    }
    //点击定位当前位置
    locateNowAddress = () => {
        console.log("定位当前位置")
    }
    //输入地址，
    onChangeAddr = (value) => {
        console.log(value);
    }
    //选择地图上选点
    selectMapAddr = (e) => {
        console.log("选择地图上选点");
    }
    //点击历史地址
    historyAddress = (e) => {
        console.log("点击历史地址")
    }
    //点击删除某个常用地址
    deleteHistoryAddr = (e) => {
        e.stopPropagation(); //阻止事件冒泡
        console.log("点击删除某个常用地址")
    }
    render() {
        return (
            <div className="select-address" key="1">
                <NavBar
                    className="new-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                    rightContent={<Link className="toCitySetStyle" to="/city">城市列表</Link>}
                >
                    {this.state.address ? this.state.address : "定位"}
                </NavBar>
                <WhiteSpace size="lg" />
                <List.Item
                    className="position-current-location"
                    onClick={this.locateNowAddress}
                >{this.state.currentLocation ? this.state.currentLocation : <span><i className="iconfont icon-zhongxindingwei"></i>定位当前地址</span> }</List.Item>
                <WhiteSpace size="lg" />
                <InputItem
                    className="position-InputItem label-city"
                    type="text"
                    placeholder="其他位置请输入"
                    extra={<i onClick={this.selectMapAddr} className="iconfont icon-dituzhaofang"></i>}
                    clear
                    maxLength={20}
                    onChange={(val)=>{ this.onChangeAddr(val) }}
                >
                    <span>
                        <i className="iconfont icon-dingwei"></i>
                        {this.state.city}
                    </span>
                </InputItem>
                {/* <div className="common more-address-box">
                    <p className="title">常用地址</p>
                    <InputItem
                        className="position-InputItem home"
                        type="text"
                        placeholder="请输入家的位置"
                        extra={<i className="iconfont icon-dituzhaofang"></i>}
                        clear
                        maxLength={20}
                        onChange={(val)=>{ this.onChangeAddr(val, "home") }}
                    >
                        <span>
                            <i className="iconfont icon-fangzi"></i>
                            {'家'}
                        </span>
                    </InputItem>
                    <InputItem
                        className="position-InputItem company"
                        type="text"
                        placeholder="请输入公司的位置"
                        extra={<i className="iconfont icon-dituzhaofang"></i>}
                        clear
                        maxLength={20}
                        onChange={(val) => { this.onChangeAddr(val, "company") }}
                    >
                        <span>
                            <i className="iconfont icon-iconset0190"></i>
                            {'公司'}
                        </span>
                    </InputItem>
                </div> */}
                <WhiteSpace size="xl" />
                <div className="history more-address-box">
                    <p className="title-p">历史位置</p>
                    <List className="history-list">
                        <List.Item 
                            thumb={<i className="iconfont icon-dingwei"></i>}
                            extra={<i onClick={this.deleteHistoryAddr} className="iconfont icon-shanchu"></i>}
                            onClick={this.historyAddress}
                        >杭州市西湖区</List.Item>
                        <List.Item
                            thumb={<i className="iconfont icon-dingwei"></i>}
                            extra={<i onClick={this.deleteHistoryAddr} className="iconfont icon-shanchu"></i>}
                            onClick={this.historyAddress}
                        >上海市东方明珠塔</List.Item>
                    </List>
                </div>
            </div>
        )
    }
}