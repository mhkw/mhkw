import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, SegmentedControl, Flex, WingBlank   } from 'antd-mobile';

const zhanWei = require('../images/logoZhanWei.png');
const temp = require('../images/avatar.png');

export default class Activity extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activity_list: sessionStorage.getItem("activity_list") ? JSON.parse(sessionStorage.getItem("activity_list")) : [],
        }
        this.handleGetActivity = (res) => {
            if (res.success) {
                this.setState({
                    activity_list: res.data
                })
                res.data.length > 0 && sessionStorage.setItem("activity_list", JSON.stringify(res.data));
            } else {
                Toast.fail(res.message, 1);
            }
        }
    }
    clickControl = (e) => {
        let index = e.nativeEvent.selectedSegmentIndex;
        console.log(index);
    }
    componentDidMount() {
        this.getActivity();
    }
    getActivity = () => {
        this.ajaxGetActivity();
    }
    ajaxGetActivity = () => {
        runPromise("activity", {}, this.handleGetActivity, true, "get");
    }
    render() {
        return (
            <div key="1" className="activity-page">
                <NavBar
                    className="NewNavBar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                >活动</NavBar>
                <SegmentedControl
                    style={{"margin" : "0.2rem 1rem"}}
                    values={['全部', '进行中', '已结束']}
                    tintColor={'#33a3ff'}
                    onChange={this.clickControl}
                />
                <div className="activity-page-box">
                    <WingBlank size="md">
                        {
                            this.state.activity_list.length > 0 &&
                            this.state.activity_list.map((value, index) => (
                                <Flex align="start" className="activity-item">
                                    <Flex.Item className="flex-item-left">
                                        <img className="activity-img" src={value.actcover ? "https://www.huakewang.com/uploads/" + value.actcover : ""} onError={(e) => { e.target.src = zhanWei }} />
                                    </Flex.Item>
                                    <Flex.Item className="flex-item-right">
                                        <p className="title ellipsis">{value.acttitle}</p>
                                        <p className="sponsor ellipsis">{value.sponsor ? "主办方: " + value.sponsor : ""}</p>
                                        <div className="bottom">
                                            <div className="one single ellipsis">
                                                <i className="iconfont icon-shijian2"></i>
                                                {value.starttime ? value.starttime.split(" ")[0] : ""}
                                            </div>
                                            <div className="tow single ellipsis">
                                                <i className="iconfont icon-location"></i>
                                                {value.actcity}
                                            </div>
                                            <div className="three single ellipsis">
                                                <span className="number">{value.joinpeople}</span>
                                                {"人报名"}
                                            </div>
                                        </div>
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