import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, InputItem, List, Modal, WhiteSpace } from "antd-mobile";
import update from 'immutability-helper';
import { Motion, spring } from 'react-motion';
import BScroll from 'better-scroll'

//首先判断用户是不是移动端，（是否存在api这个接口）
let UserIsPhone = false;
if (window.api) {
    UserIsPhone = true;
}

//如果当前用户是iOS系统，需要初始化百度地图
let IsIOS = false;
if (/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
    IsIOS = true;
}

export default class CommonAddress extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            commonAddress: [], //常用地址列表
            homeAddressIndex: -1, //家庭地址索引
            companyAddressIndex: -1, //公司地址索引
            height:""
        }
        this.handleUserHistoryCoordinate = (res) => {
            if (res.success) {
                let commonAddress = res.data;
                let homeAddressIndex = -1;
                let companyAddressIndex = -1;
                for (let i = 0; i < commonAddress.length; i++) {
                    const value = commonAddress[i];
                    if (value.address_type == "home") {
                        homeAddressIndex = i;
                    }
                    if (value.address_type == "company") {
                        companyAddressIndex = i;
                    }
                }
                this.setState({ commonAddress, homeAddressIndex, companyAddressIndex })
            } else {
                Toast.fail(res.message, 1);
            }
        }
        this.handleDeleteCommonAddr = (res, id) => {
            if (res.success) {
                Toast.success(res.message, 1, ()=>{
                    let commonAddress = this.state.commonAddress;
                    let addressIndex = 0; //选中的地址的索引

                    for (let i = 0; i < commonAddress.length; i++) {
                        const addr = commonAddress[i];
                        if (addr.id == id) {
                            addressIndex = i;
                            break;
                        }
                    }

                    const newCommonAddress = update(commonAddress, { $splice: [[addressIndex, 1]] } );
                    this.setState({ commonAddress: newCommonAddress });
                });
            } else {
                Toast.fail(res.message, 1);
            }
        }
    }
    componentDidMount() {
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 25;
        const scroll = new BScroll(document.querySelector('.wrapper'), { click: true })
        this.setState({
            height: hei
        })
        this.getUserHistoryCoordinate();
    }
    //获取用户常用地址列表
    getUserHistoryCoordinate = () => {
        this.ajaxUserHistoryCoordinate();
    }
    //获取常用地址列表
    ajaxUserHistoryCoordinate = () => {
        runPromise("get_user_history_coordinate", {
            user_id: validate.getCookie('user_id'),
        }, this.handleUserHistoryCoordinate);
    }
    //点击删除某个常用地址
    clickDeleteCommonAddr = (e,id, value) => {
        e.stopPropagation(); //阻止事件冒泡
        Modal.alert('删除地址?', value, [
            { text: '取消', onPress: () => { }, style: 'default' },
            { text: '确定', onPress: () => this.ajaxDeleteCommonAddr(id) },
        ]);
    }
    //删除某个常用地址
    ajaxDeleteCommonAddr = (id) => {
        runPromise("delete_user_coordinate", {
            user_id: validate.getCookie('user_id'),
            coordinate_id: id
        }, this.handleDeleteCommonAddr, true, "post", id);
    }
    /**
     * 修改或新增某个常用地址，此时的动作为地图选点
     * 
     * @memberof CommonAddress
     * @param address_type 如果为home或company则为修改。如果为common则为删除
     */
    clickChangeCommonAddr = (address_type) => {
        console.log("地图选点", address_type)
        hashHistory.push({
            pathname: '/baiduMap',
            query: { 
                form: 'AddressCommon',
                address_type,
             }
        });
    }
    render() {
        return (
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div className="common-address" style={{ ...interpolatingStyle, position: "relative" }}>
                        <NavBar
                            className="new-nav-bar top"
                            mode="light"
                            icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                            onLeftClick={() => hashHistory.goBack()}
                            rightContent={<span onClick={() => { this.clickChangeCommonAddr("common") }} ><i className="iconfont icon-dituzhaofang"></i>新增</span>}
                        >常用地址</NavBar>
                        <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                            <div className="common more-address-box">
                                <WhiteSpace size="lg" />                            
                                <p className="title">地址设置：</p>
                                <List className="history-list common-addr-list first">
                                    {/* <List.Item
                                    thumb={<i className="iconfont icon-dingwei"></i>}
                                    extra={<i onClick={this.deleteHistoryAddr} className="iconfont icon-shanchu"></i>}
                                    onClick={this.clickHistoryAddress}
                                >杭州市西湖区</List.Item> */}
                                    {/* {
                                    this.state.commonAddress.map((value, index) => {
                                        return  value.address_type == "home" ?
                                            (
                                                <List.Item
                                                    key={value.id}
                                                    thumb={<span><i className="iconfont icon-fangzi"></i>家</span>}
                                                    extra={<i onClick={() => { this.clickChangeCommonAddr("home") }} className="iconfont icon-dituzhaofang"></i>}
                                                // onClick={() => { this.clickHistoryAddress(value) }}
                                                >{value.long_lat_address}</List.Item>
                                            ) : null
                                    })
                                }
                                {
                                    this.state.commonAddress.map((value, index) => {
                                        return value.address_type == "company" ?
                                            (
                                                <List.Item
                                                    key={value.id}
                                                    thumb={<span><i className="iconfont icon-iconset0190"></i>公司</span>}
                                                    extra={<i onClick={() => { this.clickChangeCommonAddr("company") }} className="iconfont icon-dituzhaofang"></i>}
                                                // onClick={() => { this.clickHistoryAddress(value) }}
                                                >{value.long_lat_address}</List.Item>
                                            ) : null
                                    })
                                } */}
                                    <List.Item
                                        key={0}
                                        thumb={<span><i className="iconfont icon-fangzi"></i>家</span>}
                                        extra={<i onClick={() => { this.clickChangeCommonAddr("home") }} className="iconfont icon-dituzhaofang"></i>}
                                    >{this.state.homeAddressIndex > 0 ? this.state.commonAddress[this.state.homeAddressIndex].long_lat_address : '请选择家庭地址'}</List.Item>
                                    <List.Item
                                        key={1}
                                        thumb={<span><i className="iconfont icon-iconset0190"></i>公司</span>}
                                        extra={<i onClick={() => { this.clickChangeCommonAddr("company") }} className="iconfont icon-dituzhaofang"></i>}
                                    >{this.state.companyAddressIndex > 0 ? this.state.commonAddress[this.state.companyAddressIndex].long_lat_address : '请选择公司地址'}</List.Item>
                                </List>
                                <WhiteSpace size="lg" />
                                <p className="title">常用地址列表：</p>
                                <List className="history-list common-addr-list">
                                    {
                                        this.state.commonAddress.map((value, index) => (
                                            <List.Item
                                                key={value.id}
                                                thumb={<i className="iconfont icon-dingwei"></i>}
                                                extra={<i onClick={(e) => { this.clickDeleteCommonAddr(e, value.id, value.long_lat_address) }} className="iconfont icon-shanchu"></i>}
                                            // onClick={() => { this.clickHistoryAddress(value) }}
                                            >{value.long_lat_address}</List.Item>
                                        ))
                                    }
                                </List>
                            </div>
                        </div>
                    </div>
                }
            </Motion>
        )
    }

}