import React from 'react'
import { hashHistory } from 'react-router'
import { NavBar, ImagePicker, List, Icon, TextareaItem, WingBlank, Modal,Button,Toast} from 'antd-mobile'
import { Line, Jiange } from './templateHomeCircle';

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
            needTitle:""
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
    }
    componentDidMount(){
        this.autoFocusInst.focus();
        this.setState({ categoryId: this.props.location.query.categoryId })
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
        runPromise('add_project', {
            user_id: validate.getCookie('user_id'),         //用户id
            direction: this.state.needTitle,                //标题(字符串)
            batch_path_ids: this.state.ids.join("_"),       //附件id（_id_id_id）
            content: this.state.content,                   //需求描述（字符串）
            budget_price_str: this.state.price,            //预算（限制只能输入数字）
            longitude: this.props.state.Address.lon,
            latitude: this.props.state.Address.lat,
            long_lat_address: this.props.state.Address.address,     //地址（字符串）
            auth_user_id: "",
            project_id: ""
        }, this.handleSendNeedMsg, false, "post");
    }
    clickSelectAddress = () => {
        hashHistory.push({
            pathname: '/address',
            query: { form: 'AddressNeed' },
        });
    }
    render(){
        return (
            <div className="needWrap">
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
                            onChange={this.onSelectPic}
                            onImageClick={(index, fs) => this.onTouchImg(index)}
                            selectable={this.state.files.length < 20}
                            accept="image/gif,image/jpeg,image/jpg,image/png"
                            multiple={true}
                        />
                    </WingBlank>
                </div>
                <div className="needLists">
                    <List>
                        <Line border="line"></Line>
                        <Item
                            onClick={this.clickSelectAddress }
                            arrow="horizontal"
                            extra={this.props.state.AddressNeed ? (this.props.state.AddressNeed.currentLocation ? this.props.state.AddressNeed.currentLocation : '未定位') : '未定位' }
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
        )
    }
}