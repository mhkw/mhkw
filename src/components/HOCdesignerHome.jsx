import React from "react";
import { hashHistory } from 'react-router';
import { Toast } from "antd-mobile";
import axios from 'axios';
import qs from 'qs';

export default class HOCdesignerHome extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: '',
            designer: {},
            indexWorksList: [], //首页的作品列表，最多只显示八个
            selectedComment: {}, //跳到评论详情页前，记录当前选择的评论，评论详情页直接可以拿到了
        }
        this.handleGetSelfInfo = (res) => {
            if (res.success) {
                this.setState({
                    designer: { ...this.state.designer, ...res.data }
                });
                // this.props.propsSetState("Designer", res.data)
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
        this.handleGetWorkList = (res) => {
            if (res.success) {
                this.setState({
                    indexWorksList: res.data.item_list,
                    total_works: res.data.total_works,
                })
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
    }
    componentWillMount() {
        if (this.props.designer.id) {
            this.setState({
                designer: this.props.designer
            });
        }
    }
    componentDidMount() {
        let userId = this.props.location.query.userId;
        if (userId) {
            this.setState({ userId });
            // this.ajaxGetSelfInfo(69590);
            // this.getWorkList(24);
            this.ajaxGetSelfInfo(userId);
            this.getWorkList(userId);
        }
    }
    ajaxGetSelfInfo = (userId) => {
        runPromise('get_user_info', {
            user_id: userId,
        }, this.handleGetSelfInfo, true, 'get');
    }
    //获取设计师主页作品列表,默认最多只显示8个
    getWorkList = (userId) => {     
        // runPromise("get_user_works_list_ex", {
        //     // user_id: validate.getCookie("user_id"),
        //     user_id: userId,
        //     sort: "add_time",
        //     keyword: "",
        //     per_page: 8,        //每页数量
        //     page: 1,            //第几页，从第一页开始
        // }, this.handleGetWorkList, true, "get");
        axios({
            method: 'post',
            url: `https://www.huakewang.com/hkw_newapi/get_user_works_list_ex/${userId}/add_time/${8}/${1}`,
            withCredentials: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            responseType: 'json',
            data: qs.stringify({
                is_home_page: 0,
            })
        })
            .then((response) => {
                this.handleGetWorkList(response.data)
            })
            .catch((error) => {
                console.log(error, "错误");
            });
    }
    updateSelectedComment = (selectedComment) => {
        this.setState({ selectedComment });
    }
    render() {
        return (
            <div className="hoc-designer-home">
                {this.props.children &&
                    React.cloneElement(
                        this.props.children,
                        {
                            state: this.state,
                            setState: this.setState.bind(this),
                            designer: this.state.designer,
                            indexWorksList: this.state.indexWorksList,
                            selectedComment: this.state.selectedComment,
                            updateSelectedComment: this.updateSelectedComment,
                        }
                    )
                }
            </div>
        )
    }
}