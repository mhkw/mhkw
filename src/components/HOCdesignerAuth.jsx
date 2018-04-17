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
                            propsSetState: this.propsSetState
                        }
                    )
                }
            </div>
        )
    }
}