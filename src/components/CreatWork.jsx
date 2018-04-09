import React from 'react'
import { hashHistory } from 'react-router'
import { NavBar, ImagePicker, List, Icon, TextareaItem, WingBlank,Toast} from 'antd-mobile'
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
export default class CreatWork extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            modal1:false,
            content:"",
            files: [],
            price:"",
            ids:[],
            urls:[],
            needTitle:""
        }
        this.handleBackPicSrc = (res) => {
            let tmpArrIds = this.state.ids;
            let tmpArrUrls = this.state.urls;
            tmpArrIds.push(res.data.id);
            tmpArrUrls.push(res.data.path);
            this.setState({
                ids: tmpArrIds,
                urls: tmpArrUrls
            })
            this.props.setState({
                ids: tmpArrIds,
                urls: tmpArrUrls
            })
        }
        this.handleSendNeedMsg = (res) => {
            if(res.success){
                this.props.setState({
                    fcategoryId: "",
                    categoryId: "",
                    needTitle: "",
                    category: "",
                    content: "",
                    price: "",
                    files: [],
                    urls: [],
                    ids: [],
                })
                Toast.info("作品发送成功，等待相关人员审核", 2, () => { hashHistory.push({ pathname: "/" })}, false);
            }else{
                Toast.info(res.message, 2, null, false);
            }
        }
        this.handleGetKeyword=(res)=>{
            if(res.success){
                this.props.setState({ price: res.data.keycode})
            }else{
                console.log(res);
            }
        }
    }
    componentDidMount(){
        this.autoFocusInst.focus();
        this.setState({ categoryId: this.props.location.query.categoryId })
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
            this.props.setState({files})
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
            this.props.setState({ files })
        }
    };

    onTouchImg = (index) => {
        console.log(size);
        let items = [];
        let resultFile =this.props.state.files;
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
        if (!this.props.state.content.trim()) {
            Toast.info('请输入作品描述', 2, null, false);
        }else if (!this.props.state.needTitle.trim()) {
            Toast.info('请输入作品标题', 2, null, false);
        } else if (this.props.state.category.trim() == ""){
            Toast.info('请选择作品类别', 2, null, false);
        } else if (!this.props.state.price.trim()) {
            Toast.info('请填写关键词', 2, null, false);
        }else{
            this.sendNeedMsg();
        }
    }
    sendNeedMsg = () => {
        runPromise('add_works_ex', {
            title: this.props.state.needTitle,
            content: this.props.state.content,
            batch_path_ids: this.props.state.ids,
            batch_video_urls: [],
            keyword: this.props.state.price,
            category_ids_1: 148,  //类别
            category_ids_2: this.props.state.fcategoryId,
            category_ids_3: this.props.state.categoryId,
            path: this.props.state.urls[this.props.state.urls.length-1],       //封面
            image_upload_way: 2,
            user_id: validate.getCookie('user_id')
        }, this.handleSendNeedMsg, false, "post");
    }
    getkeywords = () => {
        runPromise('getKeycode', {
            title: this.props.state.needTitle,
        }, this.handleGetKeyword, false, "post");
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
                    >发布作品</NavBar>
                </div>
                <div style={{ height: "1.2rem" }}></div>
                <div className="needDes" style={{paddingRight:"12px"}}>
                    <TextareaItem
                        placeholder="请填写作品描述..."
                        ref={el => this.autoFocusInst = el}
                        autoHeight
                        rows={5}
                        count={200}
                        value={this.props.state.content}
                        onChange={(value) => { this.setState({ content: value }), this.props.setState({ content: value}) }}
                    />
                </div>
                <div className="needPics">
                    <WingBlank>
                        <ImagePicker
                            files={this.props.state.files}
                            onChange={this.onSelectPic}
                            onImageClick={(index, fs) => this.onTouchImg(index)}
                            selectable={this.props.state.files.length < 20}
                            accept="image/gif,image/jpeg,image/jpg,image/png"
                            multiple={true}
                        />
                    </WingBlank>
                </div>
                <div className="needLists">
                    <List>
                        <Line border="line"></Line>
                        <Item
                            arrow="horizontal"
                            extra={<input className="needTitle" type="text"
                                value={this.props.state.needTitle}
                                onBlur={() => { this.getkeywords()}}
                                onChange={(e) => { 
                                    this.setState({ needTitle: e.currentTarget.value })
                                    this.props.setState({ needTitle: e.currentTarget.value }) 
                                }}/>}
                        >标题</Item>
                        <Line border="line"></Line>
                        <Jiange name="jianGe"></Jiange>
                        <Line border="line"></Line>
                        <Item
                            onClick={() => { hashHistory.push({pathname:'/category'}) }}
                            arrow="horizontal"
                            extra={this.props.state.category}
                        >类别</Item>
                        <Line border="line"></Line>
                        <Jiange name="jianGe"></Jiange>
                        <Line border="line"></Line>
                        <Item
                            arrow="horizontal"
                            extra={<input className="needTitle" type="text"
                                value={this.props.state.price}
                                placeholder="请用英文逗号隔开"
                                onChange={(e) => { 
                                    this.setState({ price: e.currentTarget.value });
                                    this.props.setState({ price: e.currentTarget.value }); }} />}
                        >关键词</Item>
                        <Line border="line"></Line>
                    </List>
                </div>
                <PhotoSwipeItem />
            </div>
        )
    }
}