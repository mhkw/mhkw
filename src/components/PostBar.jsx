import React from 'react'
import { NavBar, Icon, List, InputItem, PullToRefresh, ListView, Carousel, WingBlank, TextareaItem, Toast } from 'antd-mobile';
import { Link, hashHistory } from 'react-router';

import update from 'immutability-helper';
import { Motion, spring } from 'react-motion';

const loginUrl = {
	"selec": require('../images/selec.png'),
}

let realData = [];
// let index = realData.length - 1;
let realDataLength = realData.length;

// const NUM_ROWS = 7;
let NUM_ROWS = 5;
let pageIndex = 0;

export default class PostBar extends React.Component {
    constructor(props){
		super(props)
		const dataSource = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		this.state = {
			page: "1",
			imgHeight: 176,
			slideIndex: 0,
			// dataSource: dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("resdata")) ? JSON.parse(sessionStorage.getItem("resdata")) : []),
			dataSource: dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("resdata")) ? JSON.parse(sessionStorage.getItem("resdata")) : {}),
			refreshing: false,
			isLoading: true,
			useBodyScroll: true,
			showReplyInput: false,       //输入框显示
			res: [],
			love_list: [],
			placeholderWords: "留言：",
			commentToId: "",        //发帖人id
			commentId: "",         //文章id
			content: "",
			keyCode: "-1",            //索引
			sendBtnStatus: false,       //留言
			replySendStatus: false,    //回复还是留言
			rep_user_id: "",     //被回复人的id
			comment_id: "",      //回复的回复id
			replay_name: "",     //给..回复
			showBackToTop: false,
		}
		this.genData = (pIndex = 0, NUM_ROWS, data) => {
			const dataBlob = {};
			for (let i = 0; i < NUM_ROWS; i++) {
				const ii = (pIndex * NUM_ROWS) + i;
				dataBlob[`${ii}`] = data[i];
			}
			return dataBlob;
		}
		this.handleSend = (res) => {
			if (res.success) {
				realData = res.data.item_list;
				index = realData.length - 1;
				realDataLength = res.data.item_list.length;
				NUM_ROWS = realDataLength;
				// if (pageIndex == 0) {
				//     this.rData = [];
				//     this.rData = [ ...this.rData, ...this.genData(pageIndex++, realDataLength, realData) ];
				//     sessionStorage.setItem("resdata", JSON.stringify(realData));
				// }else{
				//     this.rData = [ ...this.rData, ...this.genData(pageIndex++, realDataLength, realData) ];
				// }
				if (pageIndex == 0) {
					this.rData = {};
					this.rData = { ...this.rData, ...this.genData(pageIndex++, realDataLength, realData) };
					sessionStorage.setItem("resdata", JSON.stringify(realData));
				} else {
					this.rData = { ...this.rData, ...this.genData(pageIndex++, realDataLength, realData) };

					let storageFstdata = sessionStorage.getItem("resdata");
					if (storageFstdata && JSON.parse(storageFstdata).length > 0) {
						realData = [...JSON.parse(storageFstdata), ...realData];
						sessionStorage.setItem("resdata", JSON.stringify(realData));

					}
				}
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(this.rData),
					hasMore: res.data.is_next_page ? true : false,
					isLoading: res.data.is_next_page ? true : false,
					page: ++this.state.page,
					// res: this.state.dataSource.cloneWithRows(this.rData)._dataBlob.s1,
				});
				setTimeout(() => {
					this.setState({
						refreshing: false
					})
				}, 300);
			} else {
				console.log(res);
			}
		}
		this.addheartlis = (res, para) => {   //点赞
			if (res.success) {
				let numStar = para.e.target.parentNode.children[1].innerText;
				let loveLis = this.state.res[para.idx].love_list;
				if (res.message.type == 'delete') {
					loveLis.map((value, index) => {
						if (res.message.nick_name == value.nick_name) {
							loveLis.splice(index, 1);
						}
					})
					para.e.target.style.color = "#333";
					para.e.target.nextSibling.innerHTML = numStar - 1;
					let newList = update(this.state.res, { [para.idx]: { love_list: { $set: loveLis } } });
					this.setState({ res: newList })
				} else if (res.message.type == 'add') {
					para.e.target.style.color = "#F95231";
					para.e.target.nextSibling.innerHTML = numStar - 0 + 1;
					loveLis.push(res.message);
					let newList = update(this.state.res, { [para.idx]: { love_list: { $set: loveLis } } });
					this.setState({ res: newList })
				}
			}
		}
		this.addcommentlis = (req) => {
			if (req.success) {
				let wrap = document.createElement("div");
				let domLi = document.createElement('li');
				let innerSpan = document.createElement('span');
				let innerI = document.createElement('i');
				if (!this.state.replySendStatus) {        //回复
					innerSpan.innerHTML = decodeURIComponent(validate.getCookie('user_name')) + '回复:' + this.state.replay_name;
					innerI.innerHTML = this.state.content;
					domLi.appendChild(innerSpan);
					domLi.appendChild(innerI);
					wrap.appendChild(domLi);
					let currentLi = document.getElementById("rowid" + this.state.keyCode);
					currentLi.appendChild(wrap);
				} else {                           //留言
					innerSpan.innerHTML = req.data.nick_name;
					innerI.innerHTML = req.data.comment_content;
					domLi.appendChild(innerSpan);
					domLi.appendChild(innerI);
					wrap.appendChild(domLi);
					let currentLi = document.getElementById("rowid" + this.state.keyCode);
					currentLi.appendChild(wrap);
				}
			}
		}
	}
	componentDidUpdate() {
		if (this.state.useBodyScroll) {
			document.body.style.overflow = 'auto';
		} else {
			document.body.style.overflow = 'hidden';
		}
	}
	
	render() {
		return (
			<Motion defaultStyle={{ left: 300 }} style={{ left: spring(0, { stiffness: 300, damping: 28 }) }}>
				{interpolatingStyle =>
					<div style={{ ...interpolatingStyle, position: "relative", height: this.state.height }}>
						<div className="forgetNav">
							<NavBar
								mode="light"
								className="top"
								icon={<Icon type="left" size="lg" color="#707070" />}
								onLeftClick={() => hashHistory.goBack()}
							>帖子</NavBar>
						</div>
					</div>
				}
			</Motion>
		)
	}
}