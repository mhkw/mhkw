import React from 'react';
import { hashHistory } from 'react-router';
import { Toast, NavBar, Icon, Flex, WingBlank, Modal } from 'antd-mobile';
import update from 'immutability-helper';

const avatar = require('../images/selec.png');

export default class UserFansList extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            black_list: [], //黑名单列表
        }
        this.handleBlackList = (res) => {
            if (res.success) {
                this.setState({
                    black_list: res.data.item_list
                })
            } else {
                Toast.fail(res.message, 1);
            }
        }
        this.handleDeleteUserBlack = (res, id) => {
            if (res.success) {

                let MyIsFavorite = 0;
                if (res.message.type == "add") {
                    MyIsFavorite = 1;
                    Toast.success("关注成功", 1)
                }
                if (res.message.type == "delete") {
                    MyIsFavorite = 0;
                    Toast.success("取消关注成功", 1)
                }

                let black_list = this.state.black_list;
                let DeleteIndex = 0;
                for (let i = 0; i < black_list.length; i++) {
                    if (id == black_list[i].user_id) {
                        DeleteIndex = i;
                        break;
                    }
                }
                const new_black_list = update(black_list, { [DeleteIndex]: { user_info: { MyIsFavorite: { $set: MyIsFavorite } }} });
                this.setState({ black_list: new_black_list });
            } else {
                Toast.fail(res.message, 1);
            }
        }
    }
    componentDidMount() {
        this.ajaxBlackList();
    }
    //获取粉丝列表
    ajaxBlackList = (per_page = 10, page = 1) => {
        runPromise("get_favoriter_favorite_list", {
            param1: "user",
            param2: 0,
            param3: 0,
            per_page,
            page,
            id: validate.getCookie("user_id"),
        }, this.handleBlackList, true, "get");
    }
    removeBlackList = (to_user_id) => {
        runPromise('add_favorite', {
            "id": to_user_id,
            type: "user",
        }, this.handleDeleteUserBlack, true, "post", to_user_id);
    }
    render() {
        return (
            <div key="1" className="black-list-page">
                <NavBar
                    className="NewNavBar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                >我的粉丝</NavBar>
                <div className="black-list-main">
                    <WingBlank size="md">
                        {
                            this.state.black_list.length > 0 &&
                            this.state.black_list.map(({ user_info }, index) => (
                                <Flex className="black-item" key={user_info.id}>
                                    <Flex.Item className="flex-item-left">
                                        <img className="black-img" src={user_info.path_thumb} onError={(e) => { e.target.src = avatar }} />
                                    </Flex.Item>
                                    <Flex.Item className="flex-item-middle">
                                        <p className="black-p-title ellipsis">{user_info.nick_name}</p>
                                        <p className="black-p-middle ellipsis">{`${user_info.job_name} | ${user_info.experience} | ${user_info.works_count}件作品`}</p>
                                        {/* <p className="bottom ellipsis">{value.add_time_format}</p> */}
                                    </Flex.Item>
                                    <Flex.Item className="flex-item-right">
                                        {/* <Button
                                            type="ghost"
                                            // className="remove-black-list"
                                            size="small"
                                            style={{ color: 'blur' }}
                                            onClick={this.removeBlackList}
                                        ></Button> */}
                                        <div 
                                            className="fans-bottom"
                                            onClick={() => { this.removeBlackList(user_info.id) }}
                                        >{user_info.MyIsFavorite ? '已关注' : '关注'}</div>
                                    </Flex.Item>
                                </Flex>
                            ))
                        }
                    </WingBlank>
                </div>
            </div>
        )
    }
}
