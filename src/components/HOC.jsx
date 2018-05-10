import React from "react";
import { hashHistory } from 'react-router';
import { Toast } from 'antd-mobile';

import update from 'immutability-helper';

export default class HOC extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            Address: {
                address: "", //百度地图address字段
                city: "", //通过城市列表选择的城市或者地图定位的城市
                lon: "", //经度
                lat: "", //纬度
                currentLocation: "", //定位当前位置的地址
            },
            AddressNeed: { //发布需求的地址
                address: "", //百度地图address字段
                city: "", //通过城市列表选择的城市或者地图定位的城市
                lon: "", //经度
                lat: "", //纬度
                currentLocation: "", //定位当前位置的地址
            },
            AddressCommon: { //个人中心常用地址,临时存储新增或修改的地址
                address: "", //百度地图address字段
                city: "", //通过城市列表选择的城市或者地图定位的城市
                lon: "", //经度
                lat: "", //纬度
                currentLocation: "", //定位当前位置的地址
            },
            AddressAuthSelf: {      //设计师认证，设计师地址
                address: "", //百度地图address字段
                city: "", //通过城市列表选择的城市或者地图定位的城市
                lon: "", //经度
                lat: "", //纬度
                currentLocation: "", //定位当前位置的地址
            },
            Designer: {}, //设计师，拿到设计师常规数据后直接放进去吧
            Home: {       //主页
                currentIdx: 0,
            },
            UploadAvatar: {}, // 上传的图片对象，图片对象属性名为img，记得及时手动清除
            fcategoryId:"",
            categoryId:"",
            category:"",
            content:"",
            files:[],
            needTitle:"",
            price:"",
            ids:[],
            urls:[],
            tab:0,
            keywords:"",
            conversations: [], //环信会话消息列表
            sumUnreadMessagesCount: 0, //环信会话消息列表总的未读消息条数
        }
        this.handleGetUserList2 = (res, conversations) => {
            if (res.success) {
                if (res.data.item_list && res.data.item_list.length > 0) {
                    let item_list = res.data.item_list;
                    for (let i = 0; i < item_list.length; i++) {
                        const element = item_list[i];
                        for (let j = 0; j < conversations.length; j++) {
                            const element2 = conversations[j];
                            if (element2.conversationId == element.hxid) {
                                element2.nick_name = element.nick_name;
                                element2.path_thumb = element.path_thumb;
                                break;
                            }
                        }
                    }
                    this.setState({
                        conversations,
                    })
                    this.imageCacheAvatar(item_list)
                }
            } else {
                Toast.fail(res.message, 1.5);
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
        setTimeout(() => {
            this.apiGetAllConversations();
            this.sendEventHOCRender();
        }, 500);
    }
    //缓存头像图片, 环信聊天必须用本地图片
    imageCacheAvatar = (item_list) => {
        if (window.api) {
            // let cacheAvatar = [];
            for (let i = 0; i < item_list.length; i++) {
                const element = item_list[i];
                window.api.imageCache({
                    url: element.path_thumb
                }, (ret, err) => {
                    if (ret.status) {
                        let avatar = {};
                        // avatar[element.hxid] = ret.url;
                        avatar.id = element.hxid;
                        avatar.url = ret.url;
                        // cacheAvatar.push(avatar);
                        let cacheAvatar = JSON.parse(sessionStorage.getItem("cacheAvatar"));
                        if (cacheAvatar && cacheAvatar.length > 0) {
                            cacheAvatar.push(avatar);
                            sessionStorage.setItem("cacheAvatar", JSON.stringify(cacheAvatar));
                        } else {
                            cacheAvatar = [];
                            cacheAvatar.push(avatar);
                            sessionStorage.setItem("cacheAvatar", JSON.stringify(cacheAvatar));
                        }
                    }
                });
            }
            // console.log("cacheAvatar+++++++++++++++++++");
            // console.log(JSON.stringify(cacheAvatar));
            
            // sessionStorage.setItem("cacheAvatar", JSON.stringify(cacheAvatar))
        }
    }
    //API 监听获取所有会话列表
    apiGetAllConversations = () => {
        // console.log("getAllConversations 0");
        if (window.api) {
            console.log("getAllConversations 1");
            window.api.addEventListener({
                name: 'getAllConversations'
            },  (ret, err) => {
                console.log(JSON.stringify(ret));
                if (ret.value && ret.value.conversations && ret.value.conversations.length > 0) {
                    let conversations = ret.value.conversations;
                    let sumUnreadMessagesCount = 0;
                    conversations.map((value, index)=>{
                        sumUnreadMessagesCount += parseInt(value.unreadMessagesCount);
                    });
                    this.getUserList2(conversations);
                    this.setState({
                        sumUnreadMessagesCount,
                    })
                }
                if (ret.value && ret.value.conversations && ret.value.conversations.length == 0) {
                    this.setState({
                        conversations: [],
                        sumUnreadMessagesCount: 0,
                    })
                }
            });
        }
    }
    //获取环信会话列表的头像和昵称
    getUserList2 = (conversations) => {
        let hx_ids = []
        conversations.map((value, index, elem)=>{
            hx_ids.push(value.conversationId);
        });
        //获取指定id的设计师列表
        runPromise('get_user_list2', {
            hx_ids: hx_ids.join(",")
        }, this.handleGetUserList2, true, "post", conversations);
    }
    //发送消息，HOC已经渲染，可以监听环信聊天了
    sendEventHOCRender = () => {
        if (window.api) {
            console.log("HOCRender 2");
            window.api.sendEvent({
                name: 'HOCRender'
            });
        }
    }
    render() {
        // console.log('HOC::')
        return (
            <div className="hoc-max-box">
                {this.props.children &&
                    React.cloneElement(
                        this.props.children,
                        {
                            state: this.state,
                            setState: this.setState.bind(this),
                            designer: this.state.Designer,
                            propsSetState: this.propsSetState,
                            conversations: this.state.conversations,
                            sumUnreadMessagesCount: this.state.sumUnreadMessagesCount,
                        }
                    ) 
                }
            </div>
        )
    }
}