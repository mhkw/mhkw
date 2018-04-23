import React from 'react';
import { NavBar, Icon, InputItem, Toast, List, Button, WingBlank, ImagePicker, Flex   } from 'antd-mobile';
import { hashHistory } from 'react-router';

export default class RealName extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            real_name_status: "", //认证状态
            real_name_auth_message: "", //认证信息
            real_name: '', //真实姓名
            id_card_number: '', //省份证号码
            id_card_pic_f: '', //正面
            id_card_pic_b: '', //背面
            id_card_pic_h: '', //手持照
            file_f_b: [],
            file_h: [],
            urls_f_b: [],
            urls_h:[],
            all_message: ['', '审核认证中！', '您已实名认证！', '认证失败！','认证超时！'], //状态对应的认证文字信息
        }
        this.handleUploadImage_f_b = (res) => {
            if (res.success) {
                let tmpArrUrls = this.state.urls_f_b;
                tmpArrUrls.push(res.data.path);
                this.setState({
                    urls_f_b: tmpArrUrls
                })
            } else {
                Toast.fail(res.message, 1)
            }
        }
        this.handleUploadImage_h = (res) => {
            if (res.success) {
                let tmpArrUrls = this.state.urls_h;
                tmpArrUrls.push(res.data.path);
                this.setState({
                    urls_h: tmpArrUrls
                })
            } else {
                Toast.fail(res.message, 1)
            }
        }
        this.handleGetRealNameAuth = (res) => {
            if (res.success) {
                let { real_name_status, real_name, real_name_auth_message, id_card_number, id_card_pic_f_thumb, id_card_pic_b_thumb, id_card_pic_h_thumb } = res.data;

                let file_f_b = [];
                let urls_f_b = [];
                let file_h = [];
                let urls_h = [];

                file_f_b.push({ url: id_card_pic_f_thumb });
                urls_h.push(id_card_pic_f_thumb);

                file_f_b.push({ url: id_card_pic_b_thumb});
                urls_h.push(id_card_pic_b_thumb);

                file_h.push({ url: id_card_pic_h_thumb });
                urls_h.push(id_card_pic_h_thumb);

                if (real_name_status == "2") {
                    id_card_number = id_card_number.replace(/(\w)/g, function (a, b, c, d) { return ((c > 7 && c < 13) || c > (id_card_number.length - 3)) ? '*' : a });
                }

                this.setState({
                    real_name_status,
                    real_name_auth_message,
                    real_name,
                    id_card_number,
                    file_f_b,
                    file_h,
                    urls_f_b,
                    urls_h,
                })

                sessionStorage.setItem("realNameAuth", JSON.stringify(res.data));

            } else {
                Toast.fail(res.message, 1)
            }
        }
        this.handleSendRealNameAuth = (res) => {
            if (res.success) {
                Toast.success(res.message, 2);
                this.setState({
                    real_name_status: "1",
                    real_name_auth_message: res.message,
                })
            } else {
                Toast.fail(res.message, 1)
            }
        }
    }
    componentWillMount() {
        let realNameAuthStr = sessionStorage.getItem("realNameAuth");
        if (realNameAuthStr) {

            let { real_name_status, real_name, real_name_auth_message, id_card_number, id_card_pic_f_thumb, id_card_pic_b_thumb, id_card_pic_h_thumb } = JSON.parse(realNameAuthStr);

            let file_f_b = [];
            let urls_f_b = [];
            let file_h = [];
            let urls_h = [];

            file_f_b.push({ url: id_card_pic_f_thumb });
            urls_h.push(id_card_pic_f_thumb);

            file_f_b.push({ url: id_card_pic_b_thumb });
            urls_h.push(id_card_pic_b_thumb);

            file_h.push({ url: id_card_pic_h_thumb });
            urls_h.push(id_card_pic_h_thumb);

            if (real_name_status == "2") {
                id_card_number = id_card_number.replace(/(\w)/g, function (a, b, c, d) { return ((c > 7 && c < 13) || c > (id_card_number.length - 3)) ? '*' : a });
            }

            this.setState({
                real_name_status,
                real_name_auth_message,
                real_name,
                id_card_number,
                file_f_b,
                file_h,
                urls_f_b,
                urls_h,
            })
        }
    }
    componentDidMount() {
        this.ajaxGetRealNameAuth();
    }
    onChangeImg_f_b = (files, type, index) => {

        if (type == 'remove') {
            let oldUrls_f_b = this.state.urls_f_b;
            oldUrls_f_b.splice(index, 1);
            this.setState({
                file_f_b: files,
                urls_f_b: oldUrls_f_b,
            });
        } else {
            runPromise('upload_image_byw_upy2', {
                "arr": files[files.length - 1].url
            }, this.handleUploadImage_f_b, false, "post");
            this.setState({
                file_f_b: files,
            });
        }

    }
    onChangeImg_h = (files, type, index) => {

        if (type == 'remove') {
            let oldUrls_h = this.state.urls_h;
            oldUrls_h.splice(index, 1);
            this.setState({
                file_h: files,
                urls_h: oldUrls_h,
            });
        } else {
            runPromise('upload_image_byw_upy2', {
                "arr": files[files.length - 1].url
            }, this.handleUploadImage_h, false, "post");
            this.setState({
                file_h: files,
            });
        }

    }
    //提交认证
    submitRealName = () => {
        let { real_name, id_card_number, urls_f_b, urls_h } = this.state;
        if (!this.testRealName(real_name)) {
            return;
        }
        if (!this.testIdCard(id_card_number)) {
            return;
        }
        if (urls_f_b.length < 2) {
            Toast.info("请上传两张身份证照", 1);
            return;
        }
        if (urls_h.length < 1) {
            Toast.info("请上传手持照", 1);
            return;
        }

        this.ajaxSendRealNameAuth();
        
    }
    //校验真实姓名
    testRealName(val) {
        if (!(/^[\u4E00-\u9FA5]{2,5}$/.test(val))) {
            Toast.info("输入真实姓名错误!", 1);
            return false;
        } else {
            return true;
        }
    }
    //校验身份证
    testIdCard(val) {
        if (!(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/.test(val))) {
            Toast.info("输入身份证错误!", 1);
            return false;
        } else {
            return true;
        }
    }
    //获取实名认证状态
    ajaxGetRealNameAuth = () => {
        runPromise('get_real_name_auth', {
            user_id: validate.getCookie('user_id')
        }, this.handleGetRealNameAuth);
    }
    //发送实名认证数据
    ajaxSendRealNameAuth = () => {
        let { real_name, id_card_number, urls_f_b, urls_h } = this.state;
        if (urls_f_b.length < 2) {
            return;
        }
        runPromise('send_real_name_auth', {
            real_name,
            id_card_number,
            id_card_pic_f: urls_f_b[0],
            id_card_pic_b: urls_f_b[1],
            id_card_pic_h: urls_h[0],
        }, this.handleSendRealNameAuth);
    }
    render() {
        return (
            <div className="real-name-page" key="1">
                <NavBar
                    className="new-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                >实名认证{this.state.real_name_status == "2" ? <i className="iconfont real-name icon-Id"></i> : null}</NavBar>
                <List renderHeader={<span className="render-header">身份信息</span>} className="real-name-list">
                    <InputItem
                        type="string"
                        value={this.state.real_name}
                        onChange={(val) => { this.setState({ real_name: val.trim() }) }}
                        onBlur={(val) => { this.testRealName(val) }}
                        placeholder="请输入真实姓名"
                        maxLength="6"
                        clear
                        disabled={this.state.real_name_status == '1' || this.state.real_name_status == '2' ? true : false}
                    >真实姓名</InputItem>
                    <InputItem
                        type="string"
                        value={this.state.id_card_number}
                        onChange={(val) => { this.setState({ id_card_number: val.trim() }) }}
                        onBlur={(val) => { this.testIdCard(val) }}
                        placeholder="请输入身份证号码"
                        maxLength="25"
                        clear
                        disabled={this.state.real_name_status == '1' || this.state.real_name_status == '2' ? true : false}
                    >身份证号</InputItem>
                </List>
                <div className={this.state.real_name_status == '1' || this.state.real_name_status == '2' ? "is_real_name" : null}>
                    <List renderHeader={[<span className="render-header">身份证</span>, <span className="right-header">请依次上传身份证正面和背面照</span>]} className="real-name-list">
                        <ImagePicker
                            files={this.state.file_f_b}
                            onChange={this.onChangeImg_f_b}
                            // onImageClick={(index, fs) => console.log(index, fs)}
                            selectable={this.state.file_f_b.length < 2}
                        />
                    </List>
                    <List renderHeader={[<span className="render-header">手持照</span>, <span className="right-header">请上传手持身份证的半身照</span>]} className="real-name-list">
                        <ImagePicker
                            files={this.state.file_h}
                            onChange={this.onChangeImg_h}
                            // onImageClick={(index, fs) => console.log(index, fs)}
                            selectable={this.state.file_h.length < 1}
                        />
                    </List>
                </div>
                <p className="real-name-message">{this.state.real_name_auth_message ? this.state.real_name_auth_message : this.state.all_message[ parseInt(this.state.real_name_status) ]}</p>
                <WingBlank size="lg">
                    <Button
                        onClick={this.state.real_name_status == '1' || this.state.real_name_status == '2' ? null : this.submitRealName}
                        // className="real-name-button"
                        className={this.state.real_name_status == '1' || this.state.real_name_status == '2' ? "real-name-button gray" : "real-name-button"}
                        activeClassName="real-name-button-active"
                    >提交认证</Button>
                </WingBlank>
            </div>
        )
    }
}