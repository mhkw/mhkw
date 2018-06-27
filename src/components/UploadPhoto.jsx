import React from 'react'
import { hashHistory } from 'react-router'
import { NavBar, ImagePicker, List, Icon, TextareaItem, WingBlank, Toast, Modal } from 'antd-mobile'
import { Motion, spring } from 'react-motion';

export default class UploadPhoto extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			NavBarTitle: "选择封面"
		}
	}
	nextStep = () => {
		this.openImagePickerOld();
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
		}, function (ret) {
			if (ret) {
				alert(JSON.stringify(ret));
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
						<div className="bottom-scroll-box">
							<div className="am-image-picker-item">
								<div className="am-image-picker-item-remove" role="button" aria-label="Click and Remove this image"></div>
								<img className="am-image-picker-item-content file" src={require("../images/avatar.png")} />
							</div>
							<div className="am-image-picker-item">
								<div className="am-image-picker-item-remove" role="button" aria-label="Click and Remove this image"></div>
								<img className="am-image-picker-item-content file" src={require("../images/avatar.png")} />
							</div>
							<div className="am-image-picker-item">
								<div className="am-image-picker-item-remove" role="button" aria-label="Click and Remove this image"></div>
								<img className="am-image-picker-item-content file" src={require("../images/avatar.png")} />
							</div>
							<div 
								className="am-image-picker-item am-image-picker-upload-btn"
								onTouchStart={(e) => { e.target.style.backgroundColor = "#ddd" }}
                                onTouchEnd={(e) => { e.target.style.backgroundColor = "#fff" }}
                                onClick={ this.clickAddPhoto } 
							></div>
						</div>
					</div>
				}
			</Motion>
		)
	}
}