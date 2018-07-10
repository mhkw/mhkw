import React from 'react';
import { hashHistory } from 'react-router';
import { Toast, NavBar, Icon, List, InputItem, SearchBar, SwipeAction, Modal, WingBlank, TextareaItem, Button } from 'antd-mobile';
import { Motion, spring } from 'react-motion';
import BScroll from 'better-scroll';

import update from 'immutability-helper';

export default class AddCustomer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			navBarTitle: "",
			selectedCustomer: {}, //客户详情，由于这个数据最先开始是从HOC组件传递过来的，在这个组件上就没有把Customer的属性拆分,设置新的属性setState时用ES6的Object.assign
			customerId: null,
			Name: "", //姓名
			Phone: "", //手机
			Company: "", //公司名称
			company_long_lat_address: "", //单位地址
			company_longitude: "", //单位地址经度
			company_latitude: "", //单位地址纬度
			company_address_detail: "", //单位地址详细
			home_long_lat_address: "", //家庭地址
			home_longitude: "", //家庭地址经度
			home_latitude: "", //家庭地址纬度
			home_address_detail: "", //家庭地址详细
			remark: "", //备注
			contactHistoryList: [], //联系记录历史
			recordInfo: '', //记录内容
			popupRecord: false, //是否显示弹窗，添加记录
			latitude: "", // 用户此时所在地位置,纬度
			longitude: "", // 用户此时所在地位置,经度
			address: "", // 用户此时所在地位置
			form: "addCustomer", //上一个路由参数form,用于知道该页面从哪里来的。
		}
		this.handleAddContactHistory = (res) => {
			if (res.success) {
				Toast.info("添加记录成功", 1.5);
				this.onCloseRecord(); //关闭弹出层
				//更新最新记录
			} else {
				Toast.info(res.message || "添加记录失败", 1.5);
			}
		}
		this.handleGetCustomerInfo = (res) => {
			if (res.success) {
				//渲染页面数据
				let { name, phone, companyname, company_address, home_address, remark } = res.data;
				this.setState({
					Name: name, //姓名
					Phone: phone, //手机
					Company: companyname, //公司名称
					company_long_lat_address: company_address.long_lat_address, //单位地址
					company_longitude: company_address.longitude, //单位地址经度
					company_latitude: company_address.latitude, //单位地址纬度
					company_address_detail: company_address.long_lat_address_jd, //单位地址详细
					home_long_lat_address: home_address.long_lat_address, //家庭地址
					home_longitude: home_address.longitude, //家庭地址经度
					home_latitude: home_address.latitude, //家庭地址纬度
					home_address_detail: home_address.long_lat_address_jd, //家庭地址详细
					remark: remark, //备注
				})
			} else {
				Toast.info(res.message, 1.5);
			}
		}
		this.handleGetContactHistory = (res) => {
			if (res.success) {
				//渲染客户记录，拜访历史
				this.setState({
					contactHistoryList: res.data.contactHistoryList
				})
			} else {
				Toast.info(res.message, 1.5);
			}
		}
	}
	saveCustomer = () => {
		console.log("保存")
	}
	getNewStateFromProps(props) {
		if (props.location.query && props.location.query.form && props.state && props.state.selectedCustomer) {
			let form = props.location.query.form;
			if (form == "seeCustomer") {
				// let newSelectedCustomer = Object.assign(this.state.selectedCustomer, props.state.selectedCustomer);
				// const newState = update(this.state, { selectedCustomer: { $merge: props.state.selectedCustomer } });
				// this.setState(newState);
				let { customer_id: customerId, Name, phone: Phone, companyname: Company } = props.state.selectedCustomer;
				this.setState({ customerId, Name, Phone, Company, form});
				if (!this.state.customerId && props.location.query && props.location.query.customer_id) {
					let customerId = props.location.query.customer_id;
					this.setState({ customerId });
				}
			}
		}

	}
	componentWillMount() {
		this.getNewStateFromProps(this.props);
	}
	componentWillReceiveProps(nextProps) {
		this.getNewStateFromProps(nextProps);
	}
	componentDidMount() {
		const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 30;
		const scroll = new BScroll(document.querySelector('.wrapper'), { click: true, pullUpLoad: { threshold: -50 }, bounceTime: 300, swipeBounceTime: 200 })
		this.setState({
			height: hei,
			scroll,
		})
		if (this.props.state && this.props.state.Address) {
			let { lat: latitude, lon: longitude, address } = this.props.state.Address;
			this.setState({ latitude, longitude, address });
		}
		if (this.state.form == "seeCustomer") {
			this.ajaxGetCustomerInfo();
			this.ajaxGetContactHistory();
		}
	}
	// onChangeCustomer(key, val) {
	// 	const newState = update(this.state, { selectedCustomer: { [key]: { $set: val } } });
	// 	this.setState(newState);
	// }
	testPhone(val) {
		if (!(/^1(3|4|5|7|8)\d{9}$/.test(val))) {
			Toast.info("手机号错误!", 1);
			return false;
		} else {
			return true;
		}
	}
	onCloseRecord = () => {
		this.setState({
			recordInfo: '',
			popupRecord: false,
		});
	}
	submitRecord = (message) => {
		let { customerId, recordInfo } = this.state;
		let contactInfo = recordInfo.trim() || message || "";
		if (!contactInfo.length) {
			Toast.info("请输入记录内容", 1.5);
			return;
		}
		if (!customerId) {
			Toast.info("请选择一个客户", 1.5);
			return;
		}
		this.ajaxAddContactHistory(customerId, contactInfo);
	}
	ajaxAddContactHistory(customerId, contactInfo) {
		let user_id = validate.getCookie("user_id");
		if (!user_id) {
			hashHistory.push({
				pathname: '/login',
				query: { form: 'AddCustomer' }
			});
			return;
		}
		let { latitude, longitude, address } = this.state;
		runPromise('add_contact_history', {
			user_id,
			customerId,
			contactInfo,
			longitude,
			latitude,
			long_lat_address: address
		}, this.handleAddContactHistory);
	}
	ajaxGetCustomerInfo() {
		let customer_id = this.state.customerId;
		let user_id = validate.getCookie("user_id");
		if (!user_id) {
			hashHistory.push({
				pathname: '/login',
				query: { form: 'AddCustomer' }
			});
			return;
		}
		runPromise('getCustomerInfo', {
			customer_id,
			user_id,
		}, this.handleGetCustomerInfo, true, "get");
	}
	ajaxGetContactHistory(offset = 0, limit = 5) {
		let customer_id = this.state.customerId;
		let user_id = validate.getCookie("user_id");
		if (!user_id) {
			hashHistory.push({
				pathname: '/login',
				query: { form: 'AddCustomer' }
			});
			return;
		}
		runPromise('get_contact_history', {
			customer_id,
			user_id,
			keyword: "all",
			offset,
			limit,
		}, this.handleGetContactHistory, true, "get");
	}
	openOperation(remark) {
		Modal.operation([
			{ text: remark, onPress: () => {} }
		])
	}
	render() {
		return (
			<Motion defaultStyle={{ left: 300 }} style={{ left: spring(0, { stiffness: 300, damping: 28 }) }}>
				{interpolatingStyle =>
					<div style={{ ...interpolatingStyle, position: "relative" }} className="add-customer-page">
						<NavBar
							className="NewNavBar top"
							mode="light"
							icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
							onLeftClick={() => hashHistory.goBack()}
							rightContent={<span className="new-add-btn" onClick={this.saveCustomer}>保存</span>}
						>{this.state.Name ? `修改${this.state.Name}信息` : "新增联系人"}</NavBar>
						<div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
							<div>
								<List>
									<InputItem
										type="string"
										value={this.state.Name}
										onChange={(val) => { this.setState({ Name: val.trim() }) }}
										placeholder=""
										maxLength="8"
										clear
									>姓名</InputItem>
									<InputItem
										type="number"
										value={this.state.Phone}
										onChange={(val) => { this.setState({ Phone: val.trim() }) }}
										placeholder=""
										maxLength="15"
										onBlur={(val) => { this.testPhone(val) }}
										clear
									>手机号</InputItem>
									<InputItem
										type="string"
										value={this.state.Company}
										onChange={(val) => { this.setState({ Company: val.trim() }) }}
										placeholder=""
										maxLength="20"
										clear
									>公司</InputItem>
								</List>
								<List renderHeader={<span><i className="iconfont icon-iconset0190"></i>单位地址</span>}>
									<List.Item extra={<i className="iconfont icon-dizhi"></i>}>{this.state.company_long_lat_address}</List.Item>
									<InputItem
										type="string"
										value={this.state.company_address_detail}
										onChange={(val) => { this.setState({ company_address_detail: val.trim() }) }}
										placeholder="详细地址"
										maxLength="20"
										clear
									></InputItem>
								</List>
								<List renderHeader={<span><i className="iconfont icon-fangzi"></i>家庭地址</span>}>
									<List.Item extra={<i className="iconfont icon-dizhi"></i>}>{this.state.home_long_lat_address}</List.Item>
									<InputItem
										type="string"
										value={this.state.home_address_detail}
										onChange={(val) => { this.setState({ home_address_detail: val.trim() }) }}
										placeholder="详细地址"
										maxLength="20"
										clear
									></InputItem>
								</List>
								<List renderHeader='备注'>
									<TextareaItem
										value={this.state.remark}
										onChange={(val) => { this.setState({ remark: val }) }}
										placeholder="添加备注..."
										rows={4}
										clear
									/>
								</List>
								<List
									className="contact-history-list"
									style={{ display: this.state.form == "seeCustomer" ? "block" : "none" }}
									renderHeader={
										<div>
											<span className="header-left">记录</span>
											<span onClick={() => { this.setState({ popupRecord: true }) }} className="header-right look-all">查看全部<i className="iconfont icon-jiantou1"></i></span>
											<span onClick={() => { this.setState({ popupRecord: true }) }} className="header-right">添加记录</span>
										</div> 
									}
								>
									{
										this.state.contactHistoryList.map((value,index)=>(
											<List.Item 
												key={value.id}
												onClick={value.remark.length >= 16 ?  this.openOperation.bind(this, value.remark) : ()=>{}}
											>
												{value.remark}
												<List.Item.Brief>{value.add_time}</List.Item.Brief>
											</List.Item>
										))
									}
								</List>
							</div>
						</div>
						<Modal
							popup
							visible={this.state.popupRecord}
							onClose={this.onCloseRecord}
							animationType="slide-up"
						>
							<List
								className="popup-list"
								renderHeader={() => (
									<div className="add-record-header">
										添加{this.state.Name}记录
										<i onClick={this.onCloseRecord} className="iconfont icon-untitled94"></i>
									</div>
								)}>
								<WingBlank size="md" className="add-record-wing-blank">
									<TextareaItem
										onChange={(val) => { this.setState({ recordInfo: val }) }}
										placeholder=""
										autoFocus
										rows={4}
									/>
								</WingBlank>
								<List.Item>
									<Button type="primary" onClick={this.submitRecord}>确定</Button>
								</List.Item>
							</List>
						</Modal>
					</div>
				}
			</Motion>
		)
	}
}