import React from "react";
import { hashHistory } from 'react-router';
import { Toast } from 'antd-mobile';

import update from 'immutability-helper';

export default class HOCdesignerAuth extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // Self: {}, //个人信息
            Self: sessionStorage.getItem("AuthSelf") ? JSON.parse(sessionStorage.getItem("AuthSelf")) : {},
            Motto: {}, //关于我，一句话介绍,座右铭，格言
            Skill: [], //擅长技能,技能树
            // Works: [], //项目案例
            Works: sessionStorage.getItem("AuthWorks") ? JSON.parse(sessionStorage.getItem("AuthWorks")) : {},            
            is_next_page: 0, //是否有更多作品
            total_pages: 0, //作品总页数
        }
        this.handleGetSelfInfo = (res) => {
            if (res.success) {
                this.setState({ Self: res.data});
                sessionStorage.setItem("AuthSelf", JSON.stringify(res.data));
                //传递设计师数据到HOC高阶组件里去
                let { path_thumb, path, nick_name, sex, txt_address, experience, works_count,id } = res.data;
                this.props.propsSetState('Designer', {
                    path_thumb,
                    nick_name,
                    id,
                    path,
                    sex,
                    txt_address,
                    experience,
                    works_count,
                    comment_count: 0,
                });

            } else {
                Toast.fail(res.message, 1);
            }
        }
        //修改标签，不需要做什么事情
        this.handleChangeCustomLabels = (res) => {
            if (res.success) {

            } else {
                Toast.fail(res.message, 1);
            }
        }
        this.handleChangeUserInfo = (res, data) => {
            if (res.success) {
                if (data.sex == 1 ) {
                    data.sex = "男"
                }
                if (data.sex == 2) {
                    data.sex = "女"
                }
                Toast.success(res.message, 1);
                let newSelf = { ...this.state.Self, ...data};
                this.setState({ Self: newSelf })
            } else {
                Toast.fail(res.message, 1);
            }
        }
        this.handleChangeMotto = (res) => {
            if (res.success) {
                Toast.success(res.message, 1);
            } else {
                Toast.fail(res.message, 1);
            }
        }
        this.handleGetDesignerTree = (res) => {
            if (res.success) {
                this.setState({ Skill: res.data })
            } else {
                Toast.fail(res.message, 1);
            }
        }
        this.handleChangeDesignerTree = (res) => {
            if (res.success) {
                Toast.success(res.message, 1);
            } else {
                Toast.fail(res.message, 1);
            }
        }
        this.handleGetWorksListBySelf = (res) => {
            if (res.success) {
                this.setState({ 
                    Works: res.data.item_list,
                    is_next_page: res.data.is_next_page,
                    total_pages: res.data.total_pages,
                })
                sessionStorage.setItem("AuthWorks", JSON.stringify(res.data.item_list));
            } else {
                Toast.fail(res.message, 1);
            }
        }
        this.handleDeleteWorks = (res, work_id) => {
            if (res.success) {
                Toast.success(res.message,1,()=>{
                    let Works = this.state.Works;
                    let WorksIndex = 0; //选中的地址的索引

                    for (let i = 0; i < Works.length; i++) {
                        const work = Works[i];
                        if (work.id == work_id) {
                            WorksIndex = i;
                            break;
                        }
                    }

                    const newWorks = update(Works, { $splice: [[WorksIndex, 1]] });
                    this.setState({ Works: newWorks });
                })
            } else {
                Toast.fail(res.message, 1);
            }
        }
        this.handleSubmitUserAuth = (res) => {
            if (res.success) {
                Toast.success(res.message, 2);
            } else {
                Toast.fail(res.message, 1);
            }
        }
    }

    /**
     * props回调修改状态，
     * 大状态state里，每一个页面是一个小状态，
     * 要先找到是哪个页面，然后去（浅）合并每个页面的小状态
     * @param page 选择某个页面
     * @param state 需要（浅）合并的状态
     * 
     * @memberof HOC
     */
    propsSetState = (page, state) => {
        if (this.state[page]) {
            const newState = update(this.state, { [page]: { $merge: state } });
            this.setState(newState);
        }
    }
    shouldComponentUpdate() {
        return this.props.router.location.action === 'POP';
    }
    componentDidMount() {
        this.token = setTimeout(() => {
            this.ajaxGetSelfInfo();
            this.ajaxGetDesignerTree();
            this.ajaxGetWorksListBySelf();
        }, 200);
        console.log("HOCdesignerAuth componentDidMount");
    }
    //ajax获取个人信息
    ajaxGetSelfInfo = () => {
        runPromise('get_self_info', {
            user_id: validate.getCookie('user_id')
        }, this.handleGetSelfInfo);
    }
    //ajax修改用户标签
    ajaxChangeCustomLabels = (customLabels) => {
        runPromise('change_user_info', {
            customLabels
        }, this.handleChangeCustomLabels);
    }
    //修改用户个人信息
    ajaxChangeUserInfo = (data) => {
        if (data.sex == "男") {
            data.sex = 1
        }
        if (data.sex == "女") {
            data.sex = 2
        }
        runPromise('change_user_info', data, this.handleChangeUserInfo,true,"post", data);
    }
    //修改用户一句话介绍和详细介绍
    ajaxChangeMotto = (data) => {
        runPromise('change_user_info', data, this.handleChangeMotto);
    }
    //获取所有的的擅长技能
    ajaxGetDesignerTree = () => {
        runPromise("get_designer_tree", null, this.handleGetDesignerTree, true, "get");
    }
    //修改用户的擅长技能
    ajaxChangeDesignerTree = (keywords) => {
        runPromise('change_user_info', { keywords: keywords.join(",") }, this.handleChangeDesignerTree);
    }
    //获取我的作品列表
    ajaxGetWorksListBySelf = (per_page = 10, page = 1) => {
        runPromise("get_works_list_by_self", {
            user_id: validate.getCookie("user_id"),
            per_page,
            page,
        }, this.handleGetWorksListBySelf, true, "get");
    }
    //删除某个作品
    ajaxDeleteWorks = (work_id) => {
        runPromise('delete_work_info', {
            work_id
        }, this.handleDeleteWorks, true, "post", work_id);
    }
    //设计师认证，提交审核
    ajaxSubmitUserAuth = () => {
        // console.log("提交");
        let { experience, jobs, keywords, signature_bbs, nick_name, sex  } = this.state.Self;
        runPromise("submit_user_auth", {
            experience,
            jobs: jobs[0] || "",
            keywords: keywords.join(","),
            signature: signature_bbs || "",
            nick_name,
            sex,
        }, this.handleSubmitUserAuth);
    }
    componentWillMount() {
        clearTimeout(this.token);
    }
    render() {
        return (
            <div className="hoc-designer-auth">
                {this.props.children &&
                    React.cloneElement(
                        this.props.children,
                        {
                            state: this.state,
                            setState: this.setState.bind(this),
                            propsSetState: this.propsSetState,
                            HOCState: this.props.state,
                            designer: this.props.designer,
                            Self: this.state.Self, //个人信息
                            Motto: this.state.Motto, //关于我，一句话介绍,座右铭，格言
                            Skill: this.state.Skill, //擅长技能
                            Works: this.state.Works, //项目案例
                            ajaxChangeCustomLabels: this.ajaxChangeCustomLabels,
                            ajaxChangeUserInfo: this.ajaxChangeUserInfo,
                            ajaxChangeMotto: this.ajaxChangeMotto,
                            ajaxChangeDesignerTree: this.ajaxChangeDesignerTree,
                            is_next_page: this.state.is_next_page, //是否有更多作品
                            total_pages: this.state.total_pages, //作品总页数
                            ajaxDeleteWorks: this.ajaxDeleteWorks, //删除某个作品
                            ajaxSubmitUserAuth: this.ajaxSubmitUserAuth, //设计师认证，提交审核
                        }
                    )
                }
            </div>
        )
    }
}