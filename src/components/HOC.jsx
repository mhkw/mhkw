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
            Designer: {}, //设计师，拿到设计师常规数据后直接放进去吧
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
    render() {
        console.log('HOC::' + this.state.Address.address)
        return (
            <div className="hoc-max-box">
                {this.props.children &&
                    React.cloneElement(
                        this.props.children,
                        {
                            state: this.state,
                            setState: this.setState.bind(this),
                            designer: this.state.Designer,
                            propsSetState: this.propsSetState
                        }
                    ) 
                }
            </div>
        )
    }
}