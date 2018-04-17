import React from "react";
import { hashHistory } from 'react-router';
import { Toast } from 'antd-mobile';

import update from 'immutability-helper';

export default class HOCdesignerAuth extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Self: {}, //个人信息
            Motto: {}, //关于我，一句话介绍,座右铭，格言
            Skill: {}, //擅长技能
            Works: {}, //项目案例
        }
        this.handleGetSelfInfo = (res) => {
            if (res.success) {
                this.setState({ Self: res.data})
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
        this.ajaxGetSelfInfo();
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
    ajaxChangeMotto = (data) => {
        runPromise('change_user_info', data, this.handleChangeMotto);
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
                            Self: this.state.Self, //个人信息
                            Motto: this.state.Motto, //关于我，一句话介绍,座右铭，格言
                            Skill: this.state.Skill, //擅长技能
                            Works: this.state.Works, //项目案例
                            ajaxChangeCustomLabels: this.ajaxChangeCustomLabels,
                            ajaxChangeUserInfo: this.ajaxChangeUserInfo,
                            ajaxChangeMotto: this.ajaxChangeMotto,
                        }
                    )
                }
            </div>
        )
    }
}