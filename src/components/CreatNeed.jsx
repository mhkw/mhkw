import React from 'react'
import { hashHistory } from 'react-router'
import { NavBar, ImagePicker, List, Icon, TextareaItem, WingBlank, Modal,Button} from 'antd-mobile'
import { Line, Jiange } from './templateHomeCircle';

const Item = List.Item;
const Brief = Item.Brief;

export default class CreatNeed extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            content:"",
            files: []
        }
    }
    componentDidMount(){
        this.autoFocusInst.focus();
    }
    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    }
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }
    onSelectPic = (files, type, index) => {
        console.log(files, type, index);
        this.setState({
            files,
            modal1:false
        });
    }
    render(){
        return (
            <div className="needWrap">
                <div className="forgetNav" key="1">
                    <NavBar
                        mode="light"
                        icon={<Icon type="left" size="lg" color="#707070" />}
                        onLeftClick={() => hashHistory.goBack()}
                        rightContent={
                            <span>确定</span>
                        }
                    >发布需求</NavBar>
                </div>
                <div style={{ height: "1.2rem" }}></div>                
                <div className="needDes">
                    <TextareaItem
                        // {...getFieldProps('count', {
                        //     initialValue: '计数功能,我的意见是...',
                        // })}
                        placeholder="请填写您的需求..."
                        ref={el => this.autoFocusInst = el}
                        autoHeight
                        rows={5}
                        count={200}
                        value={this.state.content}
                        onChange={(value)=>{this.setState({content:value})}}
                    />
                </div>
                <div className="needPics">
                    <WingBlank>
                        <ImagePicker
                            files={this.state.files}
                            onChange={this.onSelectPic}
                            onImageClick={(index, fs) => console.log(index, fs)}
                            selectable={this.state.files.length < 20}
                            accept="image/gif,image/jpeg,image/jpg,image/png"
                            multiple={true}
                        />
                    </WingBlank>
                </div>
                <div className="needLists">
                    <List>
                        <Line border="line"></Line>
                        <Item
                            onClick={() => {  }}
                            arrow="horizontal"
                            extra="杭州市 西湖区 转塘"
                        >地点
                        </Item>
                        <Line border="line"></Line>
                        <Jiange name="jianGe"></Jiange>
                        <Line border="line"></Line>
                        <Item
                            onClick={() => { }}
                            arrow="horizontal"
                            extra="插画设计"
                        >领域
                        </Item>
                        <Line border="line"></Line>
                        <Jiange name="jianGe"></Jiange>
                        <Line border="line"></Line>
                        <Item
                            onClick={this.showModal('modal1')}
                            arrow="horizontal"
                            extra="一万元以内"
                        >预算
                        </Item>
                        <Line border="line"></Line>
                    </List>
                </div>
                <Modal
                    visible={this.state.modal1}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose('modal1')}
                    title={<p>选择您的预算 <i className="iconfont icon-chuyidong1-copy fn-right" onClick={() => { 
                        this.onClose('modal1')()}}></i>
                    </p>}
                    className="modalNeedPrice"
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <ul className="needPriceLists">
                        <Line border="line"></Line>
                        <li>当面商谈</li>
                        <Line border="line"></Line>
                        <li>一万元以内</li>
                        <Line border="line"></Line>
                        <li>五万元以内</li>
                        <Line border="line"></Line>
                        <li>十万以内</li>
                        <Line border="line"></Line>
                        <li>十五万以内</li>
                        <Line border="line"></Line>
                    </ul>
                    
                </Modal>
            </div>
        )
    }
}