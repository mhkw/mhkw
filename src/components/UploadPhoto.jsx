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
		
	}
	clickGoBack = () => {
		hashHistory.goBack();
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
							<div className="am-image-picker-item am-image-picker-upload-btn"></div>
						</div>
					</div>
				}
			</Motion>
		)
	}
}