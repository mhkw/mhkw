import React from 'react'
import { NavBar, Icon, Button, WingBlank, Checkbox, Stepper, Modal, Toast } from 'antd-mobile';
import { hashHistory, Link } from 'react-router';
import { Motion, spring } from 'react-motion';
import BScroll from 'better-scroll'

import update from 'immutability-helper';

const ServerItem = (props) => (
    <div className="server-item clearfix">
        <Checkbox.CheckboxItem key={props.index} checked={props.isChecked} onChange={() => props.onChangeisChecked(props.index)}>
            {[
                <h2 className="ellipsis">{props.title}</h2>,
                <a onClick={() => { props.editServer(props.id) }}>编辑</a>
            ]}
        </Checkbox.CheckboxItem>
        <p className="describe ellipsis-lines">{props.describe}</p>
        <div className="unit-box"><span className="unit_price">{props.unit_price}</span>/<span className="unit">{props.unit}</span></div>
        <Stepper
            className="my-stepper service-create-num"
            showNumber
            min={1}
            max={10000}
            step={1}
            value={props.number}
            onChange={(val) => props.onChangeThisNumber(val, props.index)}
            onBlur={(e) => { e.target.value < 1 ? props.onChangeThisNumber(1, props.index) : null} }
        />
    </div>
)

export default class ServerCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0, //添加服务输入信息的进度：0,1,2,3
            showModal: false, //显示弹窗
            checkNum: 0, //用户已经选中了几个服务模板
            checkPrice: 0, //用户已经选中了几个服务模板的价格总计
            checkedServerList: [],
            serverList: [],
            height:"",
            scroll: null, //滚动插件实例化对象
            scroll_bottom_tips: "上拉加载更多", //上拉加载的tips
            total_count: 0, //总数量
            // serverList: [{
            //     id: "1",
            //     server_name: "PS简单处理图片",
            //     unit_price: "2000.00", //单价
            //     unit: "小时", //单位
            //     describe: "海报设计定制图片海报设计定制图片海报设计定制图片", //简介
            //     number: 1,
            //     isChecked: false
            // },
            // {
            //     id: "2",
            //     server_name: "PS简单处理图片2",
            //     unit_price: "1000.00", //单价
            //     unit: "天", //单位
            //     describe: "巴拉巴拉", //简介
            //     number: 1,
            //     isChecked: false
            // }],
        };
        this.handleGetSelfService = (res) => {
            if (res.success) {
                let newItemList = this.state.serverList;

                newItemList = [...this.state.serverList, ...res.data.item_list];

                newItemList.map((value, index, elem) => {
                    elem[index].number = 1;
                    elem[index].isChecked = false;
                    elem[index].server_name = value.Name;
                    elem[index].describe = value.Description;
                })

                this.props.setState({
                    serverList: newItemList,
                })

                this.setState({
                    total_count: res.data.total_count,
                    scroll_bottom_tips: res.data.total_count > 8 ? "上拉加载更多" : ""
                }, () => {
                    this.state.scroll.finishPullUp()
                    this.state.scroll.refresh();
                })

            } else {
                Toast.info(res.message, 1.5);
            }



            // if (res.success) {
            //     let item_list = res.data.item_list;
            //     item_list.map((value, index, elem) => {
            //         elem[index].number = 1;
            //         elem[index].isChecked = false;
            //         elem[index].server_name = value.Name;
            //         elem[index].describe = value.Description;
            //     })
            //     this.setState({ serverList: item_list });
            // } else {
            //     Toast.fail(res.message, 1.5);
            // }
        }
        
    }

    componentWillMount() {
        if (this.props.state.checkNum) {
            let { checkNum, checkPrice, checkedServerList, showModal } = this.props.state;
            this.setState({ checkNum, checkPrice, checkedServerList, showModal });
        }
        if (this.props.state.serverList) {
            let { serverList } = this.props.state;
            this.setState({ serverList });
        }
        
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.state.serverList) {
            let { serverList } = nextProps.state;
            this.setState({ serverList });
        }
    }
    componentDidMount() {
        const hei = document.documentElement.clientHeight - document.querySelector('.serverStep').offsetHeight - document.querySelector('.top').offsetHeight - 25;
        const scroll = new BScroll(document.querySelector('.wrapper'), { click: true, bounceTime: 300, swipeBounceTime: 200, pullUpLoad: { threshold: -50 } })
        this.setState({
            height: hei,
            scroll,
        })
        scroll.on('pullingUp', () => {
            this.ajaxNextPage();
        });
        const maskDOM = document.getElementsByClassName("am-modal-mask");
        if (maskDOM.length) {
            maskDOM[0].style.display = "none";
        }
    }
    ajaxNextPage = () => {
        let hasNextPage = false;

        let offset = this.state.serverList.length;
        if (offset < this.props.state.total_count) {
            hasNextPage = true;
        }

        this.setState({
            scroll_bottom_tips: hasNextPage ? "加载中..." : "加载完成"
        })

        if (hasNextPage) {
            setTimeout(() => {
                this.ajaxGetSelfServiceList(10, offset, true);
            }, 500);
        }
    }
    ajaxGetSelfServiceList = (limit = 10, offset = 0, pullingUp = false) => {
        //服务模板
        runPromise('get_self_service_template_list', {
            limit,
            offset,
        }, this.handleGetSelfService, true, "post", pullingUp);
    }
    componentDidUpdate() {
        const maskDOM = document.getElementsByClassName("am-modal-mask");
        if (maskDOM.length) {
            maskDOM[0].style.display = "none";
        }
    }
    //计算已经选中的数量和价格
    countNumberAndPrice() {
        let sumNumber = 0;
        let sumPrice = 0;
        let checkedServerList = [];
        this.state.serverList.map((value, index) => {
            if (value.isChecked) {
                sumNumber++;
                sumPrice += parseFloat(value.unit_price) * parseInt(value.number);
                checkedServerList.push(value);
            }
        })
        this.setState({
            checkNum: sumNumber,
            checkPrice: sumPrice.toFixed(2),
            checkedServerList: checkedServerList,
            showModal: !!sumNumber
        })
        this.props.updateCountNumberAndPrice(sumNumber, sumPrice.toFixed(2), checkedServerList, !!sumNumber, this.state.serverList);
    }
    onChangeisChecked = (index) => {
        const isChecked = this.state.serverList[index].isChecked;
        
        const newServerList = update(this.state.serverList, { [index]: { isChecked: { $set: !isChecked }} });
        this.setState({
            serverList: newServerList
        }, this.countNumberAndPrice)
        // console.log(isChecked);
        
    }
    onChangeThisNumber = (val, index) => {
        // console.log(val, index)
        // let value = (isNaN(val) || val == "" ) ? "" : parseInt(val);
        let value;
        if (isNaN(val) || val == "") {
            return ;
        } else {
            value = parseInt(val);
        }
        const newServerList = update(this.state.serverList, { [index]: { number: { $set: value } } });
        // this.setState({
        //     serverList: newServerList
        // }, this.countNumberAndPrice)
        let token =  setTimeout(() => {
            this.setState({
                serverList: newServerList
            }, this.countNumberAndPrice)
            clearTimeout(token);
        }, 200);
    }
    // handleToggle() {
    //     this.setState(({ show }) => ({
    //         show: !show
    //     }))
    // }
    onClickCreateServer = () => {
        if (this.state.checkNum) {
            hashHistory.push({
                pathname: '/createOffer',
                query: { form: 'creatServer' },
                // state: {
                //     checkedServerList: this.state.checkedServerList,
                //     checkPrice: this.state.checkPrice
                // }
            });
        } else {
            Toast.info("请选择服务项目", 1.5);
        }
    }
    clickAddServer = () => {
        hashHistory.push({
            pathname: '/addServer',
            query: { form: 'addServer' },
        });
    }
    clickEditServer = (id) => {
        hashHistory.push({
            pathname: '/addServer',
            query: { 
                form: 'editServer',
                id,
            },
        });
    }
    render () {
        // this.countNumberAndPrice();
        return (
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div className="createServer" style={{ ...interpolatingStyle, position: "relative" }}>
                        <NavBar
                            className="create-server-nav-bar top"
                            mode="light"
                            icon={<Icon type="left" />}
                            onLeftClick={() => hashHistory.goBack()}
                            leftContent={<span style={{fontSize:"15px"}}>返回</span>}
                            // rightContent={[
                            //     <i className="iconfont icon-tianjiajiahaowubiankuang" style={{ color:"#A8A8A8",marginRight:"3px"}}></i>,
                            //     <span style={{ color: "#000", fontSize: "14px"}}>添加</span>
                            // ]}
                            rightContent={
                                <a onClick={this.clickAddServer}>
                                    <i className="iconfont icon-tianjiajiahaowubiankuang" style={{ color: "#A8A8A8", marginRight: "3px" }}></i>
                                    <span style={{ color: "#000", fontSize: "14px" }}>添加</span>
                                </a>
                            }
                        >报价</NavBar>
                        <div className="serverStep">
                            <ul>
                                <li className={this.props.progress > 0 ? "finish" : null}>创建/选择内容<div className="triangle-right"></div></li>
                                <li className={this.props.progress > 1 ? "finish" : null}>客户信息<div className="triangle-right"></div></li>
                                <li className={this.props.progress > 2 ? "finish" : null}>生成报价并分享</li>
                            </ul>
                        </div>
                        <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                            <div>
                                <div className="serverContent" style={{ "display": this.state.serverList.length > 0 ? "none" : "block" }}>
                                    <h3>您需要先添加一个服务</h3>
                                    <p>我的服务包含了线上服务和线下服务，由您和客户自行商定</p>
                                </div>
                                {
                                    this.state.serverList.map((val, index) => {
                                        return (
                                            <ServerItem
                                                index={index}
                                                id={val.id}
                                                onChangeisChecked={this.onChangeisChecked}
                                                title={val.server_name}
                                                describe={val.describe}
                                                unit_price={val.unit_price}
                                                unit={val.unit}
                                                number={val.number}
                                                onChangeThisNumber={this.onChangeThisNumber}
                                                isChecked={val.isChecked}
                                                editServer={this.clickEditServer}
                                            ></ServerItem>
                                        )
                                    })
                                }
                                <div className="scroll-bottom-tips" style={{ "display": this.state.serverList.length > 4 ? "block" : "none" }}>{this.state.scroll_bottom_tips}</div>
                                <div className="serverButton" style={{ "padding-bottom": "60px", "visibility": this.state.serverList.length > 3 ? "hidden" : "visible"}}>
                                    <Button
                                        type="ghost"
                                        icon={<i className="iconfont icon-tianjiajiahaowubiankuang"></i>}
                                        size="large"
                                        style={{ margin: "0 2.3rem", color: "#009AE8", height: "1.2rem" }}
                                        activeStyle={{ backgroundColor: "#259EEF", color: "#fff" }}
                                    >
                                        <Link to="/addServer">添加服务内容</Link>
                                    </Button>
                                </div>
                                <Modal
                                    wrapClassName="server-button-modal"
                                    popup
                                    visible={this.state.showModal}
                                    // onClose={() => { this.setState({ showModal: false}) }}
                                    animationType="slide-up"
                                    maskClosable={false}
                                    transparent={true}
                                >
                                    <div className="create-server-popup">
                                        <div className="txt-div">
                                            <span className="left">共<span className="num">{this.state.checkNum}</span>项服务</span>
                                            <span className="right">合计:<span className="price">{this.state.checkPrice + "元"}</span></span>
                                        </div>
                                        <Button
                                            onClick={this.onClickCreateServer}
                                            className="create-server-button"
                                            activeClassName="create-server-button-active"
                                        >创建报价</Button>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                        
                    </div>
                }
            </Motion>
        )
    }
}

ServerCreate.contextTypes = {
    router: React.PropTypes.object
};