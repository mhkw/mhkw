import React from 'react'
import { hashHistory } from 'react-router'
import { NavBar, ImagePicker, List, Icon, TextareaItem, WingBlank, Toast, Modal } from 'antd-mobile'
import { Motion, spring } from 'react-motion';
import update from 'immutability-helper';
import BScroll from 'better-scroll';

import { PhotoSwipeItem2 as PhotoSwipeItem} from './photoSwipeElement.jsx';
import '../js/photoswipe/photoswipe.css';
import '../js/photoswipe/default-skin/default-skin.css';
import PhotoSwipe from '../js/photoswipe/photoswipe.min.js';
import PhotoSwipeUI_Default from '../js/photoswipe/photoswipe-ui-default.min.js';

// let PhotoSwipeOptions = {
// 	index: 0,
// 	modal: false,
// 	pinchToClose: false,
// 	closeOnScroll: false,
// 	closeOnVerticalDrag: false,
// 	showAnimationDuration: 0,
// 	hideAnimationDuration: 0,
// 	history: false,
// 	getThumbBoundsFn: function (index) {
// 		// rect was the original bounds
// 		var rect = { x: 0, y: 0, w: 50 };
		
// 		var templateBounds = document.querySelectorAll('.pswp')[0].parentElement.getBoundingClientRect();
// 		rect.x -= templateBounds.left;
// 		rect.y -= templateBounds.top;
		
// 		return rect;
// 	}
// }

let openPhotoSwipe = function (items) {
	let pswpElement = document.querySelectorAll('.pswp')[0];
	let options = {
		index: 0,
		modal: false,
		pinchToClose: false,
		closeOnScroll: false,
		closeOnVerticalDrag: false,
		showAnimationDuration: 0,
		hideAnimationDuration: 0,
		history: false
	}
	let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
	gallery.init();
	gallery.bg.style.backgroundColor = "#333";
}


let imgDemo = [
	require("../images/temp/two.jpg"),
	require("../images/temp/psu.jpg"),
	require("../images/temp/one.jpg"),
	require("../images/temp/two.jpg"),
	require("../images/temp/psu.jpg"),
	require("../images/temp/one.jpg"),
];

export default class UploadPhoto extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			NavBarTitle: "选择封面",
			photoList: [
				{
					path: imgDemo[0],
					thumbPath: imgDemo[0],
					naturalWidth: 0,
					naturalHeight: 0,
				},
				
			],
			galleryIndex: 0, //PhotoSwipe索引，记住上次的索引，避免多次点击用一个图片
			scrollHeight: 0,
		}
	}
	componentDidMount() {
		let wrapper = document.querySelector(".wrapper");
		this.setScrollWidth(); 
		const scroll = new BScroll(wrapper, {
			startX: 0,
			click: true,
			scrollX: true,
			scrollY: false,
			eventPassthrough: 'vertical',
			bounceTime: 300, 
			momentum: true,
			swipeBounceTime: 200, 
		})
		
		// const scroll = new BScroll(wrapper, { scrollX: true, scrollY: false, click: true, bounceTime: 300, swipeBounceTime: 200, momentumLimitTime: 200 })
	}
	setScrollWidth() {
		// let tabItemAdd = document.querySelector(".tab-item-add");
		let tabItemAdd = document.querySelector(".am-image-picker-item"); 
		let tabWrapper = document.querySelector(".tab-wrapper");
		let itemswidth = 0;
		let oneItemWidth = tabItemAdd.getBoundingClientRect().width;//getBoundingClientRect() 返回元素的大小及其相对于视口的位置
		itemswidth = oneItemWidth * (parseInt(this.state.photoList.length) +1 );
		tabWrapper.style.width = itemswidth + 'px';
		
	}
	nextStep = () => {

	}
	clickGoBack = () => {
		hashHistory.goBack();
	}
	clickAddPhoto = () => {
		this.openImagePicker();	
	}
	openImagePicker = () => {
		//打开图片选择器，打开后会全屏显示
		if (!window.UIMediaScanner ) {
			return;
		}
		window.UIMediaScanner.open({
			type: 'picture',
			column: 4,
			classify: true,
			max: 9,
			texts: {
				stateText: '已选择*项',
				cancelText: '取消',
				finishText: '完成',
				classifyTitle:'相册' 
			},
			styles: {
				bg: '#fff',
				mark: {
					icon: '',
					position: 'top_right',
					size: 26
				},
				nav: {
					bg: '#fff',
					stateColor: 'rgb(85, 85, 85)',
					stateSize: 16,
					cancelBg: 'rgba(0,0,0,0)',
					cancelColor: 'rgb(85, 85, 85)',
					cancelSize: 16,
					finishBg: 'rgba(0,0,0,0)',
					finishColor: 'rgb(85, 85, 85)',
					finishSize: 16
				}
			},
			exchange: true,
			showPreview: false,
			showBrowser: true
		}, (ret) => {
			if (ret.eventType == "confirm") {
				if (ret.list.length <= 0) {
					//如果没有值直接返回
					return;
				}
				if (/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
					//iOS
					let originPhotoList = ret.list; //先拿到原始的图片数组，然后iOS经过transPath转换路径,然后覆盖原始的路径
					originPhotoList.map((value, index, array)=>{
						window.UIMediaScanner.transPath({
							path: value.path
						}, (res, err) => {
							if (res) {
								//覆盖原始的路径
								array[index].path = res.path;
							}
						});
					});
					const photoList = update(this.state.photoList, { $push: originPhotoList });
					this.setState({ photoList });
				} else {
					//android
					const photoList = update(this.state.photoList, { $push: ret.list });
					this.setState({ photoList });
				}

			}
		});
	}
	openImagePickerOld = () => {
		//打开图片选择器，打开后会全屏显示
		if (!window.UIAlbumBrowser) {
			return;
		}
		window.UIAlbumBrowser.imagePicker({
			max: 9,
			mark: {
				position: 'top_right',
				size: 20
			},
			styles: {
				bg: '#FFFFFF',
				nav: {
					bg: '#fff',
					cancelColor: 'rgb(85, 85, 85);',
					cancelSize: 16,
					nextStepColor: 'rgb(85, 85, 85);',
					nextStepSize: 16
				}
			},
			animation: true,
		}, (ret) => {
			console.log(JSON.stringify(ret))
			if (ret.eventType == 'nextStep') {
				window.UIAlbumBrowser.closePicker();
			}
		});
	}
	onLoadPreview = (e, index) => {
		let naturalWidth = e.target.naturalWidth;
		let naturalHeight = e.target.naturalHeight;
		if (index == 0) {
			//初始化PhotoSwipe
			let item = [{
				w: naturalWidth,
				h: naturalHeight,
				src: this.state.photoList[0].path,
			}];
			// let template = document.querySelectorAll('.pswp')[0];
			// let gallery = new PhotoSwipe(template, PhotoSwipeUI_Default, item, PhotoSwipeOptions);
			// gallery.init();
			// gallery.bg.style.backgroundColor = "#333";
			// this.setState({ gallery });
			openPhotoSwipe(item);
			//将背景设置成灰色
			document.querySelector(".upload-photo-page").style.backgroundColor = "#333";
		}
		let photoList = update(this.state.photoList, { [index]: { naturalWidth: { $set: naturalWidth }, naturalHeight: { $set: naturalHeight } } });
		this.setState({ photoList });
	}
	clickPhoto = (index) => {
		let {galleryIndex} = this.state;
		if (galleryIndex == index) {
			return;
		} else {
			this.setState({ galleryIndex: index});
		}
		let { naturalWidth, naturalHeight, path } = this.state.photoList[index]
		let item = [{
			w: naturalWidth,
			h: naturalHeight,
			src: path,
		}];
		openPhotoSwipe(item);
		
		// // this.state.gallery.items[0] = item[0];
		// this.state.gallery.items.push(item);
		// // this.state.gallery.items.splice(0,1);
		// // this.state.gallery.items.shift();
		// // this.state.gallery.currItem = 0;
		// this.state.gallery.invalidateCurrItems();
		// this.state.gallery.updateSize(true);
		// this.state.gallery.ui.update()
	}
	render() {
		return (
			<Motion defaultStyle={{ left: 300 }} style={{ left: spring(0, { stiffness: 300, damping: 28 }) }}>
				{interpolatingStyle =>
					<div className="upload-photo-page" style={{ ...interpolatingStyle, position: "relative" }}>
						<NavBar
							style={{ "border-bottom":"1px solid #c7c7c7" }}
							mode="light"
							icon={<Icon type="left" size="lg" color="#707070" />}
							onLeftClick={this.clickGoBack}
							rightContent={
								<span style={{"color":"#555"}} onClick={this.nextStep}>下一步</span>
							}
						>{this.state.NavBarTitle}</NavBar>
						<div className="origin-img-box">
							<PhotoSwipeItem />
						</div>
						<div className="bottom-scroll-box wrapper">
							<div className="tab-wrapper">
								{
									this.state.photoList.map((value, index) => (
										<div 
											className="am-image-picker-item"
											onClick={() => { this.clickPhoto(index) }}
										>
											<div className="am-image-picker-item-remove" role="button" aria-label="Click and Remove this image"></div>
											<img className="am-image-picker-item-content file" src={value.thumbPath} onLoad={(e) => { this.onLoadPreview(e, index) }} />
										</div>
									))
								}
								<div 
									className="am-image-picker-item am-image-picker-upload-btn"
									onTouchStart={(e) => { e.target.style.backgroundColor = "#ddd" }}
									onTouchEnd={(e) => { e.target.style.backgroundColor = "#fff" }}
									onClick={ this.clickAddPhoto } 
								></div>
							</div>
						</div>
					</div>
				}
			</Motion>
		)
	}
}