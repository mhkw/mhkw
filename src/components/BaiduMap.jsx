/**
 * 这个组件只能在移动端用，使用了API的百度地图组件
 */
import React from 'react';
import { hashHistory } from 'react-router';
import { Toast, NavBar, Icon  } from "antd-mobile";

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

export default class BaiduMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: "",
            city: "",
            currentLocation: "", //定位当前位置显示的地址
            lon: "", //经度
            lat: "", //纬度
        }
        this.bMap = window.bMap || null;
    }

    //返回上一页
    back = () => {
        this.bMap.close();
        this.closeFrame();
        hashHistory.goBack();
    }
    //修改或新增某个常用地址
    ajaxChangeCommonAddr = (address_type, address, currentLocation, longitude, latitude, set_cur_city) => {
        runPromise("change_user_coordinate", {
            user_id: validate.getCookie('user_id'),
            address_type,
            long_lat_address: currentLocation,
            long_lat_address_jd: address,
            longitude,
            latitude,
            is_default: 0,
            set_cur_city,
        }, ()=>{});
    }
    //完成地图选点
    complete = () => {
        console.log(this.state.address);
        //传递给HOC高阶组件
        let { city, address, lon, lat, currentLocation } = this.state;

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
        if (HOCAddressPage == "AddressCommon") {
            //此时选点是用于个人中心新增或修改地址
            let address_type = query.address_type;
            this.ajaxChangeCommonAddr(address_type, address, currentLocation, lon, lat, city);
        } else {
            this.addHistoryAddress(this.state); //添加到历史位置。注意了，此时把整个state都传进去了。
        }
        this.bMap.close(); //关闭地图
        this.closeFrame(); //关闭地图浮动层页面
        hashHistory.goBack();
    }
    //添加一个历史位置
    addHistoryAddress = (value) => {
        if (!value.uid) {
            value.uid = value.lon + value.lat; //不存在UID，就使用经度和纬度替代
        }
        let oldHistoryAddress = localStorage.getItem('historyAddress') ? JSON.parse(localStorage.getItem('historyAddress')) : [] ;
        oldHistoryAddress.forEach((element, index) => {
            if (element.uid == value.uid) {
                oldHistoryAddress.splice(index, 1); // 如果已经存在，删除一个元素
            }
        });
        oldHistoryAddress.unshift(value);
        if (oldHistoryAddress.length > 10) {
            oldHistoryAddress.length = 10;
        }
        localStorage.setItem('historyAddress', JSON.stringify(oldHistoryAddress));
    }
    /**
     * 使用API打开一个Frame页面，这个页面可以悬浮在window页面之上。
     */
    componentDidMount() {
        //判断是不是移动端，不是的话，直接回退
        if ( !window.api ) {
            hashHistory.goBack();
            return;
        }
        //打开地图
        this.open();

        //打开地图位置信息的frame页面
        // this.openFrame();

        //监听地图点击事件
        this.bMapAddEventListener();
    }
    openFrame = () => {
        console.log("打开定位信息的frame");
        window.api.openFrame({
            name:'bmap_info_frm',
            url:'widget://bmap_info_frm.html',
            rect:{
                x:0,
                y:65,
                w:'auto',
                h:30
            },
            bounces:false,
            vScrollBarEnabled:false,
            hScrollBarEnabled:false
        });
    }
    closeFrame = () => {
        console.log("关闭定位信息的frame");
        window.api.closeFrame({
            name: 'bmap_info_frm'
        });
    }
    //以下都是百度地图的相关方法。使用前都得判断百度地图是否存在
    //打开地图
    open = () => {
        this.bMap.open({
            rect: {
                x: 0,
                y: 65,
                w: 'auto',
                h: 'auto'
            },
            // center: {
            //     lon: 116.4021310000,
            //     lat: 39.9994480000
            // },
            zoomLevel: 10,
            showUserLocation: true,
            fixed: true
        }, (ret) => {
            if (ret.status) {
                //获取用户位置坐标
                this.getLocation();

                //打开地图位置信息的frame页面
                this.openFrame();
            }
        });
    }
    //定位当前位置
    getLocation = () => {
        this.bMap.getLocation({
            accuracy: '100m',
            autoStop: true,
            filter: 1
        },  (ret, err) => {
            if (ret.status) {
                let {lon, lat} = ret;
                this.setCenter(lon, lat);
                //
                this.getNameFromCoords(lon, lat);
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
                    lon, //经度
                    lat, //纬度
                    currentLocation: streetName + sematicDescription,
                });
                //有API发布一个事件
                window.api.execScript({
                    frameName:'bmap_info_frm',
                    script:'setInfo("'+address+'")'
                })

            } else {
                Toast.fail(err.msg, 1)
            }
        });
    }
    //设置地图的中心
    setCenter = (lon, lat) => {
        this.bMap.setCenter({
            coords: {
                lon: lon,
                lat: lat
            },
            animation:true
        });
    }
    //给百度地图添加监听事件
    bMapAddEventListener = () =>{
        this.bMap.addEventListener({
            name: 'click'
        }, (ret) => {
            if(ret.status){
                let {lon, lat} = ret;
                //添加或者移动标记
                this.moveAnnotationCoords(lon, lat);

                //根据经纬度查找地址信息,并显示地址信息
                this.getNameFromCoords(lon, lat);

                //移动地图中心到该位置
                this.setCenter(lon, lat);
            }
        });
    }
    /**
     * 移动标注的经纬度
     * 首先要判断是否有一个id=1的标注，如果没有则创建一个，如果有则移动他的位置，即设置它的经纬度
     * 设置完成后，地图应该移动到到标注的中心去，应该有动画吧
     */
    moveAnnotationCoords = (lon, lat) => {
        this.bMap.annotationExist({
            id: 1
        }, (ret) => {
            if (ret.status) {
                this.setAnnotationCoords(lon, lat);
            } else {
                this.addAnnotations(lon, lat);
            }
        });
    }
    //在地图上添加标注信息
    addAnnotations = (lon, lat) => {
        this.bMap.addAnnotations({
            annotations: [{
                id: 1,
                lon: lon,
                lat: lat
            }],
            draggable: false
        });
    }
    //设置某个已添加标注的经纬度
    setAnnotationCoords = (lon, lat) => {
        this.bMap.setAnnotationCoords({
            id: 1,
            lon: lon,
            lat: lat
        });
    }
    render() {
        return (
            <div className="select-map" key="1">
                <NavBar
                    className="new-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={this.back}
                    rightContent={<span className="complete" onClick={this.complete}>选择</span>}
                >定位</NavBar>
            </div>
        )
    }
}