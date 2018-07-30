import React from 'react'
import { hashHistory } from 'react-router'
import { NavBar, ImagePicker, List, Icon, TextareaItem, WingBlank, Modal,Button,Toast,ActivityIndicator} from 'antd-mobile'
import { Line, Jiange } from './templateHomeCircle';
import { Motion, spring } from 'react-motion';

import PhotoSwipeItem from './photoSwipeElement.jsx';
import '../js/photoswipe/photoswipe.css';
import '../js/photoswipe/default-skin/default-skin.css';
import PhotoSwipe from '../js/photoswipe/photoswipe.min.js';
import PhotoSwipeUI_Default from '../js/photoswipe/photoswipe-ui-default.min.js';

const Item = List.Item;
const Brief = Item.Brief;
let size = [];
let arrIds = [];
let openPhotoSwipe = function (items, index) {
    let pswpElement = document.querySelectorAll('.pswp')[0];
    let options = {
        index: index,
        showAnimationDuration: 100,
        hideAnimationDuration: 100
    }
    let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
}
export default class CreatNeed extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            modal1:false,
            content:"",
            files: [],
            price:"",
            ids:[],
            needTitle:"",
            Address: {
                address: "",
                city: "",
                lon: "",
                lat: "",
                currentLocation: "",
            },
            isUploadIng: false, //图片是否在上传中，这个状态用于显示加载中的弹窗
        }
        this.handleBackPicSrc = (res) => {
            let tmpArrIds = this.state.ids;
            tmpArrIds.push(res.data.id);
            this.setState({
                ids: tmpArrIds
            })
        }
        this.handleSendNeedMsg = (res) => {
            console.log(res);
            if(res.success) {
                Toast.info('需求发送成功,等待相关人员审核', 2, ()=>{hashHistory.push({pathname:"/"})}, false);
            }else{
                Toast.info(res.message, 2, null, false);
            }
        }
        this.props.router.setRouteLeaveHook(
			this.props.route,
			this.routerWillLeave
		)
    }
    getHOCAddress(props) {
        if (props.state.AddressNeed && props.state.AddressNeed.address.length > 0) {
            this.setState({
                Address: props.state.AddressNeed
            })
        } else if (props.state.Address && props.state.Address.address.length > 0) {
            this.setState({
                Address: props.state.Address
            })
        }
    }
    getHOCData(props) {
        if (props.state.CreatNeed && Object.getOwnPropertyNames(props.state.CreatNeed).length > 0) {
            this.setState({ ...props.state.CreatNeed })
        }
    }
    componentDidMount(){
        // this.autoFocusInst.focus(); //暂时去掉这个自动聚焦功能吧
        this.setState({ categoryId: this.props.location.query.categoryId })
        this.getHOCAddress(this.props);
        this.getHOCData(this.props);
    }
    componentWillReceiveProps(nextProps) {
		this.getHOCAddress(nextProps);
		this.getHOCData(nextProps);
	}
    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    }
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }
    onSelectPic = (files, type, index) => {
        let img,item;
        if (files.length > 0) {
            img = new Image();
            item = {};
        }
        if (type == 'remove') {
            this.state.ids.splice(index, 1);
            this.state.files.splice(index, 1);
            size.splice(index, 1);
            this.setState({
                files,
                modal1: false
            });
        } else {
            img.src = files[files.length - 1].url;
            img.onload = function (argument) {
                item.w = this.width;
                item.h = this.height;
            }
            size.push(item);
            runPromise('upload_image_byw_upy2', {
                "arr": files[files.length - 1].url
            }, this.handleBackPicSrc, false, "post");
            this.setState({
                files,
                modal1: false
            });
        }
    };

    onChange2 = (files, type, index) => {       
        let img, item;
        if (files.length > 0) {
            img = new Image();
            item = {};
        }
        if (type == 'remove') {
            size.splice(index, 1);

            let ids = this.state.ids;
            ids.splice(index, 1);
            this.setState({
                files,
                ids,
            });
        } else {
            Toast.loading("上传图片...", 6)
            img.src = files[files.length - 1].url;
            img.onload = function (argument) {
                item.w = this.width;
                item.h = this.height;
            }
            size.push(item);
            runPromise('upload_image_byw_upy2', {
                "arr": files[files.length - 1].url
            }, this.handleBackPicSrc, false, "post");
            this.setState({
                files,
            });
        }
    }

    onTouchImg = (index) => {
        let items = [];
        let resultFile = this.state.files;
        resultFile.map((value,idx) => {
            let item = {};
            item.w = size[idx].w;
            item.h = size[idx].h;
            item.src = value.url;
            items.push(item);
        })
        openPhotoSwipe(items, index);
    }
    checkNeedMsg=()=>{
        if (!this.state.content.trim()) {
            Toast.info('请输入需求描述', 2, null, false);
        }else if (!this.state.needTitle.trim()) {
            Toast.info('请输入需求标题', 2, null, false);
        } else if (this.state.price == ""){
            Toast.info('请选择需求预算', 2, null, false);
        } else if (!this.props.state.Address.address.trim()) {
            Toast.info('请选择地址', 2, null, false);
        }else{
            this.sendNeedMsg();
        }
    }
    sendNeedMsg = () => {
        let { address, city, lon, lat, currentLocation } = this.state.Address;
        runPromise('add_project', {
            user_id: validate.getCookie('user_id'),         //用户id
            direction: this.state.needTitle,                //标题(字符串)
            batch_path_ids: this.state.ids.join("_"),       //附件id（_id_id_id）
            content: this.state.content,                   //需求描述（字符串）
            budget_price_str: this.state.price,            //预算（限制只能输入数字）
            // longitude: this.props.state.Address.lon,
            // latitude: this.props.state.Address.lat,
            // long_lat_address: this.props.state.Address.address,     //地址（字符串）
            longitude: lon,
            latitude: lat,
            long_lat_address: currentLocation,
            auth_user_id: "",
            project_id: ""
        }, this.handleSendNeedMsg, false, "post");
    }
    clickSelectAddress = () => {
        // hashHistory.push({
        //     pathname: '/address',
        //     query: { form: 'AddressNeed' },
        // });
        let { content, files, price, ids, needTitle } = this.state;
        this.props.propsSetState("CreatNeed", { content, files, price, ids, needTitle },() => {
			hashHistory.push({
				pathname: '/address',
				query: {
					form: 'AddressNeed'
				}
			});
		});
    }
    routerWillLeave = (nextLocation) => {
        let { pathname } = nextLocation;
		if (pathname != "/address") {
			this.props.setState({ CreatNeed: {}})
		}
    }
    onClickUploadBtn = (e) => {
        e.preventDefault();
        this.apiGetPicture();
    }
    apiGetPicture() {
        if (!window.api) {
            return;
        }
        window.api.getPicture({
            preview: true
        }, (ret, err) => {
            if (ret) {
                this.uploadImages(ret.data);
            } else {
                // alert(JSON.stringify(err));
            }
        });
    }
    uploadImages = (path) => {
        if (!window.api) {
            return;
        }
        window.api.ajax({
            url: 'https://www.huakewang.com/upload/upload_images_for_mobile',
            method: 'POST',
            dataType: 'JSON',
            report: true,
            data: {
                values: {
                    'alt': ''
                },
                files: {
                    Filedata: path
                }
            }
        }, (ret, err) => {
            if (ret.status == "0") {
                //上传中
                // alert(JSON.stringify(ret.progress));
                if (ret.progress > 0 && ret.progress < 100) {
                    this.setState({
                        isUploadIng: true
                    })
                }

            }
            if (ret.status == "1") {
                //上传完成
                // alert(JSON.stringify(ret.body));
                if (ret.body.success) {
                    let { id, file_path } = ret.body.data;
                    this.pushWorksInfo(id, file_path);
                }
                this.setState({
                    isUploadIng: false
                })
            }
            if (ret.status == "2") {
                //上传失败
                // alert(JSON.stringify(ret));
                this.setState({
                    isUploadIng: false
                })
            }
            if (err) {
                //错误
                // alert(JSON.stringify(err));
                this.setState({
                    isUploadIng: false
                })
            }
        })
    }
    //添加作品信息，图片上传后，写入react的状态中
    pushWorksInfo = (id, file_path) => {
        let { ids, files } = this.state;

        ids.push(id);
        let oneFile = Object.create(null);
        oneFile.url = file_path;
        files.push(oneFile);

        let item = Object.create(null);

        let img = new Image();
        img.src = file_path;
        img.onload = function () {
            item.w = this.width;
            item.h = this.height;
        }
        size.push(item);

        this.setState({
            ids,
            files,
        })
    }
    render(){
        return (
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div className="needWrap"  style={{ ...interpolatingStyle, position: "relative" }}>
                        <div className="forgetNav" key="1">
                            <NavBar
                                mode="light"
                                icon={<Icon type="left" size="lg" color="#707070" />}
                                onLeftClick={() => hashHistory.goBack()}
                                rightContent={
                                    <span onClick={(e) => { this.checkNeedMsg()}}>确定</span>
                                }
                            >发布需求</NavBar>
                        </div>
                        <div style={{ height: "1.2rem" }}></div>
                        <ActivityIndicator
                            toast
                            text="上传图片中..."
                            animating={this.state.isUploadIng}
                        />
                        <div className="needDes" style={{paddingRight:"12px"}}>
                            <TextareaItem
                                placeholder="请填写您的需求..."
                                ref={el => this.autoFocusInst = el}
                                autoHeight
                                rows={5}
                                count={200}
                                value={this.state.content}
                                onChange={(value) => { this.setState({ content: value });}}
                            />
                        </div>
                        <div className="needPics">
                            <WingBlank>
                                <ImagePicker
                                    files={this.state.files}
                                    onChange={this.onChange2}
                                    onImageClick={(index, fs) => this.onTouchImg(index)}
                                    selectable={this.state.files.length < 9}
                                    accept="image/gif,image/jpeg,image/jpg,image/png"
                                    multiple={true}
                                    onAddImageClick={this.onClickUploadBtn}
                                />
                            </WingBlank>
                        </div>
                        <div className="needLists">
                            <List>
                                <Line border="line"></Line>
                                <Item
                                    onClick={this.clickSelectAddress }
                                    arrow="horizontal"
                                    // extra={this.props.state.AddressNeed ? (this.props.state.AddressNeed.currentLocation ? this.props.state.AddressNeed.currentLocation : '未定位') : '未定位' }
                                    extra={this.state.Address.address ? this.state.Address.address : "未定位"}
                                >地点</Item>
                                {/* <Line border="line"></Line>
                                <Jiange name="jianGe"></Jiange>
                                <Line border="line"></Line>
                                <Item
                                    onClick={() => { hashHistory.push({ pathname:"/category"}) }}
                                    arrow="horizontal"
                                    extra={this.props.location.query.category}
                                >领域</Item> */}
                                <Line border="line"></Line>
                                <Jiange name="jianGe"></Jiange>
                                <Line border="line"></Line>
                                <Item
                                    arrow="horizontal"
                                    extra={<input className="needTitle" type="text" 
                                        value={this.state.needTitle} 
                                        onChange={(e) => { this.setState({ needTitle: e.currentTarget.value }) }} />}
                                >标题</Item>
                                <Line border="line"></Line>
                                <Jiange name="jianGe"></Jiange>
                                <Line border="line"></Line>
                                <Item
                                    extra={this.state.price}
                                    onClick={this.showModal('modal1')}
                                    arrow="horizontal"
                                >预算</Item>
                                <Line border="line"></Line>
                            </List>
                        </div>
                        <Modal
                            visible={this.state.modal1}
                            transparent
                            maskClosable={false}
                            onClose={this.onClose('modal1')}
                            title={<p>选择您的预算 <i className="iconfont icon-chuyidong1-copy fn-right" onClick={(e) => { 
                                this.onClose('modal1')(e)}}></i>
                            </p>}
                            className="modalNeedPrice"
                        >
                            <ul className="needPriceLists">
                                <Line border="line"></Line>
                                <li onClick={(e)=>{this.setState({ price: e.currentTarget.innerHTML});this.onClose('modal1')();}}>当面商谈</li>
                                <Line border="line"></Line>
                                <li onClick={(e)=>{this.setState({price:e.currentTarget.innerHTML});this.onClose('modal1')()}}>一万元以内</li>
                                <Line border="line"></Line>
                                <li onClick={(e)=>{this.setState({price:e.currentTarget.innerHTML});this.onClose('modal1')()}}>五万元以内</li>
                                <Line border="line"></Line>
                                <li onClick={(e)=>{this.setState({price:e.currentTarget.innerHTML});this.onClose('modal1')()}}>十万以内</li>
                                <Line border="line"></Line>
                                <li onClick={(e)=>{this.setState({price:e.currentTarget.innerHTML});this.onClose('modal1')()}}>十五万以内</li>
                                <Line border="line"></Line>
                            </ul>
                        </Modal>
                        <PhotoSwipeItem />
                    </div>
                }
            </Motion>
        )
    }
}