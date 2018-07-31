import React from 'react'
import { hashHistory } from 'react-router'
import { NavBar, ImagePicker, List, Icon, TextareaItem, WingBlank, Modal, Button, Toast, ActivityIndicator} from 'antd-mobile'
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
export default class CreatCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            modal1:false,
            content:"",
            files: [],
            price:"",
            ids:[],
            needTitle:"",
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
                hashHistory.push({pathname:"/circle"})
            }else{
                Toast.info(res.message, 2, null, false);
            }
        }
    }
    componentDidMount(){
        // this.autoFocusInst.focus();
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
            Toast.info('内容不能为空！', 2, null, false);
        }else{
            this.sendNeedMsg();
        }
    }
    sendNeedMsg = () => {
        runPromise('add_circle', {
            batch_path_ids: this.state.ids.join("_"),       //附件id（_id_id_id）
            content: this.state.content,                   //需求描述（字符串）
        }, this.handleSendNeedMsg, false, "post");
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
                            >发布帖子</NavBar>
                        </div>
                        <div style={{ height: "1.2rem" }}></div>
                        <ActivityIndicator
                            toast
                            text="上传图片中..."
                            animating={this.state.isUploadIng}
                        />
                        <div className="cicleCard">
                            <div className="needDes">
                                <TextareaItem
                                    placeholder="请填写帖子内容..."
                                    ref={el => this.autoFocusInst = el}
                                    autoHeight
                                    rows={5}
                                    count={200}
                                    value={this.state.content}
                                    onChange={(value) => { this.setState({ content: value }); }}
                                />
                            </div>
                            <div className="needPics">
                                {/* <WingBlank size="lg" />
                                    <ImagePicker
                                        files={this.state.files}
                                        onChange={this.onSelectPic}
                                        onImageClick={(index, fs) => this.onTouchImg(index)}
                                        selectable={this.state.files.length < 9}
                                        accept="image/gif,image/jpeg,image/jpg,image/png"
                                        multiple={false}
                                    />
                                <ImagePicker
                                    files={this.state.files}
                                    onChange={this.onChange2}
                                    onImageClick={(index, fs) => this.onTouchImg(index)}
                                    selectable={this.state.files.length < 9}
                                    accept="image/gif,image/jpeg,image/jpg,image/png"
                                    multiple={true}
                                    onAddImageClick={this.onClickUploadBtn}
                                />
                                <WingBlank size="lg" /> */}
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
                        </div>
                        <PhotoSwipeItem />
                    </div>
                }
            </Motion>
        )
    }
}