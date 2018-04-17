import React from 'react';
import { hashHistory } from 'react-router';
import { Toast, NavBar, Icon, Flex, WingBlank, Modal } from 'antd-mobile';
import { Motion, spring } from 'react-motion';

const avatar = require('../images/selec.png');

export default class UserBlackList extends React.Component {
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
                Toast.success('成功', 1, ()=>{
                    let black_list = this.state.black_list;
                    let DeleteIndex = 0;
                    for (let i = 0; i < black_list.length; i++) {
                        if (id == black_list[i].to_user_id) {
                            DeleteIndex = i;
                            break;
                        }
                    }
                    black_list.splice(DeleteIndex, 1);
                    this.setState({
                        black_list,
                    })
                });
            } else {
                Toast.fail(res.message, 1);
            }
        }
    }
    componentDidMount() {
        this.ajaxBlackList();
    }
    ajaxBlackList = (per_page = 10, page = 1) => {
        runPromise("get_my_user_black_list", {
            param1: 0,
            param2: 0,
            per_page,
            page
        }, this.handleBlackList, true, "get");
    }
    removeBlackList = (name,id) => {
        Modal.alert('移除黑名单吗?', name, [
            { text: '取消', onPress: () => { } },
            { text: '确定', onPress: () => this.ajaxRemoveBlackList(id) },
        ])
    }
    ajaxRemoveBlackList = (to_user_id) => {
        runPromise('delete_user_black', {
            to_user_id,
        }, this.handleDeleteUserBlack, true, "post", to_user_id);
    }
    render() {
        return (
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div style={{ ...interpolatingStyle }} className="black-list-page">
                        <NavBar
                            className="NewNavBar"
                            mode="light"
                            icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                            onLeftClick={() => hashHistory.goBack()}
                        >黑名单</NavBar>
                        <div className="black-list-main">
                            <WingBlank size="md">
                                {
                                    this.state.black_list.length > 0 &&
                                    this.state.black_list.map((value, index) => (
                                        <Flex className="black-item" key={value.to_user_id}>
                                            <Flex.Item className="flex-item-left">
                                                <img className="black-img" src={value.path_thumb} onError={(e) => { e.target.src = avatar }} />
                                            </Flex.Item>
                                            <Flex.Item className="flex-item-middle">
                                                <p className="black-p-title ellipsis">{value.nick_name}</p>
                                                <p className="black-p-middle ellipsis">{`${value.job_name} | ${value.experience} | ${value.works_count}件作品`}</p>
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
                                                    className="remove-black-list"
                                                    onClick={() => { this.removeBlackList(value.nick_name, value.to_user_id)}}
                                                >—</div>
                                            </Flex.Item>
                                        </Flex>
                                    ))
                                }
                            </WingBlank>
                        </div>
                    </div>
                }
            </Motion>
        )
    }
}
