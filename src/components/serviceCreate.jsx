import React from 'react'
import { NavBar, Icon, Button,WingBlank} from 'antd-mobile';
import { hashHistory } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class serverCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           
        };
    }

    componentDidMount(){

    }

    render () {
        return (
            <ReactCSSTransitionGroup
                transitionName="transitionWrapper"
                component="div"
                // transitionName="example"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
            >
                <div className="createServer" key="1">
                    <NavBar
                        mode="light"
                        icon={<Icon type="left" />}
                        onLeftClick={() => hashHistory.goBack()}
                        leftContent={<span style={{fontSize:"14px"}}>返回</span>}
                        rightContent={[
                            <i className="iconfont icon-tianjiajiahaowubiankuang" style={{ color:"#A8A8A8",marginRight:"3px"}}></i>,
                            <span style={{ color: "#000", fontSize: "14px"}}>添加</span>
                        ]}
                    >报价</NavBar>
                    <div className="serverStep">
                        <ul>
                            <li className="serverStep1">创建/选择内容</li>
                            <li className="serverStep2">客户信息</li>
                            <li className="serverStep3">生成报价并分享</li>
                        </ul>
                    </div>
            
                    <div className="serverContent">
                        <h3>您需要先添加一个服务</h3>
                        <p>我的服务包含了线上服务和线下服务，由您和客户自行商定</p>
                    </div>
                    <div className="serverButton">
                        <Button 
                            type="ghost"
                            icon={<i className="iconfont icon-tianjiajiahaowubiankuang"></i>}
                            size="large"
                            style={{ margin: "0 2.3rem", color: "#009AE8", border:"1px solid #009AE8",height:"1.2qrem"}}
                            activeStyle={{ backgroundColor: "#259EEF", color: "#fff",border:"1px solid #259EEF"}}
                        >
                            添加服务内容
                        </Button>
                    </div>
                    
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}