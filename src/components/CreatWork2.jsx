import React from 'react'
import { hashHistory } from 'react-router'
import { NavBar, ImagePicker, List, Icon, TextareaItem, WingBlank, Toast, Modal, InputItem} from 'antd-mobile'
import { Line, Jiange } from './templateHomeCircle';
import { Motion, spring } from 'react-motion';

const Bitmap = require('../images/tempNull2.png');

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
export default class CreatWork2 extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            modal1:false,
            content:"",
            files: [],
            price:"",
            ids:[],
            urls:[],
            needTitle:"",
            location_form: '',
            works_id: '',
        }
        this.handleBackPicSrc = (res) => {
            if (res.success) {
            // let tmpArrIds = this.state.ids;
            // let tmpArrUrls = this.state.urls;
            let tmpArrIds = this.props.state.ids;
            let tmpArrUrls = this.props.state.urls;
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
            
                
            } else {
                Toast.fail('上传图片失败',1);
            }
        }
        this.handleSendNeedMsg = (res) => {
            if(res.success){
                this.ClearHOCPropsData();
                Toast.info("作品发送成功，等待相关人员审核", 2, () => { hashHistory.go(-2)}, false); //只能回退
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
        this.handleGetWorksInfoBySelf = (res) => {
            if (res.success) {
                this.writingWorksInfo(res.data); //写入作品详情的数据，实际上是写在HOC高阶组件上的.
            } else {
                Toast.fail(res.message, 1);
            }
        }
        this.handleChangeWorkInfo = (res) => {
            if (res.success) {
                Toast.success("修改成功，等待客服审核", 2, () => { hashHistory.goBack() }, false);
            } else {
                Toast.fail(res.message, 1);
            }
        }
        this.handleGetMenuClass = (res, param) => {
            if (res.success) {
                let { fcategoryId, categoryId } = param;
                let data = res.data;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id == fcategoryId) {
                        for (let j = 0; j < data[i].subMenuList.length; j++) {
                            if (data[i].subMenuList[j].id == categoryId) {
                                this.props.setState({
                                    category: data[i].subMenuList[j].menu_name,
                                })
                            }
                            
                        }
                        
                    }
                    
                }


            } else {
                Toast.fail(res.message, 1);
            }
        }
    }
    componentWillMount() {
        if (this.props.location.query && this.props.location.query.form) {
            this.setState({ location_form: this.props.location.query.form });
            if (this.props.location.query.form == "UserWorks") {
                this.setState({ works_id: this.props.location.query.works_id });
            }
        }
        let { ids, urls } = this.props.state;
        this.setState({ ids, urls });
    }
    componentWillReceiveProps(nextProps) {
        let { ids, urls } = nextProps.state;
        this.setState({ ids, urls });
    }
    componentDidMount(){
        // this.autoFocusInst.focus(); 不要自动聚焦input，产生其他bug，用处也不大
        this.setState({ categoryId: this.props.location.query.categoryId })

        //如果是修改作品，ajax获取作品信息
        if (this.props.location.query && this.props.location.query.form) {
            if (this.props.location.query.form == "UserWorks" && !this.props.state.needTitle) {
                this.ajaxGetWorksInfoBySelf(this.props.location.query.works_id);
            }
        }
    }
    //获取某个作品的信息，修改作品使用
    ajaxGetWorksInfoBySelf = (works_id) => {
        runPromise("get_works_info_by_self", {
            user_id: validate.getCookie("user_id"),
            works_id,
        }, this.handleGetWorksInfoBySelf, true, "get");
    }
    //写入作品信息
    writingWorksInfo = (data) => {
        let { title, content, keyword, category_ids_arr, attachment_list } = data;

        let fcategoryId = category_ids_arr.length > 4 ? category_ids_arr[2] : 0;
        let categoryId = category_ids_arr.length > 4 ? category_ids_arr[3] : 0;

        if (!this.props.state.category) {
            this.getCategory(fcategoryId, categoryId); //获取类别的文字
        }

        let oldFcategoryId = this.props.state.fcategoryId;
        let oldCategoryId = this.props.state.categoryId;

        //如果HOC有分类，说明可能 是用户手动选择了分类，此时不使用接口的分类
        if (oldFcategoryId) {
            fcategoryId = oldFcategoryId;
        }
        if (oldCategoryId) {
            categoryId = oldCategoryId;
        }

        let ids = [];
        let urls = [];
        let files = [];
        let remoteSize = []; //接口返回的图片宽高

        attachment_list.length > 0 &&
        attachment_list.map((value, index)=>{
            ids.push(value.id);

            urls.push(value.path_thumb);
            let oneFile = Object.create(null);
            oneFile.url = value.path_thumb;
            files.push(oneFile);

            let oneRemoteSize = Object.create(null);
            oneRemoteSize.w = value.width;
            oneRemoteSize.h = value.height;
            remoteSize.push(oneRemoteSize);
        });
        size = remoteSize;

        this.props.setState({
            needTitle: title,
            content: content,
            ids,
            price: keyword,
            fcategoryId,
            categoryId,
            urls,
            // category: "", //此时没拿到标志名称
            files,
        })
    }
    //修改作品信息，重新上传作品
    ajaxChangeWorkInfo = () => {

        runPromise('change_work_info', {
            title: this.props.state.needTitle,
            content: this.props.state.content,
            batch_path_ids: this.props.state.ids,
            batch_video_urls: [],
            keyword: this.props.state.price,
            category_ids_1: 148,  //类别
            category_ids_2: this.props.state.fcategoryId,
            category_ids_3: this.props.state.categoryId,
            // path: this.props.state.urls[this.props.state.urls.length - 1],       //封面
            path: this.props.state.urls[0],       //封面
            image_upload_way: 2,
            user_id: validate.getCookie('user_id'),
            work_id: this.state.works_id, 
        }, this.handleChangeWorkInfo, false, "post");
    }
    //根据类别编号，获得类别的名称，用户在修改作品页显示那个类别字段，为了显示一个字符串发送一个请求~ ~ ~
    getCategory = (fcategoryId, categoryId) => {
        runPromise("get_menu_class", { num: 148 }, this.handleGetMenuClass, false, "get", { fcategoryId, categoryId });
    }
    onSelectPic = (files, type, index) => {
        let img,item;
        if (files.length > 0) {
            img = new Image();
            item = {};
        }
        if (type == 'remove') {
            this.state.ids.splice(index, 1);
            this.state.urls.splice(index, 1);
            // this.state.files.splice(index, 1);
            // this.props.state.ids.splice(index, 1);
            size.splice(index, 1);
            this.setState({
                files,
                ids: this.state.ids,
                urls: this.state.urls,
                modal1: false
            });
            this.props.setState({
                files,
                ids: this.state.ids,
                urls: this.state.urls,
            })
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
        if (!this.props.state.needTitle.trim()) {
            Toast.info('请输入作品名称', 1, null, false);
        } else if (!this.props.state.photoList || !this.props.state.photoList.length > 0) {
            Toast.info('请至少上传一张图片', 1, null, false);
        } else if (!this.props.state.content.trim()) {
            Toast.info('请输入作品描述', 1, null, false);
        } else if (this.props.state.category.trim() == ""){
            Toast.info('请选择创意领域', 1, null, false);
        } else if (!this.props.state.price.trim()) {
            Toast.info('请填写标签', 1, null, false);
        }else{
            this.sendNeedMsg2(); // 发布作品 update
        }
    }
    sendNeedMsg2 = () => {
        let photoList = this.props.state.photoList;
        let path = photoList[0].file_path; //上传封面
        let batch_path_ids = [];
        photoList.map((value, index)=>{
            if (value.id) {
                batch_path_ids.push(value.id);
            }
        });
        runPromise('add_works_ex', {
            title: this.props.state.needTitle,
            content: this.props.state.content,
            batch_path_ids,
            batch_video_urls: [],
            keyword: this.props.state.price,
            category_ids_1: 148,  //类别
            category_ids_2: this.props.state.fcategoryId,
            category_ids_3: this.props.state.categoryId,
            // path: this.props.state.urls[this.props.state.urls.length - 1],       //封面
            path,       //封面
            image_upload_way: 2,
            user_id: validate.getCookie('user_id')
        }, this.handleSendNeedMsg, false, "post");
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
            // path: this.props.state.urls[this.props.state.urls.length - 1],       //封面
            path: this.props.state.urls[0],       //封面
            image_upload_way: 2,
            user_id: validate.getCookie('user_id')
        }, this.handleSendNeedMsg, false, "post");
    }
    getkeywords = () => {
        runPromise('getKeycode', {
            title: this.props.state.needTitle,
        }, this.handleGetKeyword, false, "post");
    }
    //清空HOC高阶组件的数据
    ClearHOCPropsData = () => {
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
            photoList: [],
        })
    }
    //当用户点击返回时，得判断是否清空数据,如果是修改作品，当退出时，必须清空数据
    clickGoBack = () => {
        if (this.state.location_form == "UserWorks") {
            //如果是修改作品，当退出时，必须清空数据
            this.ClearHOCPropsData();
            hashHistory.goBack();
        } else {
            // this.ClearHOCPropsData(); //不管那么多了，直接清除数据吧
            hashHistory.goBack();
            // Modal.alert('作品没保存,是否清空数据?', null, [
            //     { text: '取消', onPress: () => { 
            //         hashHistory.goBack(); 
            //     } },
            //     { text: '确定', onPress: () => {
            //         this.ClearHOCPropsData();
            //         hashHistory.goBack();
            //     } },
            // ])
        }
        
    }
    //当用户开点击创意领域列时，让页面上的所有input失去焦点
    blurInput = () => {
        document.querySelector(".creat-work2 textarea").blur();
        document.querySelector(".creat-work2 input").blur();
    }
    render(){
        return (
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div className="needWrap creat-work2" style={{ ...interpolatingStyle, position: "relative" }}>
                        <div className="forgetNav" key="1">
                            <NavBar
                                mode="light"
                                icon={<Icon type="left" size="lg" color="#707070" />}
                                onLeftClick={this.clickGoBack}
                                leftContent={
                                    <span style={{ "position": "relative", "left": "-0.2rem", "color": "#000", "font-size": "15px"}}>上传图片</span>
                                }
                                rightContent={
                                    <span onClick={(e) => { this.checkNeedMsg()}}>确定</span>
                                }
                            >{this.state.location_form == "UserWorks" ? "修改作品" : "发布作品"}</NavBar>
                        </div>
                        <div style={{ height: "1.2rem" }}></div>
                        <InputItem
                            className="create-work-input-title"
                            placeholder="请输入作品名称"
                            ref={el => this.autoFocusInst = el}
                            value={this.props.state.needTitle}
                            // onBlur={() => { this.getkeywords()}}
                            onChange={(val) => {
                                this.setState({ needTitle: val })
                                this.props.setState({ needTitle: val })
                            }}
                        >
                            <img onClick={this.clickGoBack} src={this.props.state.photoList && this.props.state.photoList.length > 0 ? this.props.state.photoList[0].thumbPath : Bitmap} onError={(e) => { e.target.src = Bitmap }} />
                        </InputItem>
                        <Line border="line"></Line>
                        <div className="needDes" style={{ "padding-right": "12px", "border-bottom":"1px solid #ddd"}}>
                            <TextareaItem
                                placeholder="作品描述"
                                autoHeight
                                rows={2}
                                // count={200}
                                value={this.props.state.content}
                                onChange={(value) => { this.setState({ content: value }), this.props.setState({ content: value}) }}
                            />
                        </div>
                        {/* <div className="needPics">
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
                        </div> */}
                        <Jiange name="jianGe"></Jiange>
                        <div className="needLists">
                            <List>
                                {/* <Line border="line"></Line>
                                <Item
                                    arrow="horizontal"
                                    extra={<input className="needTitle" type="text"
                                        value={this.props.state.needTitle}
                                        // onBlur={() => { this.getkeywords()}}
                                        onChange={(e) => { 
                                            this.setState({ needTitle: e.currentTarget.value })
                                            this.props.setState({ needTitle: e.currentTarget.value }) 
                                        }}/>}
                                >标题</Item> */}
                                <Line border="line"></Line>
                                <Item
                                    className="create-work-item"
                                    onTouchStart={this.blurInput}
                                    onClick={() => { hashHistory.push({pathname:'/category'}) }}
                                    arrow="horizontal"
                                    extra={this.props.state.category}
                                    thumb={<i className="iconfont icon-liebiao"></i>}
                                >选择创意领域</Item>
                                <Line border="line"></Line>
                                <InputItem
                                    className="create-work-item create-work-input-keyword"
                                    placeholder="英文逗号，分隔，标签"
                                    value={this.props.state.price}
                                    // onBlur={() => { this.getkeywords()}}
                                    onChange={(val) => {
                                        this.setState({ price: val })
                                        this.props.setState({ price: val })
                                    }}
                                >
                                    <i className="iconfont icon-biaoqian"></i>
                                </InputItem>
                                {/* <Item
                                    extra={<input className="needTitle" type="text"
                                        value={this.props.state.price}
                                        placeholder="请用英文逗号隔开"
                                        onChange={(e) => { 
                                            this.setState({ price: e.currentTarget.value });
                                            this.props.setState({ price: e.currentTarget.value }); }} />}
                                >关键词</Item> */}
                                <Line border="line"></Line>
                            </List>
                        </div>
                        <PhotoSwipeItem />
                    </div>
                }
            </Motion>
        )
    }
}