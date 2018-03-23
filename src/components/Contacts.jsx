import React from 'react';
import { NavBar, Icon, Toast, List, Button, SwipeAction, Modal, InputItem} from 'antd-mobile';
import { hashHistory } from 'react-router';
import QueueAnim from 'rc-queue-anim';

export default class Contacts extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            contactsList: [],
            showInputModal: false, //编辑或新增联系人的弹窗，是否打开
            // InputModalData: null, //编辑或新增联系人的弹窗，里面的内容，每次关闭弹窗时都设为null
            yunLinkName: '', //联系人弹窗，名字
            yunLinkPhone: '', //联系人弹窗，手机号 
            yunLinkCompany: '', //联系人弹窗，公司
            yunLinkEmail: '', //联系人弹窗，邮箱
        }
        //获取联系人列表
        this.handleGetCustomers = (res) => {
            if (res.success) {
                this.setState({
                    contactsList: res.data.item_list
                })
            } else {
                Toast.info(res.message, 1);
            }
        }
        //删除某个联系人
        this.handleDelCustomer = (res) => {
            if (res.success) {
                this.ajaxGetCustomers(); //重新获取本页数据
            } else {
                Toast.info(res.message, 1);
            }
        }
        //新增或编辑某个联系人
        this.handleAddCustomer = () => {
            if (res.success) {
                this.ajaxGetCustomers(); //重新获取本页数据
                this.setState({ showInputModal: false})
            } else {
                Toast.info(res.message, 1);
            }
        }
    }
    componentDidMount() {
        this.ajaxGetCustomers();
    }
    shouldComponentUpdate() {
        return this.props.router.location.action === 'POP';
    }
    //获取联系人列表
    ajaxGetCustomers = (offset = 0, limit = 10) => {
        runPromise('getCustomers', {
            offset,
            limit,
        }, this.handleGetCustomers);
    }
    handleClickItem(value) {
        // hashHistory.replace({
        //     pathname: '/createOffer',
        //     query: { form: 'contacts' },
        //     state: { customer: value  }
        // });
        this.props.setSelectedCustomer(value);
        hashHistory.goBack();
    }
    //编辑联系人
    handleEdit() {
        let { yunLinkName, yunLinkPhone, yunLinkCompany, yunLinkEmail } = this.state;
        if (this.testName(yunLinkName) && this.testPhone(yunLinkPhone) && this.testCompany(yunLinkCompany) && this.testEmail(yunLinkEmail)) {
            this.ajaxAddCustomer(yunLinkName, yunLinkPhone, yunLinkCompany, yunLinkEmail);
        }
    }
    //新增或删除联系人
    ajaxAddCustomer = (yunLinkName, yunLinkPhone, yunLinkCompany, yunLinkEmail) => {
        runPromise('addCustomer', {
            yunLinkName, 
            yunLinkPhone, 
            yunLinkCompany, 
            yunLinkEmail
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
    render() {
        return (
            <QueueAnim 
                className="demo-content" 
                leaveReverse
                animConfig={[
                    { opacity: [1, 0], translateX: [0, 50] }
                ]}>
                <div className="contacts-page" key="0">
                    <NavBar
                        className="add-server-nav-bar"
                        mode="light"
                        icon={<Icon type="left" />}
                        onLeftClick={() => hashHistory.goBack()}
                        leftContent={<span style={{ fontSize: "15px" }}>返回</span>}
                        rightContent={
                            [<i className="iconfont icon-tianjiajiahaowubiankuang" style={{ color: "#A8A8A8", marginRight: "3px" }}></i>,
                            <span onClick={() => { this.openModal() }} style={{ color: "#000", fontSize: "14px" }}>新增</span>]
                        }
                    >联系人</NavBar>
                    <div style={{
                        backgroundColor: '#F5F5F9',
                        height: "3px",
                        borderTop: '1px solid #ECECED',
                        borderBottom: '1px solid #ECECED',
                    }}></div>
                    <List className="contacts-list">
                    {
                        this.state.contactsList.map((value,index)=>(
                            <SwipeAction
                                className="contacts-swipe"
                                autoClose
                                right={[
                                    {
                                        text: '编辑',
                                        onPress: () => this.openModal(value),
                                        style: { backgroundColor: '#56B949',fontSize: '16px', color: 'white', padding: '0 8px' },
                                    },
                                    {
                                        text: '删除',
                                        onPress: () => this.handleDelete(value.customer_id, value.yunLinkName),
                                        style: { backgroundColor: '#F4333C',fontSize: '16px', color: 'white', padding: '0 8px' },
                                    },
                                ]}
                                onOpen={() => console.log('global open')}
                                onClose={() => console.log('global close')}
                            >
                                <List.Item
                                    key={value.id}
                                    arrow="horizontal"
                                    onClick={() => this.handleClickItem(value)}
                                >
                                    {value.yunLinkName + '/' + value.yunLinkCompany}<List.Item.Brief> <i className="iconfont icon-dianhua"></i> {value.yunLinkPhone}</List.Item.Brief>
                                </List.Item>
                            </SwipeAction>
                        ))
                    }
                    </List>
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
            </QueueAnim>
        )
    }
}