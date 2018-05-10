import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, WhiteSpace, InputItem, List, Modal} from "antd-mobile";

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
            lon: "", //经度
            lat: "", //纬度
            currentLocation: "", //定位当前位置的地址
            searchInCity_results: [], //搜索
            searchInCity_pageIndex: 1, //搜索的结果的当前页数索引
            searchInCity_totalPage: 0, //搜索的结果的总页数
            historyAddress: localStorage.getItem('historyAddress') ? JSON.parse(localStorage.getItem('historyAddress')) : [], //历史位置，用户输入地址，或者定位当前位置后都会新增一条，点击某条地址后跳到最前面，最多保存10条地址
        }
        this.bMap = window.bMap || null ;
    }
    componentWillMount() {
        let HOCAddressPage = 'Address';
        let query = this.props.location.query;
        if (query && query.form) {
            HOCAddressPage = query.form;
        }
        let { city, lon, lat, address, currentLocation } = this.props.state[HOCAddressPage];
        this.setState({
            address,
            city,
            lon,
            lat,
            currentLocation,
        })
    }
    componentWillReceiveProps(nextProps) {
        let HOCAddressPage = 'Address';
        let query = this.props.location.query;
        if (query && query.form) {
            HOCAddressPage = query.form;
        }
        let { city, lon, lat, address, currentLocation } = nextProps.state[HOCAddressPage];
        this.setState({
            address,
            city,
            lon,
            lat,
            currentLocation,
        })
    }
    //点击定位当前位置
    locateNowAddress = () => {
        console.log("定位当前位置")
        this.getLocation();
    }
    //输入地址，
    onChangeAddr = (value) => {
        console.log(value);
        if (value) {
            this.searchInCity(value);
        } else {
            this.setState({
                searchInCity_results: [], //搜索
                searchInCity_pageIndex: 1, //搜索的结果的当前页数索引
                searchInCity_totalPage: 0, //搜索的结果的总页数
            })
        }
    }
    //选择地图上选点
    selectMapAddr = (e) => {
        console.log("选择地图上选点"); 

        let HOCAddressPage = 'Address';
        let query = this.props.location.query;
        if (query && query.form) {
            HOCAddressPage = query.form;
        }
        console.log("this.bMap start");
        
        if (this.bMap) {
            console.log("this.bMap end");
            hashHistory.push({
                pathname: '/baiduMap',
                query: { form: HOCAddressPage }
            });
        } else {
            Toast.info("请在手机上打开",1);
        }
        
    }
    //点击百度地图搜索出来的位置
    onClickSelectAddr = (value) => {
        console.log("点击百度地图搜索出来的位置");
        let { lon, lat, address, name, uid, city } = value;
        // this.props.propsSetState('Address', {
        //     city,
        //     address,
        //     lon, //经度
        //     lat, //纬度
        //     currentLocation: name,
        // });
        this.setState({
            searchInCity_results: [], //搜索
            searchInCity_pageIndex: 1, //搜索的结果的当前页数索引
            searchInCity_totalPage: 0, //搜索的结果的总页数
        })
        
        //保存到历史记录里去
        this.addHistoryAddress({
            uid,
            city,
            address,
            lon, //经度
            lat, //纬度
            currentLocation: name,
        })
        this.updateHOCAddress(city, address, lon, lat, name);        
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
                // this.setState({
                //     city,
                //     address,
                //     lon: lon, //经度
                //     lat: lat, //纬度
                //     currentLocation: streetName + sematicDescription,
                // })
                // this.props.propsSetState('Address',{
                //     city,
                //     address,
                //     lon, //经度
                //     lat, //纬度
                //     currentLocation: streetName + sematicDescription,
                // })
                //会话存储保存地址信息
                // sessionStorage.setItem("city", city);
                // sessionStorage.setItem("titleAddr", district + streetName );
                // sessionStorage.setItem("longitude", lon); //经度
                // sessionStorage.setItem("latitude", lat);  //纬度
                
                //保存到历史记录里去
                this.addHistoryAddress({
                    city,
                    address,
                    lon, //经度
                    lat, //纬度
                    currentLocation: streetName + sematicDescription,
                    uid: lon + lat, //历史记录是列表，必须得有UID
                })
                
                //关闭正在定位中的提示
                Toast.hide();
                this.updateHOCAddress(city, address, lon, lat, streetName + sematicDescription); 
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
    //以下是历史位置的处理。
    //添加一个位置
    addHistoryAddress = (value) => {
        let oldHistoryAddress = this.state.historyAddress;
        oldHistoryAddress.forEach((element, index) => {
            if (element.uid == value.uid) {
                oldHistoryAddress.splice(index,1); // 如果已经存在，删除一个元素
            }
        });
        oldHistoryAddress.unshift(value);
        if (oldHistoryAddress.length >10) {
            oldHistoryAddress.length = 10;
        }
        this.setState({
            historyAddress: oldHistoryAddress
        });
        localStorage.setItem('historyAddress', JSON.stringify(oldHistoryAddress));
    }
    //点击历史地址
    clickHistoryAddress = (value) => {
        console.log("点击历史地址");
        this.addHistoryAddress(value);
        //传递地址信息到高阶组件
        let { address, lon, lat, currentLocation, city} = value;
        // this.props.propsSetState('Address', {
        //     city,
        //     address,
        //     lon, //经度
        //     lat, //纬度
        //     currentLocation,
        // });
        this.updateHOCAddress(city, address, lon, lat, currentLocation); 
    }
    //点击删除某个常用地址
    clickDeleteHistoryAddr = (e, uid, value) => {
        e.stopPropagation(); //阻止事件冒泡
        Modal.alert('删除地址?', value, [
            { text: '取消', onPress: () => {}, style: 'default' },
            { text: '确定', onPress: () => this.deleteHistoryAddr(uid) },
        ]);
    }
    //删除某个常用地址
    deleteHistoryAddr = (uid) => {
        console.log("点击删除某个历史地址");

        let oldHistoryAddress = this.state.historyAddress;
        oldHistoryAddress.forEach((element, index) => {
            if (element.uid == uid) {
                oldHistoryAddress.splice(index, 1); // 如果已经存在，删除一个元素
            }
        });
        this.setState({
            historyAddress: oldHistoryAddress
        });
        localStorage.setItem('historyAddress', JSON.stringify(oldHistoryAddress));
    }
    // shouldComponentUpdate() {
    //     return this.props.router.location.action === 'POP';
    // }
    updateHOCAddress = (city, address, lon, lat, currentLocation ) => {
        let HOCAddressPage = 'Address';
        let query = this.props.location.query;
        if (query && query.form) {
            HOCAddressPage = query.form;
        }
        this.props.propsSetState(HOCAddressPage, {
            city,
            address,
            lon, //经度
            lat, //纬度
            currentLocation,
        });
        hashHistory.goBack(); //选好地址后回到上一页
    }
    render() {
        console.log("render Address")
        return (
            <div className="select-address" key="1">
                <NavBar
                    className="new-nav-bar address-nav-bar"
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
                ><span><i className="iconfont icon-zhongxindingwei"></i>{this.state.address ? this.state.address : '定位当前地址' }</span></List.Item>
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
                                key={value.uid}
                                multipleLine
                                thumb={<i className="iconfont icon-dingwei"></i>}
                                onClick={() => { this.onClickSelectAddr(value) }}
                            >
                                {value.name}
                                <List.Item.Brief>{value.address}</List.Item.Brief>
                            </List.Item>
                        ))
                }
                </List>
                <div className="history more-address-box" style={{ "display": this.state.searchInCity_totalPage ? "none" : "block" }}>
                    <p
                        className="title-p"
                        style={{ "display": this.state.historyAddress.length > 0 ? "block" : "none" }}
                    >历史位置</p>
                    <List className="history-list">
                        {/* <List.Item
                            thumb={<i className="iconfont icon-dingwei"></i>}
                            extra={<i onClick={this.deleteHistoryAddr} className="iconfont icon-shanchu"></i>}
                            onClick={this.clickHistoryAddress}
                        >杭州市西湖区</List.Item> */}
                        
                        {
                            this.state.historyAddress.map((value, index) => (
                                <List.Item
                                    thumb={<i className="iconfont icon-dingwei"></i>}
                                    extra={<i onClick={(e) => { this.clickDeleteHistoryAddr(e, value.uid, value.currentLocation) }} className="iconfont icon-shanchu"></i>}
                                    onClick={() => { this.clickHistoryAddress(value) }}
                                >{value.address}</List.Item>
                            ))
                        }
                    </List>
                </div>
            </div>
        )
    }
}