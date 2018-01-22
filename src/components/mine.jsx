import React from 'react';

require ('../css/person.scss');

const urls = [require('../images/touxiang.png')]
export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount(){

    }
    render () {
        return (
            <div className="mineWrap">
                <div className="mineWrapTop">
                    <p>
                        <a href="javascript:;">用户名称<i className="iconfont icon-tubiao-"></i></a>
                        <span className="iconfont icon-shezhi" style={{ color:"#2a2a34",float:'right' }}></span>                    
                    </p>
                </div>
                <div className="minePic">
                    <div className="minePicTou">
                        <img src={urls[0]} alt=""/>
                        <div className="minePicStages">
                            <span>37%</span>
                        </div>
                    </div>
                </div>
                <ul className="mineThingsTodo">
                    <li>
                        <p className="num">5000.00</p>
                        <p>账户</p>
                    </li>
                    <li>
                        <p className="num"><i style={{color:"red"}}>1</i>/12</p>
                        <p>报价</p>
                    </li>
                    <li>
                        <p className="num"><i style={{ color: "red" }}>1</i>/12</p>
                        <p>订单</p>
                    </li>
                </ul>
            </div>
        )
    }
}