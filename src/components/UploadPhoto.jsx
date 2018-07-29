import React from 'react'
import { hashHistory } from 'react-router'
import { NavBar, ImagePicker, List, Icon, TextareaItem, WingBlank, Toast, Modal, Progress } from 'antd-mobile'
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
	let template = document.querySelectorAll('.pswp')[0];
	let options = {
		index: 0,
		modal: false,
		pinchToClose: false,
		closeOnScroll: false,
		closeOnVerticalDrag: false,
		showAnimationDuration: 0,
		hideAnimationDuration: 0,
		history: false,
	}
	let gallery = new PhotoSwipe(template, PhotoSwipeUI_Default, items, options);
	gallery.listen('updateScrollOffset', function (_offset) {
		var r = template.getBoundingClientRect();
		_offset.x += r.left;
		_offset.y += r.top;
	});
	gallery.init();
	if (items.length > 0 && items[0].src) {
		gallery.bg.style.backgroundColor = "#333";
	} else {
		gallery.bg.style.backgroundColor = "#fff";
		//将背景设置成灰色
		document.querySelector(".upload-photo-page").style.backgroundColor = "#fff";
	}
	
}


// let imgDemo = [
// 	require("../images/temp/two.jpg"),
// 	require("../images/temp/one.jpg"),
// 	require("../images/temp/three.jpg"),
// ];

export default class UploadPhoto extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			NavBarTitle: "选择封面",
			photoList: [
				// {
				// 	path: imgDemo[0],
				// 	thumbPath: imgDemo[0],
				// 	naturalWidth: 0,
				// 	naturalHeight: 0,
				// },
				
			],
			galleryIndex: 0, //PhotoSwipe索引，记住上次的索引，避免多次点击用一个图片
			scrollHeight: 0,
			scroll: null,
			uploadIng: false, //是否正在上传中，这个状态用于是否允许用户点击下一步
		}
		this.props.router.setRouteLeaveHook(
			this.props.route,
			this.routerWillLeave
		)
	}
	componentDidMount() {
		let wrapper = document.querySelector(".wrapper");
		let photoListLength = (parseInt(this.state.photoList.length) + 1);
		this.setScrollWidth(photoListLength); 
		const scroll = new BScroll(wrapper, {
			startX: 0,
			click: true,
			scrollX: true,
			scrollY: false,
			eventPassthrough: 'vertical',
			bounceTime: 300, 
			momentum: true,
			swipeBounceTime: 200, 
		});
		this.setState({ scroll });
		
		// const scroll = new BScroll(wrapper, { scrollX: true, scrollY: false, click: true, bounceTime: 300, swipeBounceTime: 200, momentumLimitTime: 200 })

		//初始化加载HOC组件上的photoList
		if (this.props.state && this.props.state.photoList && this.props.state.photoList.length > 0 ) {
			let { photoList } = this.props.state;
			this.setState({ photoList },()=>{
				//如果图片列表有图片，需要更新滚动组件
				if (this.state.scroll) {
					this.state.scroll.refresh();
				}
			});
		}
	}
	/**
	 * 动态的计算滚动条的宽度
	 *
	 * @author ZhengGuoQing
	 * @param {number} [length=0] 照片列表长度加上一个添加照片按钮的长度
	 * @returns
	 * @memberof UploadPhoto
	 */
	setScrollWidth(length = 0) {
		if (length < 4) {
			return;
		}
		// let tabItemAdd = document.querySelector(".tab-item-add");
		let tabItemAdd = document.querySelector(".am-image-picker-item"); 
		let tabWrapper = document.querySelector(".tab-wrapper");
		let itemswidth = 0;
		let oneItemWidth = tabItemAdd.getBoundingClientRect().width;//getBoundingClientRect() 返回元素的大小及其相对于视口的位置
		itemswidth = oneItemWidth * length;
		tabWrapper.style.width = itemswidth + 'px';
		
		if (this.state.scroll) {
			this.state.scroll.refresh();
		}

	}
	nextStep = () => {
		if (this.state.uploadIng) {
			Toast.info("上传图片中，请稍后...", 1);
			return;
		}
		let { photoList } = this.state;
		photoList.map((value, index, elem) => {
			//剔除上传失败的，得到一个全新的，上传进度100%的图片数组，该数组可能和本地显示的图片数组不一致，本地会显示上传失败的图片
			if (!value.progress || !value.progress >= 100) {
				elem.splice(index, 1);
			}
		})
		if (photoList.length > 0) {
			this.props.setState({ photoList },()=>{
				hashHistory.push({
					pathname: '/creatWork2',
					query: { form: 'uploadPhoto' }
				});
			})
		} else {
			Toast.info("请至少上传一张图片", 1);
		}
		

	}
	clickGoBack = () => {
		hashHistory.goBack();
	}
	routerWillLeave = (nextLocation) => {
		// console.log(nextLocation)
		// return false;
		let { pathname } = nextLocation;
		let { photoList } = this.state;
		if (pathname != "/creatWork2" && photoList.length > 0 && this.deleteAllPhotoAndLeave) {
			Modal.alert('确认返回吗?', '返回将删除已上传照片', [
				{ text: '取消', onPress: () => { }, style: 'default' },
				{ text: '确定', onPress: () => this.deleteAllPhotoAndLeave() },
			]);
			hashHistory.go(1);
			return false;
		} else {
			return true;
		}
	}
	//此时应该是state里存在已经上传的图片信息，需要删除图片，然后离开router
	deleteAllPhotoAndLeave() {
		this.props.setState({ photoList: [] }); //情况父组件的图片列表
		this.setState({
			photoList: [],
			deleteAllPhotoAndLeave: true,
		},()=>{
			hashHistory.goBack();
		})
	}
	clickAddPhoto = () => {
		this.openImagePicker();	
	}
	openImagePicker = () => {
		let uploadImageIndex = this.state.photoList.length; //上传图片的起始点为上次图片列表的长度
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

					let photoListLength = (parseInt(photoList.length) + 1);
					this.setScrollWidth(photoListLength); //更新横向滚动条宽度

					this.setState({ photoList },()=>{
						//上传图片
						this.uploadImages(uploadImageIndex);
					});
					//抛出photoList，用于调试
					window.photoList = photoList;
				} else {
					//android
					const photoList = update(this.state.photoList, { $push: ret.list });

					let photoListLength = (parseInt(photoList.length) + 1);
					this.setScrollWidth(photoListLength); //更新横向滚动条宽度

					this.setState({ photoList },()=>{
						//上传图片
						this.uploadImages(uploadImageIndex);
					});
					//抛出photoList，用于调试
					window.photoList = photoList;
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
	onLoadPreview = (e, index, path) => {
		// console.log(index);
		
		////获取照片原图的尺寸宽等信息
		if (!window.imageFilter) {
			//先不返回，先在网页上测试
			let { naturalWidth, naturalHeight } = e.target;
			this.setPhotoAttr(index, naturalWidth, naturalHeight);
			return;
		}
		window.imageFilter.getAttr({
			path: path
		}, (ret, err) => {
			if (ret.status) {
				let { width, height } = ret;
				this.setPhotoAttr(index, width, height);
			}
		});
	}
	setPhotoAttr = (index, naturalWidth, naturalHeight ) => {
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
			this.setState({ galleryIndex: 0});
			//将背景设置成灰色
			document.querySelector(".upload-photo-page").style.backgroundColor = "#333";
		}
		let photoList = update(this.state.photoList, { [index]: { naturalWidth: { $set: naturalWidth }, naturalHeight: { $set: naturalHeight } } });
		this.setState({ photoList });
		//抛出photoList，用于调试
		window.photoList = photoList;
	}
	clickPhoto = (index, type = "click") => {
		let {galleryIndex} = this.state;
		if (galleryIndex == index) {
			return;
		} else if (type == "click") {
			this.setState({ galleryIndex: index});
		}
		let photo = this.state.photoList[index];
		if (photo) {
			let { naturalWidth, naturalHeight, path } = photo;
			let item = [{
				w: naturalWidth,
				h: naturalHeight,
				src: path,
			}];
			openPhotoSwipe(item);
		} else {
			//此时没有图片，应该不显示图片了。
			this.setState({ galleryIndex: -1});
			let item = [{
				w: '',
				h: '',
				src: '',
			}];
			openPhotoSwipe(item);
		}
		
	}
	clickDeletePhoto = (event, index) => {
		event.stopPropagation(); //阻止事件冒泡
		this.clickPhoto(index, "click");
		Modal.alert('删除照片', '确定删除该照片吗?', [
			{ text: '取消', onPress: () => { }, style: 'default' },
			{ text: '确定', onPress: () => this.UIDeletePhoto(index) },
		]);
	}
	UIDeletePhoto(index) {
		//先判断是否需要转移PhotoSwipe显示的图片，如果PhotoSwipe显示的和删除的是同一张图片，PhotoSwipe往左移动一张
		let { galleryIndex } = this.state;
		if (galleryIndex == index && index > 0) {
			this.clickPhoto(index - 1, "delete");
			this.setState({ galleryIndex: index - 1 });
		}
		if (galleryIndex != index && index > 0) {
			this.setState({ galleryIndex: --galleryIndex });
		}
		if (galleryIndex == index && index == 0) {
			this.clickPhoto(index + 1, "delete");
			this.setState({ galleryIndex: 0 });
		}
		const photoList = update(this.state.photoList, { $splice: [[[index], 1]] });
		this.setState({ photoList });

		let photoListLength = (parseInt(photoList.length) + 1);
		this.setScrollWidth(photoListLength); //更新横向滚动条宽度

		//抛出photoList，用于调试
		window.photoList = photoList;
	}
	//上传图片
	uploadImages(i = 0) {
		if (!window.api) {
			return;
		}
		let { photoList } = this.state;
		if ((photoList.length <= i && photoList.length > 0) || i > 100) {
			this.setState({ uploadIng: false })
			return;
		} else {
			//开始上传
			if (this.state.uploadIng == false) {
				this.setState({ uploadIng: true })
			}
		}
		let { path } = photoList[i];
		window.api.ajax({
			url: 'https://www.huakewang.com/upload/upload_images_for_mobile',
			method: 'POST',
			dataType: 'JSON',
			// headers: { 'Content-Type': 'multipart/form-data' },
			// headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			report: true,
			data: {
				values: {
					'alt': ''
				},
				files: {
					Filedata: path
				}
			}
		}, (ret, err) => {
			if (ret.status == "0") {
				//上传中
				// console.log(JSON.stringify(ret));
				let { progress: pr } = ret;
				this.setPhotoProgress(i, (pr ? pr : 0));
			}
			if (ret.status == "1") {
				//上传完成
				// console.log(JSON.stringify(ret));
				if (ret.body) {
					if (ret.body.success) {
						let { id, file_path } = ret.body.data;
						let photoList = update(this.state.photoList, { [i]: { id: { $set: id }, file_path: { $set: file_path } } });
						this.setState({ photoList });
						//抛出photoList，用于调试
						window.photoList = photoList;

						//更新单个图片的上传进度，索引为i的这个图片，上传成功 
						this.setPhotoProgress(i, 100);
						//上传下一张
						i++;
						this.uploadImages(i);

					} else {
						Toast.info(res.message, 1.5);
					}
				} else {
					Toast.info('请求错误', 1.5);
				}
			}
			if (ret.status == "2") {
				//上传失败
				// console.log(JSON.stringify(ret));

				//更新单个图片的上传进度，索引为i的这个图片，上传失败，进度设置为-1 ，表示上传失败
				this.setPhotoProgress(i, -1);

				//上传下一张
				i++;
				this.uploadImages(i);
			}
			if (err) {
				this.setState({ uploadIng: false }); //发生错误，此时会暂停所有上传图片的流程（递归）。
				if (err.msg) {
					api.alert({ msg: err.msg });
				}
			}
		});
	}
	/**
	 * 设置某个图片的上传进度
	 *
	 * @author ZhengGuoQing
	 * @param {number} [i=0] 图片的索引，即顺序
	 * @param {number} [newProgress=0] 新的进度为多少，最小为0 ，最大为100，表示上传成功
	 * @memberof UploadPhoto
	 */
	setPhotoProgress(i = 0, newProgress = 0) {
		const photoList = update(this.state.photoList, { [i]: { progress: { $set: newProgress } } });
		this.setState({ photoList });
		//抛出photoList，用于调试
		window.photoList = photoList;
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
							<div className="tab-wrapper" style={{"min-width":"100vw"}}>
								{
									this.state.photoList.map((value, index) => (
										<div 
											className="am-image-picker-item"
											onClick={() => { this.clickPhoto(index) }}
										>
											<div onClick={(e) => { this.clickDeletePhoto(e, index) }} className="am-image-picker-item-remove" role="button" aria-label="Click and Remove this image"></div>
											<img className="am-image-picker-item-content file" src={value.thumbPath} onLoad={(e) => { this.onLoadPreview(e, index, value.path) }} />
											<div className="progress-box">
												
												{
													value.progress > 0 && value.progress < 100 ?
														<Progress percent={100} position="normal" /> : null
												}
												{
													!value.progress ? <div className="wait-upload">等待上传</div> : null
												}
												{
													value.progress < 0 ? <div className="wait-upload">上传失败</div> : null
												}
												{
													value.progress >= 100 ? <div className="wait-upload">上传成功</div> : null
												}
											</div>
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