import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, WhiteSpace, InputItem, List} from "antd-mobile";

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

export default class Address extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            address: "",
            city: "", //通过城市列表选择的城市
            currentLocation: "", //定位当前位置的地址
            searchInCity_results: [], //搜索
            searchInCity_pageIndex: 1, //搜索的结果的当前页数索引
            searchInCity_totalPage: 0, //搜索的结果的总页数
        }
        this.bMap = window.bMap || null ;
    }
    //点击定位当前位置
    locateNowAddress = () => {
        console.log("定位当前位置")
        this.getLocation();
    }
    //输入地址，
    onChangeAddr = (value) => {
        console.log(value);
        this.searchInCity(value)
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
    //点击百度地图搜索出来的位置
    onClickSelectAddr = (e) => {
        console.log("点击百度地图搜索出来的位置")
    }
    //以下都是百度地图的相关方法。使用前都得判断百度地图是否存在
    //定位当前位置
    getLocation = () => {
        Toast.loading('定位中...', 3);
        this.bMap.getLocation({
            accuracy: '100m',
            autoStop: true,
            filter: 1
        },  (ret, err) => {
            if (ret.status) {
                this.getNameFromCoords(ret.lon, ret.lat);
            } else {
                Toast.fail(err.msg, 1)
            }
        });
    }
    /**
     * 根据经纬度查找地址信息
     * 
     * @param lon 经度
     * @param lat 纬度
     * @memberof Address
     */
    getNameFromCoords = (lon, lat) => {
        this.bMap.getNameFromCoords({
            lon: lon,
            lat: lat
        }, (ret, err) => {
            if (ret.status) {
                let { city, district, streetName, streetNumber, lon, lat, address, sematicDescription } = ret;
                this.setState({
                    city,
                    address,
                    currentLocation: streetName + sematicDescription
                })
                //会话存储保存地址信息
                sessionStorage.setItem("city", city);
                sessionStorage.setItem("titleAddr", district + streetName );
                sessionStorage.setItem("longitude", lon); //经度
                sessionStorage.setItem("latitude", lat);  //纬度
                //关闭正在定位中的提示
                Toast.hide();
            } else {
                Toast.fail(err.msg, 1)
            }
        });
    }
    //根据单个关键字搜索兴趣点
    searchInCity = (keyword, pageIndex = 0, pageCapacity = 10) => {
        let city = this.state.city ? this.state.city : '北京';
        this.bMap.searchInCity({
            city: city,
            keyword: keyword,
            pageIndex: pageIndex,
            pageCapacity: pageCapacity
        }, (ret, err) => {
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
            if (ret.status) {
                let { totalPage, pageIndex, results } = ret;
                this.setState({
                    searchInCity_results: results, //搜索
                    searchInCity_pageIndex: pageIndex, //搜索的结果的当前页数索引
                    searchInCity_totalPage: totalPage, //搜索的结果的总页数
                })
            } else {
                Toast.fail('未知错误', 1)
            }
        });
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
                    {this.state.currentLocation ? this.state.currentLocation : "定位"}
                </NavBar>
                <WhiteSpace size="lg" />
                <List.Item
                    className="position-current-location"
                    onClick={this.locateNowAddress}
                ><span><i className="iconfont icon-zhongxindingwei"></i>{this.state.currentLocation ? this.state.currentLocation : '定位当前地址' }</span></List.Item>
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
                <List className="select-address-list" >
                {
                    this.state.searchInCity_results.map((value, index)=>(
                            <List.Item
                                multipleLine
                                thumb={<i className="iconfont icon-dingwei"></i>}
                                data-name={value.name}
                                data-lon={value.lon}
                                data-lat={value.lat}
                                onClick={this.onClickSelectAddr}
                            >
                                {value.name}
                                <List.Item.Brief>{value.address}</List.Item.Brief>
                            </List.Item>
                        ))
                }
                </List>
                <div className="history more-address-box" style={{ "display": this.state.searchInCity_totalPage ? "none" : "block" }}>
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