import React from 'react';
import { NavBar, Icon, Toast, List, Button, SwipeAction, Modal, InputItem} from 'antd-mobile';
import { hashHistory } from 'react-router';
import { Motion, spring } from 'react-motion';
import BScroll from 'better-scroll'

export default class Contacts extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            location_form: '',
            contactsList: sessionStorage.getItem("contactsList") ? JSON.parse(sessionStorage.getItem("contactsList")) : [],
            showInputModal: false, //编辑或新增联系人的弹窗，是否打开
            // InputModalData: null, //编辑或新增联系人的弹窗，里面的内容，每次关闭弹窗时都设为null
            yunLinkName: '', //联系人弹窗，名字
            yunLinkPhone: '', //联系人弹窗，手机号 
            yunLinkCompany: '', //联系人弹窗，公司
            yunLinkEmail: '', //联系人弹窗，邮箱
            scroll: null, //滚动插件实例化对象
            scroll_bottom_tips: "上拉加载更多", //上拉加载的tips
            total_count: 0, //总数量
        }
        //获取联系人列表
        this.handleGetCustomers = (res, pullingUp) => {
            if (res.success) {
                let newItemList = this.state.contactsList;
                if (pullingUp) {
                    // newItemList.push(res.data.item_list);
                    newItemList = [...this.state.contactsList, ...res.data.item_list];
                } else {
                    newItemList = res.data.item_list;
                    sessionStorage.setItem("contactsList", JSON.stringify(newItemList));
                }

                this.setState({
                    contactsList: newItemList,
                    total_count: res.data.total_count,
                    scroll_bottom_tips: res.data.total_count > 8 ? "上拉加载更多" : ""
                }, () => {
                    this.state.scroll.finishPullUp()
                    this.state.scroll.refresh();
                })

            } else {
                Toast.info(res.message, 1.5);
            }
        }
        //删除某个联系人
        this.handleDelCustomer = (res) => {
            if (res.success) {
                Toast.success("成功", 1);
                this.ajaxGetCustomers(); //重新获取本页数据
            } else {
                Toast.info(res.message, 1);
            }
        }
        //新增或编辑某个联系人
        this.handleAddCustomer = (res) => {
            if (res.success) {
                Toast.success("成功", 1);
                this.ajaxGetCustomers(); //重新获取本页数据
                this.setState({ showInputModal: false})
            } else {
                Toast.info(res.message, 1);
            }
        }
    }
    componentDidMount() {
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 30;
        const scroll = new BScroll(document.querySelector('.wrapper'), { click: true, pullUpLoad: { threshold: -50 }, bounceTime: 300, swipeBounceTime: 200 })
        this.setState({
            height: hei,
            scroll,
        })
        scroll.on('pullingUp', () => {
            this.ajaxNextPage();
        });
        this.ajaxGetCustomers();
        if (this.props.location.query && this.props.location.query.form) {
            this.setState({
                location_form: this.props.location.query.form
            })
        }
    }
    ajaxNextPage = () => {
        let hasNextPage = false;

        let offset = this.state.contactsList.length;
        if (offset < this.state.total_count) {
            hasNextPage = true;
        }

        this.setState({
            scroll_bottom_tips: hasNextPage ? "加载中..." : "加载完成"
        })

        if (hasNextPage) {
            setTimeout(() => {
                this.ajaxGetCustomers(10, offset, true);
            }, 500);
        }
    }
    shouldComponentUpdate() {
        return this.props.router.location.action === 'POP';
    }
    //获取联系人列表
    ajaxGetCustomers = (limit = 10, offset = 0, pullingUp = false) => {
        runPromise('getCustomers', {
            offset,
            limit,
        }, this.handleGetCustomers, true, "post", pullingUp);
    }
    handleClickItem(value) {
        // hashHistory.replace({
        //     pathname: '/createOffer',
        //     query: { form: 'contacts' },
        //     state: { customer: value  }
        // });
        let { location_form } = this.state;
        if (location_form == "CreateOffer") {
            this.props.setSelectedCustomer(value);
            hashHistory.goBack();
        }
        if (location_form == "mine") {
            if (value.yunLinkPhone) {
                this.callPhone(value.yunLinkPhone);
            }
        }
    }
    //编辑联系人
    handleEdit() {
        let { yunLinkName, yunLinkPhone, yunLinkCompany, yunLinkEmail } = this.state;
        if (this.testName(yunLinkName) && this.testPhone(yunLinkPhone) && this.testCompany(yunLinkCompany) && this.testEmail(yunLinkEmail)) {
            this.ajaxAddCustomer(yunLinkName, yunLinkPhone, yunLinkCompany, yunLinkEmail);
        }
    }
    //新增或删除联系人
    ajaxAddCustomer = (linkName, linkPhone, linkCompany, linkEmail) => {
        runPromise('addCustomer', {
            linkName, 
            linkPhone, 
            linkCompany, 
            linkEmail
        }, this.handleAddCustomer);
    }
    //删除联系人
    handleDelete(customer_id, yunLinkName) {
        Modal.alert('删除联系人', `确定删除${yunLinkName}吗?`, [
            { text: '取消', onPress: () => {} },
            { text: '删除', onPress: () => this.ajaxDelCustomer(customer_id) },
        ])
    }
    ajaxDelCustomer = (customer_id) => {
        runPromise('delCustomer', { customer_id }, this.handleDelCustomer);
    }
    //打开弹窗
    openModal = (data) => {
        if (data) {
            //编辑联系人
            // this.setState({ InputModalData: data}, ()=>{
            //     this.setState({ showInputModal: true })
            // })
            this.setState({
                showInputModal: true, 
                yunLinkName: data.yunLinkName,
                yunLinkPhone: data.yunLinkPhone, 
                yunLinkCompany: data.yunLinkCompany,
                yunLinkEmail: data.yunLinkEmail,
            })
        } else {
            //新增联系人
            this.setState({ showInputModal: true })
        }
    }
    //校验联系人姓名
    testName(val) {
        if (!(/^.{2,20}$/.test(val))) {
            Toast.info("联系人姓名错误！", 1);
            return false;
        } else {
            return true;
        }
    }
    //校验手机号
    testPhone(val) {
        if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(val))) {
            Toast.info("手机号错误！", 1);
            return false;
        } else {
            return true;
        }
    }
    //校验公司
    testCompany(val) {
        if (!(/^.{2,20}$/.test(val))) {
            Toast.info("公司名称错误！", 1);
            return false;
        } else {
            return true;
        }
    }
    //校验邮箱
    testEmail(val) {
        if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val))) {
            Toast.info("邮箱错误！", 1);
            return false;
        } else {
            return true;
        }
    }
    //原生APP，打电话
    callPhone(phone) {
        if (window.api) {
            //APP处理
            window.api.call({
                type: 'tel_prompt',
                number: phone
            });
        } else {
            //H5页面处理
        }
    }
    render() {
        return (
            
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div className="contacts-page" style={{ ...interpolatingStyle, position: "relative" }}>
                        <NavBar
                            className="add-server-nav-bar top"
                            mode="light"
                            icon={<Icon type="left" />}
                            onLeftClick={() => hashHistory.goBack()}
                            leftContent={<span style={{ fontSize: "15px" }}>返回</span>}
                            rightContent={
                                [<i className="iconfont icon-tianjiajiahaowubiankuang" style={{ color: "#A8A8A8", marginRight: "3px" }}></i>,
                                <span onClick={() => { this.openModal() }} style={{ color: "#000", fontSize: "14px" }}>新增</span>]
                            }
                        >{this.state.location_form == "CreateOffer" ? "选择联系人" : "我的联系人"}</NavBar>
                        <div style={{
                            backgroundColor: '#F5F5F9',
                            height: "3px",
                            borderTop: '1px solid #ECECED',
                            borderBottom: '1px solid #ECECED',
                        }}></div>
                        <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                            <List className="contacts-list">
                                {
                                    this.state.contactsList.map((value, index) => (
                                        <SwipeAction
                                            className="contacts-swipe"
                                            key={value.id}
                                            autoClose
                                            right={[
                                                {
                                                    text: '编辑',
                                                    onPress: () => this.openModal(value),
                                                    style: { backgroundColor: '#56B949', fontSize: '16px', color: 'white', padding: '0 8px' },
                                                },
                                                {
                                                    text: '删除',
                                                    onPress: () => this.handleDelete(value.customer_id, value.yunLinkName),
                                                    style: { backgroundColor: '#F4333C', fontSize: '16px', color: 'white', padding: '0 8px' },
                                                },
                                            ]}
                                        // onOpen={() => null}
                                        // onClose={() => null}
                                        >
                                            <List.Item
                                                key={value.id}
                                                // arrow="horizontal"
                                                extra={<i style={{ "font-size": "20px" }} className="iconfont icon-jiantou2"></i>}
                                                onClick={() => this.handleClickItem(value)}
                                            >
                                                {value.yunLinkName + '/' + value.yunLinkCompany}<List.Item.Brief> <i className="iconfont icon-dianhua"></i> {value.yunLinkPhone}</List.Item.Brief>
                                            </List.Item>
                                        </SwipeAction>
                                    ))
                                }
                                <div className="scroll-bottom-tips">{this.state.scroll_bottom_tips}</div>
                            </List>
                        </div>
                        <Modal
                            className="contacts-modal"
                            visible={this.state.showInputModal}
                            transparent
                            maskClosable={false}
                            onClose={() => { this.setState({ 
                                showInputModal: false, 
                                yunLinkName: '', //联系人弹窗，名字
                                yunLinkPhone: '', //联系人弹窗，手机号 
                                yunLinkCompany: '', //联系人弹窗，公司
                                yunLinkEmail: '', //联系人弹窗，邮箱
                                }) 
                            }}
                            // title={this.state.yunLinkName ? `编辑：${this.state.yunLinkName}` : "新增联系人"}
                            title="新增联系人"
                            footer={[
                                { text: '取消', onPress: () => { this.setState({ 
                                    showInputModal: false, 
                                    yunLinkName: '', //联系人弹窗，名字
                                    yunLinkPhone: '', //联系人弹窗，手机号 
                                    yunLinkCompany: '', //联系人弹窗，公司
                                    yunLinkEmail: '', //联系人弹窗，邮箱 
                                    }) 
                                }},
                                { text: '确定', onPress: () => { this.handleEdit() } }
                            ]}
                        >
                            <InputItem
                                className="recharge-input one"
                                type="string"
                                placeholder="请输入联系人"
                                maxLength="15"
                                value={this.state.yunLinkName}
                                onChange={(val) => { val = val.trim(); this.setState({ yunLinkName: val }) }}
                                onBlur={(val) => { this.testName(val) }}
                                clear
                            >
                                <i className="iconfont icon-lianxiren"></i>
                            </InputItem>
                            <InputItem
                                className="recharge-input"
                                type="tel"
                                pattern="[0-9]*"
                                placeholder="请输入手机号"
                                maxLength="15"
                                value={this.state.yunLinkPhone}
                                onChange={(val) => { val = val.trim(); this.setState({ yunLinkPhone: val }) }}
                                onBlur={(val) => { this.testPhone(val) }}
                                clear
                            >
                                <i className="iconfont icon-dianhua"></i>
                            </InputItem>
                            <InputItem
                                className="recharge-input"
                                type="text"
                                placeholder="请输入企业名称"
                                maxLength="20"
                                value={this.state.yunLinkCompany}
                                onChange={(val) => { val = val.trim(); this.setState({ yunLinkCompany: val }) }}
                                onBlur={(val) => { this.testCompany(val) }}
                                clear
                            >
                                <i className="iconfont icon-gongsixinxi"></i>
                            </InputItem>
                            <InputItem
                                className="recharge-input four"
                                type="text"
                                placeholder="请输入邮箱"
                                maxLength="20"
                                value={this.state.yunLinkEmail}
                                onChange={(val) => { val = val.trim(); this.setState({ yunLinkEmail: val }) }}
                                onBlur={(val) => { this.testEmail(val) }}
                                clear
                            >
                                <i className="iconfont icon-duanxin"></i>
                            </InputItem>
                        </Modal>
                    </div>
                }
            </Motion>
        )
    }
}