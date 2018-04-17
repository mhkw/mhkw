import React from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { hashHistory } from 'react-router';
import { Line, AccountListDetails } from './templateHomeCircle';
import { Motion, spring } from 'react-motion';

// require("../css/person.scss");

export default class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            border:"line",
            show:true,
            account:[
                {
                    type:"充值",
                    numLeave:"8566.00",
                    time:"2017-12-20",
                    showMoney:"+88.00"
                },
                {
                    type: "在线支付",
                    numLeave: "8566.00",
                    time: "2017-12-20",
                    showMoney: "-88.90"
                }
            ]
        }
    }
    render() {
        return(
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div className="accountWrap" style={{ ...interpolatingStyle, position: "relative" }}>
                        <NavBar
                            mode="light"
                            icon={<Icon type="left" size="lg" color="#333" />}
                            onLeftClick={() => hashHistory.goBack()}
                        >收支明细</NavBar>
                        
                    </div>
                }
            </Motion>
        )
    }
}