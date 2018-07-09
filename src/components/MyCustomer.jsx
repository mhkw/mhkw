import React from 'react';
import { hashHistory } from 'react-router';
import { Toast, NavBar, Icon, List, SearchBar, SwipeAction, Modal, WingBlank, TextareaItem, Button } from 'antd-mobile';
import { Motion, spring } from 'react-motion';
import BScroll from 'better-scroll';

export default class MyCustomer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			search: '',
			longitude: "",
			latitude: "",
			address: "",
			contactsList: sessionStorage.getItem("customerList") ? JSON.parse(sessionStorage.getItem("customerList")) : [],
			scroll: null, //滚动插件实例化对象
			scroll_bottom_tips: "", //上拉加载的tips
			total_count: 0, //总数量
			popupRecord: false, //是否显示弹窗，添加记录
			click_customer_id: "", // 选择的客户ID
			click_name: "", // 选择的客户名称
			recordInfo: "", //给某个客户添加记录的内容
		}
		//获取我的客户列表
		this.handleGetCustomerList = (res, pullingUp) => {
			if (res.success) {
				let newItemList = this.state.contactsList;
				if (pullingUp) {
					// newItemList.push(res.data.item_list);
					newItemList = [...this.state.contactsList, ...res.data.item_list];
				} else {
					newItemList = res.data.item_list;
					if (newItemList.length < 1) {
						return;
					}
					sessionStorage.setItem("customerList", JSON.stringify(newItemList));
				}

				this.setState({
					contactsList: newItemList,
					total_count: res.data.total_count,
					scroll_bottom_tips: newItemList.length == 10 ? "上拉加载更多" : ""
				}, () => {
					this.state.scroll.finishPullUp()
					this.state.scroll.refresh();
				})

			} else {
				Toast.info(res.message, 1.5);
			}
		}
		this.handleCustomerDelete = (res) => {
			if (res.success) {
				Toast.success("成功", 1);
				this.ajaxGetCustomerList(); //重新获取本页数据 这个做法不好，太粗狂了，按理说应该是删除指定的state
			} else {
				Toast.info(res.message || "删除失败", 1.5);
			}
		}
		this.handleAddContactHistory = (res) => {
			if (res.success) {
				Toast.info("添加记录成功", 1.5);
				this.onCloseRecord(); //关闭弹出层

			} else {
				Toast.info(res.message || "添加记录失败", 1.5);
			}
		}
	}
	componentDidMount() {
		let searchBar = document.querySelector('.search-bar');
		const hei = document.documentElement.clientHeight - searchBar.offsetHeight - searchBar.offsetTop;
		const scroll = new BScroll(document.querySelector('.wrapper'), { click: true, pullUpLoad: { threshold: -50 }, bounceTime: 300, swipeBounceTime: 200 })
		this.setState({
			height: hei,
			scroll,
		})
		scroll.on('pullingUp', () => {
			this.ajaxNextPage();
		});
		this.ajaxGetCustomerList();
		if (this.props.state && this.props.state.Address) {
			let { lat: latitude, lon: longitude, address } = this.props.state.Address;
			this.setState({ latitude, longitude, address });
		}
	}
	//获取联系人列表
	ajaxGetCustomerList = (limit = 10, offset = 0, keyword = "", pullingUp = false) => {
		let user_id = validate.getCookie("user_id");
		if (!user_id) {
			hashHistory.push({
				pathname: '/login',
				query: { form: 'MyCustomer' }
			});
			return;
		}
		let { latitude, longitude } = this.state;
		runPromise('get_customer_list2', {
			user_id,
			longitude,
			latitude,
			offset,
			limit,
			keyword,
		}, this.handleGetCustomerList, true, "post", pullingUp);
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
				this.ajaxGetCustomerList(10, offset, '', true);
			}, 100);
		}
	}
	shouldComponentUpdate() {
		return this.props.router.location.action === 'POP';
	}
	newAdd = () => {
		console.log("新增");
	}
	callPhone(phone, customer_Id) {
		this.setState({ click_customer_id: customer_Id},()=>{
			this.submitRecord("拨打电话");
		})
		if (window.api) {
			//移动端
			window.api.call({
				type: 'tel_prompt',
				number: phone
			});
		} else {
			//H5端
			window.location.href = "tel:" + phone;
		}
	}
	onSearch = () => {
		let { search } = this.state;
		console.log("onSearch::", search);
	}
	callDelete(customer_id, Name) {
		Modal.alert('删除客户', `确定删除${Name}吗？`, [
			{ text: '取消', onPress: () => { } },
			{ text: '确定', onPress: () => this.ajaxCustomerDelete(customer_id) }
		]);
	}
	ajaxCustomerDelete(customerId) {
		let user_id = validate.getCookie("user_id");
		if (!user_id) {
			hashHistory.push({
				pathname: '/login',
				query: { form: 'MyCustomer' }
			});
			return;
		}
		runPromise('change_customer_set', {
			user_id,
			customerId,
			show_in_linker: 0
		}, this.handleCustomerDelete);
	}
	getRangeDiff(distance) {
		var distance = distance - 0;
		var km = 1000;
		var kkm = km * 1000;
		var kmC = distance / km;
		var kkmC = distance / kkm;
		if (kkmC >= 1) {
			return kkmC.toFixed(0) + "千公里";
		} else if (kmC >= 1) {
			return kmC.toFixed(1) + "公里";
		} else {
			return distance.toFixed(0) + "米";
		}
		return;
	}
	handlerAddRecord(customer_id, Name) {
		this.setState({ 
			click_customer_id: customer_id,
			click_name: Name,
			popupRecord: true,
		 });
	}
	onCloseRecord = () => {
		this.setState({
			click_customer_id: '',
			click_name: '',
			recordInfo: '',
			popupRecord: false,
		});
	}
	submitRecord = (message) => {
		let { click_customer_id, recordInfo } = this.state;
		let contactInfo = recordInfo.trim() || message || "";
		if (!contactInfo.length) {
			Toast.info("请输入记录内容", 1.5);
			return;
		}
		if (!click_customer_id) {
			Toast.info("请选择一个客户", 1.5);
			return;
		}
		this.ajaxAddContactHistory(click_customer_id, contactInfo);
	}
	ajaxAddContactHistory(customerId, contactInfo) {
		let user_id = validate.getCookie("user_id");
		if (!user_id) {
			hashHistory.push({
				pathname: '/login',
				query: { form: 'MyCustomer' }
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
	render() {
		return (
			<Motion defaultStyle={{ left: 300 }} style={{ left: spring(0, { stiffness: 300, damping: 28 }) }}>
				{interpolatingStyle =>
					<div style={{ ...interpolatingStyle, position: "relative" }} className="my-customer-page">
						<NavBar
							className="NewNavBar top"
							mode="light"
							icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
							onLeftClick={() => hashHistory.goBack()}
							rightContent={<span className="new-add-btn" onClick={this.newAdd}>新增</span>}
						>我的客户</NavBar>
						<SearchBar
							className="search-bar"
							placeholder="请输入姓名或者手机号查询"
							maxLength={15}
							value={this.state.search}
							onChange={(val)=>{ this.setState({ search: val }) }}
							onCancel={() => { this.setState({ search: '' }) }}
							onClear={() => { this.setState({ search: '' }) }}
							onSubmit={this.onSearch}
						/>
						<div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
							<List className="contacts-list">
								{
									this.state.contactsList.map((value, index) => (
										<SwipeAction
											className="customer-swipe"
											key={value.id}
											autoClose
											right={[
												{
													text: '删除',
													onPress: this.callDelete.bind(this, value.customer_id, value.Name),
													style: { backgroundColor: '#EE4035', color: '#fff', fontSize: '16px', padding: '0 5px' },
												},
												{
													text: '记录',
													onPress: this.handlerAddRecord.bind(this, value.customer_id, value.Name),
													style: { backgroundColor: '#1875ff', color: '#fff', fontSize: '16px', padding: '0 5px' },
												},
												{
													text: '电话',
													onPress: this.callPhone.bind(this, value.customer_id, value.phone),
													style: { backgroundColor: '#56B949', color: '#fff', fontSize: '16px', padding: '0 5px' },
												}
											]}
										>
											<List.Item
												key={value.id}
												// arrow="horizontal"
												extra={<i style={{ "font-size": "20px" }} className="iconfont icon-jiantou2"></i>}
												onClick={() => this.handleClickItem(value)}
											>
												{(value.Name ? value.Name : "") + '/' + (value.companyname ? value.companyname : "")}
												<List.Item.Brief>
													{value.address_type == "company" ? <i className="iconfont icon-iconset0190"></i> : <i className="iconfont icon-fangzi"></i>}
													{' ' + (value.distance ? this.getRangeDiff(value.distance) : "") + ' ' + (value.long_lat_address ? value.long_lat_address : "")}
												</List.Item.Brief>
											</List.Item>
										</SwipeAction>
									))
								}
								<div className="scroll-bottom-tips" style={{ "background-color":"#f5f5f9"}}>{this.state.scroll_bottom_tips}</div>
							</List>
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
										添加{this.state.click_name}记录
										<i onClick={this.onCloseRecord} className="iconfont icon-untitled94"></i>
									</div>
								)}>
								<WingBlank size="md">
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