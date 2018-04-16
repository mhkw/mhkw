import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { Button, NavBar, Icon, Toast } from 'antd-mobile';

import PhotoClip from 'photoclip';

export default class UploadAvatar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            img: {} //上传的图片
        }
        this.convertCanvasToImage = function (canvas) {
            //新Image对象，可以理解为DOM  
            let image = new Image();
            // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持  
            // 指定格式 PNG  
            image.src = canvas.toDataURL("image/png");
            return image.src;
        }
        //发送上传图片完成后的处理函数
        this.handleUploadAvatar = (res) => {
            if (res.success) {
                this.ajaxChangeUserAvatar(res.data.path); //修改用户信息,头像
            } else {
                Toast.hide();
                Toast.fail(res.message, 1);
            }
        } 
        //修改个人基本信息后的执行函数,头像修改成功后,
        this.handleChangeUserAvatar = (res) => {
            if (res.success) {
                Toast.hide();
                Toast.success("上传头像成功", 1, () => {
                    hashHistory.goBack();
                });
            } else {
                Toast.hide();
                Toast.fail(res.message, 1);
            }
        }
    }
    componentWillMount() {
        
        let avatar = this.props.state.UploadAvatar;
        if (avatar && avatar.img) {
            this.setState({ img: avatar.img });
        } else {
            hashHistory.goBack();
        }
    }
    componentDidMount() {
        let self = this;
        let { img } = this.state;
        let AvatarBoxDOM = ReactDOM.findDOMNode(this.refs.img2);
        AvatarBoxDOM.style.height = document.body.clientHeight - 45 + "px";
        let pc = new PhotoClip(AvatarBoxDOM, {
            size: [250, 250],
            outputSize: [500, 500],
            style: {
                maskColor: "rgba(0,0,0,.3)",
                maskBorder: "1px dashed #ddd"
            }
        });
        pc.load(img);
        this.setState({ pc });
    }
    onClickUpload = () => {
        let { pc } = this.state;
        if (pc) {
            let dataURL = pc.clip();
            //发送ajax上传图片
            Toast.loading('上传图片...', 5);
            runPromise("upload_image_byw_upy2", {
                "arr": dataURL
            }, this.handleUploadAvatar);
        }
    }
    //修改用户信息，头像,参数是头像的URL地址
    ajaxChangeUserAvatar = (path) => {
        runPromise('change_user_info', {
            path,
        }, this.handleChangeUserAvatar);
    }
    componentWillUnmount() {
        this.props.propsSetState("UploadAvatar", {
            img: null
        });
    }
    render() {
        return (
            <div key="1" className="upload-avatar-page">
                <NavBar
                    className="new-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                    rightContent={<Button className="rechargeButton" onClick={this.onClickUpload}>使用</Button>}
                ></NavBar>
                <div id="img2" ref="img2" className="cropperAvatarBox"></div>
            </div>
        )
    }
}