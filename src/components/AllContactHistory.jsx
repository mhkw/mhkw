import React from 'react';
import { hashHistory } from 'react-router';
import { Toast, NavBar, Icon, List, SearchBar, SwipeAction, Modal, WingBlank, TextareaItem, Button } from 'antd-mobile';
import { Motion, spring } from 'react-motion';
import BScroll from 'better-scroll';

import update from 'immutability-helper';

export default class AllContactHistory extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			customerId: null,
			contactHistoryList: sessionStorage.getItem("contactHistoryList") ? JSON.parse(sessionStorage.getItem("contactHistoryList")) : [],
			scroll: null, //滚动插件实例化对象
			scroll_bottom_tips: "", //上拉加载的tips
			total_count: 0, //总数量
		}
		//获取客户记录列表
		this.handleGetContactHistory = (res, pullingUp) => {
			if (res.success) {
				let newItemList = this.state.contactHistoryList;
				if (pullingUp) {
					// newItemList.push(res.data.item_list);
					// newItemList = [...this.state.contactHistoryList, ...res.data.contactHistoryList];
					newItemList = update(this.state.contactHistoryList, { $push: res.data.contactHistoryList } );
				} else {
					newItemList = res.data.contactHistoryList;
					if (newItemList.length >= 1) {
						sessionStorage.setItem("contactHistoryList", JSON.stringify(newItemList));
					}
				}

				this.setState({
					contactHistoryList: newItemList,
					total_count: res.data.total_historys,
					scroll_bottom_tips: newItemList.length == 10 ? "上拉加载更多" : ""
				}, () => {
					this.state.scroll.finishPullUp()
					this.state.scroll.refresh();
				})

			} else {
				Toast.info(res.message, 1.5);
			}
		}
	}
	componentWillMount() {
		if (this.props.location.query && this.props.location.query.customer_id) {
			let customerId = this.props.location.query.customer_id;
			this.setState({ customerId });
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
		this.ajaxGetContactHistory();
	}
	ajaxGetContactHistory(offset = 0, pullingUp = false, limit = 10) {
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
		}, this.handleGetContactHistory, true, "get", pullingUp);
	}
	ajaxNextPage = () => {
		let hasNextPage = false;

		let offset = this.state.contactHistoryList.length;
		if (offset < this.state.total_count) {
			hasNextPage = true;
		}

		this.setState({
			scroll_bottom_tips: hasNextPage ? "加载中..." : "加载完成"
		})

		if (hasNextPage) {
			setTimeout(() => {
				this.ajaxGetContactHistory(offset, true);
			}, 100);
		}
	}
	openOperation(remark) {
		Modal.operation([
			{ text: remark, onPress: () => { } }
		])
	}
	shouldComponentUpdate() {
		return this.props.router.location.action === 'POP';
	}
	render() {
		return (
			<Motion defaultStyle={{ left: 300 }} style={{ left: spring(0, { stiffness: 300, damping: 28 }) }}>
				{interpolatingStyle =>
					<div style={{ ...interpolatingStyle, position: "relative" }} className="all-contact-history-page">
						<NavBar
							className="NewNavBar top"
							mode="light"
							icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
							onLeftClick={() => hashHistory.goBack()}
							leftContent="所有客户记录"
						></NavBar>
						<div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
							<div>
								<List>
								{
									this.state.contactHistoryList.map((value, index) => (
										<List.Item
											key={value.id}
											onClick={value.remark.length >= 16 ? this.openOperation.bind(this, value.remark) : () => { }}
										>
											{value.remark}
											<List.Item.Brief>{value.add_time}</List.Item.Brief>
										</List.Item>
									))
								}
								</List>
								<div className="scroll-bottom-tips" style={{ "background-color": "#f5f5f9" }}>{this.state.scroll_bottom_tips}</div>
							</div>
						</div>
					</div>
				}
			</Motion>
		)
	}
}