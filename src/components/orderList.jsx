import React from 'react';
import { NavBar, Icon, SegmentedControl, WingBlank, Tabs } from 'antd-mobile';
import { hashHistory } from 'react-router';
import { Line,Jiange } from './templateHomeCircle';
import { OrderItemList } from "./TemplateView";
import QueueAnim from 'rc-queue-anim';

// require("../css/person.scss");
const urls = [require('../images/touxiang.png')];
const tempNull = require('../images/tempNull2.png'); //空状态的图片

let tabsLabel = [
    { title: '进行中的订单', sub: '1' },
    { title: '历史订单', sub: '2' },
];

export default class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            border:"line",
            show:true,
            selectedSegmentIndex: 0,
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
            ],
            item_list_ing: [], //进行中的订单
            item_list_end: [], //历史订单
        }
        this.handleSend = (res,fg) =>{
            // console.log(res,fg);            
            if (fg == 2) {
                this.setState({
                    item_list_ing: res.data.item_list
                });
            }
            if (fg == 5) {
                this.setState({
                    item_list_end: res.data.item_list
                });
            }
        }
    }
    componentDidMount(){
        this.getMainProjectList(0, 2);  //进行中的订单
        this.getMainProjectList(0, 5);  //历史订单
    }
    onChangeControl = (e) => {
        let selectedSegmentIndex = e.nativeEvent.selectedSegmentIndex;
        this.getMainProjectList(selectedSegmentIndex, 2);  //进行中的订单
        this.getMainProjectList(selectedSegmentIndex, 5);  //历史订单
        this.setState({ selectedSegmentIndex })
    }
    onValueChange = (value) => {
        console.log(value);
    }
    /**
     * ajax获取数据-报价-获取报价列表
     * 
     * @author ZhengGuoQing
     * @param {any} is_quoter 是否报价方（乙方），0否（甲方），1是（乙方）
     * @param {any} quote_status 报价阶段，0草稿，1待处理，2报价成功，3报价失败，4取消报价，5报价超时，可不填，表示全部 (这里只传空字符串表示进行中，传5表示历史订单)
     * @param {number} stage_id 项目状态，1甲方付首款，2乙方作业中，3甲方付尾款，4双方互评5，项目完成，可不填，表示全部
     * @param {number} [per_page=10] 每页大小，默认为10
     * @param {number} [page=1] 第几页，默认为1（从1开始计数）
     * @memberof Account
     */
    getMainProjectList(is_quoter, stage_id, per_page = 10, page = 1) {
        runPromise("get_main_project_list", {
            "per_page": per_page,
            "page": page,
            /*quote_status：2表示订单*/
            "quote_status": 2,
            /*is_quoter：0表示服务方*/
            "is_quoter": is_quoter,
            stage_id: stage_id, //项目状态，进度
        }, this.handleSend, true, "post", stage_id);
    }
    render() {
        return(
            <QueueAnim className="demo-content" type={['right', 'right']}>
                {this.state.show ? [
                <div className="orderListWrap" key="0">
                    <NavBar
                        mode="light"
                        icon={<i className="icon-leftarrow iconfont" style={{color:"#333",fontSize:"28px",marginTop:"4px"}}/>}
                        style={{ borderBottom:"1px solid #C7C7C7"}}
                        onLeftClick={()=>{
                            this.setState({
                                show: !this.state.show
                            })
                            setTimeout(() => {
                                hashHistory.goBack()
                            }, 150)
                        }}
                    >
                        <WingBlank 
                            size="lg" 
                            className="sc-example"
                        >
                            <SegmentedControl
                                values={['作为需求方', '作为服务方']}
                                tintColor={'#606060'}
                                style={{ height: '28px', width: '250px' }}
                                onChange={this.onChangeControl}
                                selectedIndex={this.state.selectedSegmentIndex}
                            />
                        </WingBlank>
                    </NavBar>
                    <Jiange name="jianGe"></Jiange>
                    <Tabs tabs={tabsLabel}
                        initialPage={0}
                        // onChange={(tab, index) => { console.log('onChange', index, tab); }}
                        // onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                    >
                        <div className="orderItemList" >
                            <div className="orderItem">
                                <div className="orderItemLis">
                                    <ul>
                                        {
                                            this.state.item_list_ing.length ? (
                                                this.state.item_list_ing.map((val, index) => (
                                                    <div>
                                                        <OrderItemList {...val} is_quoter="0" />
                                                        <Jiange name="jianGe"></Jiange>
                                                    </div>
                                                ))
                                            ) : (
                                                <img src={tempNull} />
                                            )
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="orderItemList" >
                            <div className="orderItem">
                                <div className="orderItemLis">
                                    <ul>
                                        {
                                            this.state.item_list_end.length ? (
                                                this.state.item_list_end.map((val, index) => (
                                                    <div>
                                                        <OrderItemList {...val} is_quoter="1" />
                                                        <Jiange name="jianGe"></Jiange>
                                                    </div>
                                                ))
                                            ) : (
                                                <img src={tempNull} />
                                            )
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Tabs>
                </div>
                ] : null}
            </QueueAnim>
        )
    }
}