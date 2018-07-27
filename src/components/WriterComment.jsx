import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Button, TextareaItem, ImagePicker, InputItem } from 'antd-mobile';

export default class WriterComment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '', //设计师ID
            navBarTitle: "",
            score: 0,
            commentText: "",
            commentCount: 0, //输入框还差多少个字
            showCommentLackCount: true, //显示输入框还差多少个字的提示
            scoreTextArray: ["", "不满意", "不满意", "满意", "非常满意", "非常满意"], //评论的汉字
            imgFiles: [],
            imgUploadIds:'', // 图片上传成功后的id
            isStartPublish: false, //当用户点击发表时，先上传图片，图片全部上传成功后拿到了图片ID，再发表整个评论
            isRefresh: false, //发表需要过程，需要弹窗等待一会
            cost: "" //消费金额
        }
        this.handleUploadImage = (res) => {
            console.log(this.state.imgUploadIds);
            if (res.success) {
                this.setState({
                    imgUploadIds: this.state.imgUploadIds + '_' + res.data.id
                },()=>{
                    let { imgFiles, imgUploadIds } = this.state;
                    let UploadcompleteCount = imgUploadIds.split('_').length - 1;
                    if (imgFiles.length <= UploadcompleteCount) {
                        Toast.hide();
                        this.ajaxAddComment();
                    } else {
                        this.ajaxUploadImage(imgFiles[UploadcompleteCount].url);
                    }
                })
            } else {
                Toast.hide();
                Toast.fail(res.message, 1);
            }
        }
        this.handleAddComment = (res) => {
            console.log(res);
            if (res.success) {
                Toast.success('发表成功', 1,()=>{
                    hashHistory.goBack();
                })
            } else {
                Toast.fail(res.message, 1);
            }
        }
    }
    componentWillMount() {
        // console.log(this.props.designer);
        let location_form = "designerHome";
        if (this.props.location.query && this.props.location.query.form) {
            location_form = this.props.location.query.form;
        }
        if (location_form == "designerHome") {
            if (this.props.designer) {
                let { nick_name, id } = this.props.designer;
                this.setState({
                    navBarTitle: nick_name,
                    id,
                    location_form,
                })
            }
        }
        if (location_form == "WorksDetails") {
            let id = 0;
            let title = 0;
            if (this.props.location.query && this.props.location.query.id && this.props.location.query.title) {
                id = this.props.location.query.id;
                title = this.props.location.query.title;
            }
            this.setState({
                navBarTitle: title,
                id,
                location_form,
            })

        }
        
    }
    componentDidMount() {
        let imagePickerUploadBtn = document.getElementsByClassName("am-image-picker-upload-btn")[0];
        if (imagePickerUploadBtn) {
            let elemt = document.createElement("span");
            elemt.innerHTML="上传照片";
            let oldspan = document.querySelector(".am-image-picker-upload-btn span");
            if (oldspan) {
                imagePickerUploadBtn.removeChild(oldspan);
            }
            imagePickerUploadBtn.appendChild(elemt);
        }
    }
    componentDidUpdate() {
        let imagePickerUploadBtn = document.getElementsByClassName("am-image-picker-upload-btn")[0];
        if (imagePickerUploadBtn) {
            let elemt = document.createElement("span");
            elemt.innerHTML = "上传照片";
            let oldspan = document.querySelector(".am-image-picker-upload-btn span");
            if (oldspan) {
                imagePickerUploadBtn.removeChild(oldspan);
            }
            imagePickerUploadBtn.appendChild(elemt);
        }
    }
    //点击发表
    onClickPublish = () => {
        let { score, commentText, imgFiles  } = this.state;
        if (this.testScore(score) && this.testComment(commentText) ) {
            if (imgFiles.length) {
                //有图片
                Toast.loading('上传图片...', 6);
                // for (const img of imgFiles) {
                //     this.ajaxUploadImage(img.url); //一个循环同时上传，开销太大，换成异步的
                // }
                this.ajaxUploadImage(imgFiles[0].url);
            } else {
                //没图片
                this.ajaxAddComment();
            }   
        }
    }
    testComment(val) {
        if (!val.trim()) {
            Toast.info("请输入评价内容！", 1);
            return false;
        } else {
            return true;
        }
    }
    testScore(val) {
        if (!val) {
            Toast.info("请选择评分！", 1);
            return false;
        } else {
            return true;
        }
    }
    //发表对设计师的评论
    ajaxAddComment = () => {
        let { id, commentText, score, imgUploadIds, location_form, cost } = this.state;
        let type = "user";
        if (location_form == "WorksDetails") {
            type = "works";
        }
        runPromise("add_comment", {
            user_id: validate.getCookie('user_id'), //评论人的id
            type,               //works=作品；project=需求;news=文章;circle=帖子;
            user_id_to: id,     //发布文章人的id
            article_id: id,          //文章id
            content: commentText,   //评论内容
            appraise_score: score,   //评论评分
            appendixs: imgUploadIds,   //图片内容
            remark: cost,
        }, this.handleAddComment, true, "post");
    }
    handleChangeTextarea(val) {
        let commentLength = val.trim().replace(/\s+/g, "").length;
        let showCommentLackCount = commentLength < 30 ? true : false;
        this.setState({ 
            commentText: val,
            commentCount: commentLength,
            showCommentLackCount: showCommentLackCount,
         })

    }
    handleScore(key) {
        this.setState({
            score: key
        })
    }
    handleChangeImg = (files, type, index) => {
        console.log(files, type, index);
        this.setState({
            imgFiles: files
        });
        // if (files.length) {
        //     let url = files[files.length - 1].url;
        //     this.ajaxUploadImage(url);
        // }
    }
    //上传图片
    ajaxUploadImage = (url) => {
        //发送ajax,上传图片
        runPromise("upload_image_byw_upy2", {
            arr: url,
        }, this.handleUploadImage);   
    }
    render() {
        return (
            <div key="1" className="writer-comment">
                <NavBar
                    className="NewNavBar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                    rightContent={<Button className="publishButton" onClick={this.onClickPublish}>发表</Button>}
                >{this.state.navBarTitle}</NavBar>
                <div className="textarea-box  clearfix">
                    <div className="score-box">
                        <span className="left">总体</span>
                        <i onTouchStart={() => { this.handleScore(1) }} className={this.state.score > 0 ? "iconfont icon-xingji active" : "iconfont icon-xingji"} />
                        <i onTouchStart={() => { this.handleScore(2) }} className={this.state.score > 1 ? "iconfont icon-xingji active" : "iconfont icon-xingji"} />
                        <i onTouchStart={() => { this.handleScore(3) }} className={this.state.score > 2 ? "iconfont icon-xingji active" : "iconfont icon-xingji"} />
                        <i onTouchStart={() => { this.handleScore(4) }} className={this.state.score > 3 ? "iconfont icon-xingji active" : "iconfont icon-xingji"} />
                        <i onTouchStart={() => { this.handleScore(5) }} className={this.state.score > 4 ? "iconfont icon-xingji active" : "iconfont icon-xingji"} />
                        <span className="right">{this.state.scoreTextArray[this.state.score]}</span>
                    </div>
                    <TextareaItem
                        placeholder="您的评价对其他会员都是很重要的参考"
                        rows="9"
                        value={this.state.commentText}
                        onChange={(val) => { this.handleChangeTextarea(val) }}
                    />
                    <span style={{ "visibility": this.state.showCommentLackCount ? "visible" : "hidden" }} className="textarea-count-box">加油，还差<span>{ 30 - this.state.commentCount}</span>个字!</span>
                </div>
                <div className="imagePicker-box">
                    <ImagePicker
                        files={this.state.imgFiles}
                        onChange={this.handleChangeImg}
                        selectable={this.state.imgFiles.length < 5}
                        multiple={true}
                    />
                </div>
                <InputItem
                    className="cost"
                    type="number"
                    placeholder="请输入消费金额"
                    value={this.state.cost}
                    onChange= {(val) => { this.setState({cost: val}) }}
                ><span className="text">费用</span><span className="icon">￥</span></InputItem>
            </div>
        )
    }
}

WriterComment.contextTypes = {
    router: React.PropTypes.object
};