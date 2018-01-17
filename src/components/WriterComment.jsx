import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Button, TextareaItem, ImagePicker, InputItem } from 'antd-mobile';

export default class WriterComment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            navBarTitle: "品牌设计师 Miazhang",
            score: 0,
            commentText: "",
            commentCount: 0, //输入框还差多少个字
            showCommentLackCount: true, //显示输入框还差多少个字的提示
            scoreTextArray: ["", "差！","较差！","一般！","良！","优！"], //评论的汉字
            imgFiles: [],
            cost: "" //消费金额
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
    onClickPublish = () => {
        
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