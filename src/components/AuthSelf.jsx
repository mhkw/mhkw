import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, InputItem, List, Modal, WhiteSpace, WingBlank, Tag, Accordion, Radio, Picker, Button  } from "antd-mobile";

// import { district } from 'antd-mobile-demo-data';
import { cityData } from '../js/cityData';

//经验数据
const experienceData = [
        {
            label: '1年',
            real_value: '1',
            value: 0,
        },{
            label: '2年',
            real_value: '2',
            value: 1,
        }, {
            label: '3年',
            real_value: '3',
            value: 2,
        }, {
            label: '4年',
            real_value: '4',
            value: 3,
        }, {
            label: '5-10年',
            real_value: '5',
            value: 4,
        }, {
            label: '10年以上',
            real_value: '10',
            value: 5,
        },
    ];

//学历数据
const educationData = [
    {
        label: '专科',
        value: '专科',
    }, {
        value: '本科',
        label: '本科',
    }, {
        label: '硕士',
        value: '硕士',
    }, {
        label: '博士',
        value: '博士',
    }, {
        label: '高中',
        value: '高中',
    },
];

export default class AuthSelf extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            experienceIndex: '-1',
            AccordionIsOpen_type: false, //用户类型的手风琴开关状态
            AccordionIsOpen: false,//性别的手风琴开关状态
            type: '', //用户类型，1：个人，2团体，不做修改时为空 
            real_name: '', //真实姓名
            sex: "",
            job_name: '',
            experience: '', //经验
            education: '', //学历
            school: '',
            province: '', //省
            city: '', //市
            area: '', //区
            address: '', //详细地址
            lon: '', // 经度
            lat: '', //纬度
            customLabels: '', //用户标签，多个标签用英文分号(;)隔开。
            customLabelsArray: [], //用户标签，处理后的数组
            cityPickerValue: [], //三级地址选择后获取的组件原始值
            experiencePickerValue: [], //经验选择后获取的组件原始值
            educationPickerValue: [], //学历选择后获取的组件原始值
        }
    }
    //切换性别的手风琴开关状态
    changeAccordionOpenStatus = () => {
        this.setState({
            AccordionIsOpen: !this.state.AccordionIsOpen
        })
    }
    //切换用户类型的手风琴开关状态
    changeAccordionOpenStatusType = () => {
        this.setState({
            AccordionIsOpen_type: !this.state.AccordionIsOpen_type
        })
    }
    //设置经验数据的索引
    setExperienceIndex = () => {
        let { experience } = this.state;
        if (experience > 5) {
            experience = 6;
        }
        this.setState({ experienceIndex: experience - 1 })
    }
    componentWillMount() {
        // this.setExperienceIndex();
        
        this.setSelfAddr();
        this.getSelfInfo(this.props);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.Self && nextProps.Self.real_name) {
            this.getSelfInfo(nextProps);
        }
    }
    //切换三级地址组件
    changeCityPicker = (val) => {
        this.setState({
            cityPickerValue: val,
            province: val[0], //省
            city: val[1], //市
            area: val[2], //区
        })
    }
    /**
     * 认证用户填写地址，此时的动作为地图选点，目的是获得经纬度
     * 
     * @memberof AuthSelf
     * @param address_type 如果为home或company则为修改。如果为common则为删除
     */
    clickChangeSelfAddr = () => {
        // console.log("地图选点", address_type)
        hashHistory.push({
            pathname: '/baiduMap',
            query: {
                form: 'AddressAuthSelf',
            }
        });
    }
    //通过props拿到百度地图上选择的地址后写入自己的state
    setSelfAddr = () => {
        if (this.props.HOCState && this.props.HOCState.AddressAuthSelf && this.props.HOCState.AddressAuthSelf.address) {
            let { address, lat, lon } = this.props.HOCState.AddressAuthSelf;
            this.setState({ address, lat, lon })
        }
    }
    //点击右上角保存按钮
    clickSave = () => {
        let { type, real_name, sex, job_name, experience, education, school, province, city, area, address, lon, lat, customLabels } = this.state;
        this.props.ajaxChangeUserInfo({ type, real_name, sex, job_name, experience, education, school, province, city, area, address, longitude: lon, latitude: lat, customLabels })
    }
    //点击添加新的标签
    addLabel = (value) => {
        console.log(value);
        let { customLabels, customLabelsArray } = this.state;
        if (customLabels && customLabels.length > 0) {
            customLabels += ";" + value;
        } else {
            customLabels += value;
        }
        // customLabelsArray.push(value);

        this.props.propsSetState("Self", {
            customLabels,
        });
        this.props.ajaxChangeCustomLabels(customLabels)
    }
    clickAddLabel = () => {
        Modal.prompt('新标签', '', [
            { text: '取消' },
            { text: '确定', onPress: value => this.addLabel(value) },
        ], 'default', '')
    }
    //关闭某个标签
    closeLabel = (index) => {
        
        let { customLabels, customLabelsArray } = this.state;
        customLabelsArray.splice(index, 1);
        customLabels = customLabelsArray.join(";");
        
        // this.setState({
        //     customLabels,
        // });
        this.props.propsSetState("Self", {
            customLabels,
        });
        this.props.ajaxChangeCustomLabels(customLabels)
    }
    getSelfInfo = (props) => {
        if (props.Self && props.Self.real_name) {
            let { type, real_name, sex, job_name, experience, education, school, province, city, area, address, longitude: lon, latitude: lat, customLabels } = props.Self;
            
            if (props.HOCState && props.HOCState.AddressAuthSelf && props.HOCState.AddressAuthSelf.address) {
                lat = props.HOCState.AddressAuthSelf.lat;
                lon = props.HOCState.AddressAuthSelf.lon;
                address = props.HOCState.AddressAuthSelf.address;
            }

            let cityPickerValue = [province, city, area];
            let educationPickerValue = [education];

            let customLabelsArray = [];
            if (customLabels && customLabels.length > 0) {
                customLabelsArray = customLabels.split(";");
            }
            
            let newState = { type, real_name, sex, job_name, experience: parseInt(experience) , education, school, province, city, area, address, lon, lat, customLabels };
            this.setState({ ...this.state, ...newState, cityPickerValue, educationPickerValue, customLabelsArray}, () => { this.setExperienceIndex();});
        }
    }
    render() {
        return (
            <div className="auth-self-page designer-auth-page" key="1">
                <NavBar
                    className="new-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                    rightContent={<Button className="rechargeButton" onClick={this.clickSave}>保存</Button>}
                >个人信息</NavBar>
                <WhiteSpace size="md" />
                <List>
                    <Accordion className="perfect-info-accordion" activeKey={this.state.AccordionIsOpen_type ? "1" : "0"} onChange={() => { this.changeAccordionOpenStatusType() }}>
                        <Accordion.Panel header={"入驻类型：" + (this.state.type == "2" ? "工作室/团队/机构" : "个人") } key="1">
                            <Radio.RadioItem checked={this.state.type == "1"} onChange={() => { this.setState({ type: "1" }), this.changeAccordionOpenStatusType() }}>
                                {"个人"}
                            </Radio.RadioItem>
                            <Radio.RadioItem checked={this.state.type == "2"} onChange={() => { this.setState({ type: "2" }), this.changeAccordionOpenStatusType() }}>
                                {"工作室/团队/机构"}
                            </Radio.RadioItem>
                        </Accordion.Panel>
                    </Accordion>

                    <Accordion className="perfect-info-accordion" activeKey={this.state.AccordionIsOpen ? "1" : "0"} onChange={() => { this.changeAccordionOpenStatus() }}>
                        <Accordion.Panel header={ "性别：" + this.state.sex} key="1">
                            <Radio.RadioItem checked={this.state.sex === "男"} onChange={() => { this.setState({ sex: "男" }), this.changeAccordionOpenStatus() }}>
                                {"男"}
                            </Radio.RadioItem>
                            <Radio.RadioItem checked={this.state.sex === "女"} onChange={() => { this.setState({ sex: "女" }), this.changeAccordionOpenStatus() }}>
                                {"女"}
                            </Radio.RadioItem>
                        </Accordion.Panel>
                    </Accordion>

                    <InputItem
                        className="real-name"
                        type="string"
                        value={this.state.real_name}
                        onChange={(val) => { this.setState({ real_name: val }) }}
                        placeholder="请输入真实姓名"
                        maxLength="20"
                        clear
                    >姓名</InputItem>

                    <InputItem
                        type="string"
                        value={this.state.job_name}
                        onChange={(val) => { this.setState({ job_name: val }) }}
                        placeholder="请输入职业"
                        maxLength="20"
                        clear
                    >职业</InputItem>

                    <InputItem
                        type="string"
                        value={this.state.school}
                        onChange={(val) => { this.setState({ school: val }) }}
                        placeholder="请输入院校名称"
                        maxLength="20"
                        clear
                    >毕业院校</InputItem>

                    <Picker 
                        data={experienceData} 
                        cols={1} 
                        title="请选择工作经验"
                        // onPickerChange={(val) => { this.setState({ experience: val[0]}) }}
                        value={this.state.experiencePickerValue}
                        onChange={(val) => { this.setState({ experiencePickerValue: val, experienceIndex: val[0], experience: experienceData[val[0]].real_value }) }}
                        extra={this.state.experienceIndex >= 0 ? experienceData[this.state.experienceIndex].label : '请选择' }
                    >
                        <List.Item arrow="horizontal">工作经验</List.Item>
                    </Picker>

                    <Picker
                        data={educationData}
                        cols={1}
                        title="请选择最高学历"
                        // onPickerChange={(val) => { this.setState({ experience: val[0]}) }}
                        value={this.state.educationPickerValue}
                        onChange={(val) => { this.setState({ educationPickerValue: val, education: val[0]}) }}
                        extra={this.state.education ? this.state.education : '请选择'}
                    >
                        <List.Item arrow="horizontal">最高学历</List.Item>
                    </Picker>

                    <Picker 
                        data={cityData}
                        title="请选择所在位置"
                        // extra="请选择(可选)"
                        value={this.state.cityPickerValue}
                        onChange={e => this.changeCityPicker(e)}
                    >
                        <List.Item arrow="horizontal">所在位置</List.Item>
                    </Picker>

                    <List.Item
                        className="common-addr-list"
                        key={0}
                        // thumb={<span><i className="iconfont icon-dingwei"></i>详细地址</span>}
                        extra={<i onClick={() => { this.clickChangeSelfAddr() }} className="iconfont icon-dituzhaofang"></i>}
                    >{this.state.address ? this.state.address : '请选择详细地址'}</List.Item>
                </List>
                <p className="tag-container-title">标签</p>
                <div className="tag-container">
                {
                    this.state.customLabelsArray.length > 0 &&
                    this.state.customLabelsArray.map((value, index)=>(
                        <Tag key={index} className="self-label" onChange={() => { this.closeLabel(index) }}>{value}<i className="iconfont icon-shanchuguanbicha"></i></Tag>
                    ))

                }
                    <Tag className="self-label" onChange={this.clickAddLabel}> <i className="iconfont icon-tianjiajiahaowubiankuang"></i> 添加</Tag>
                </div>
            </div>
        )
    }
}