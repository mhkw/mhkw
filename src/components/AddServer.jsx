import React from 'react'
import { NavBar, Icon, WingBlank, List, InputItem, Flex, Popover, TextareaItem, Toast } from 'antd-mobile';
import { hashHistory } from 'react-router';

const myImg = src => <img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" alt="" />;

export default class AddServer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            server_name: "",
            unit_price: "", //单价
            unit: "", //单位
            Popover_visible: false, //下拉框显示或隐藏的状态
            describe:"",
            NavBarTitle: "添加服务",
            service_template_id: '', //服务模板ID
        }
        this.handleAddService = (res) => {
            if (res.success) {
                let tips = "添加服务成功";
                if (this.state.service_template_id) {
                    tips = "修改服务成功";
                }
                Toast.success(tips, 1,()=>{
                    this.props.ajaxGetSelfServiceList(); //刷新服务模板列表
                    hashHistory.goBack();
                });
            } else {
                Toast.fail(res.message, 2);
            }
        }
    }
    onPopoverSelect = (opt) => {
        this.setState({
            Popover_visible: false,
            unit: opt.props.children,
        });
    };
    addService = () => {
        let { server_name, unit_price, unit, describe} = this.state;
        if (!server_name) {
            Toast.info("请输入服务名称",1);
            return;
        }
        if (!unit_price) {
            Toast.info("请输入服务单价",1);
            return;
        }
        if (!unit) {
            Toast.info("请输入服务单位",1);
            return;
        }
        //新增服务模板
        runPromise('add_service_template', {
            Name: server_name,
            unit_price: unit_price,
            unit: unit,
            Description: describe,
            service_template_id: this.state.service_template_id,
        }, this.handleAddService, true);
    }
    componentWillMount() {
        if (this.props.location.query && this.props.location.query.form) {
            const form = this.props.location.query.form;
            const location_id = this.props.location.query.id;
            
            if (form == "editServer" && location_id) {
                if (this.props.state.serverList) {
                    const server = this.findServerOfId(this.props.state.serverList, location_id);
                    let { Name, unit_price, unit, describe, id } = server;
                    this.setState({
                        server_name: Name,
                        unit_price, //单价
                        unit, //单位
                        describe,
                        NavBarTitle: `编辑: ${Name}`,
                        service_template_id: id,
                    })
                } else {
                    this.setState({ NavBarTitle: '编辑' })
                }
                
            }
        }
        
    }
    /**
     * 根据id找到服务列表的某一个服务，然后返回该服务对象
     * 
     * @memberof AddServer
     */
    findServerOfId = (serverList ,id) => {
        for (let i = 0; i < serverList.length; i++) {
            const element = serverList[i];
            if (element.id == id) {
                return element;
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        
        if (nextProps.location.query && nextProps.location.query.form) {
            const form = this.props.location.query.form;
            const location_id = this.props.location.query.id;

            if (form == "editServer" && location_id && nextProps.state.serverList) {
                const server = this.findServerOfId(nextProps.state.serverList, location_id);
                if (server) {
                    let { Name, unit_price, unit, describe, id } = server;
                    this.setState({
                        server_name: Name,
                        unit_price, //单价
                        unit, //单位
                        describe,
                        NavBarTitle: `编辑: ${Name}`,
                        service_template_id: id,
                    })
                }
            }
        }
        
    }
    render() {
        return (
            <div className="add-server" key="1">
                <NavBar
                    className="add-server-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="md" color="#108ee9" />}
                    onLeftClick={() => hashHistory.goBack()}
                    leftContent={<span style={{ fontSize: "15px" }}>返回</span>}
                    rightContent={<span onClick={this.addService} style={{ color: "#108ee9", fontSize: "16px" }}>保存</span>}
                >{this.state.NavBarTitle}</NavBar>
                <InputItem
                    className="server-name"
                    type="string"
                    maxLength="20"
                    placeholder="请输入服务名称"
                    clear
                    value={this.state.server_name}
                    onChange={(v) => { this.setState({ server_name: v }) }}
                >名称</InputItem>
                <Flex className="unit-price-flex">
                    <Flex.Item className="flex3">
                        <InputItem
                            className="unit-price"
                            type="money"
                            maxLength="20"
                            placeholder="输入单价"
                            moneyKeyboardAlign ="left"
                            value={this.state.unit_price}
                            onChange={(v) => { this.setState({ unit_price: v }) }}
                            onBlur={(val) => { let price = (val - 0).toFixed(2); isNaN(price) || price == 0 ? (Toast.offline("金额错误", 1), this.setState({ unit_price: "" })) : this.setState({ unit_price: price }) }}
                        >单价</InputItem>
                    </Flex.Item>
                    <Flex.Item className="flex3">
                        <InputItem
                            className="unit"
                            type="string"
                            maxLength="20"
                            placeholder="输入单位"
                            value={this.state.unit}
                            onChange={(v) => { this.setState({ unit: v }) }}
                        >单位</InputItem>
                    </Flex.Item>
                    <Flex.Item className="flex1">
                        <Popover 
                            mask
                            overlayClassName="drop-down-list-unit"
                            overlayStyle={{ color: 'currentColor' }}
                            visible={this.state.Popover_visible}
                            overlay={[<Popover.Item>张</Popover.Item>, <Popover.Item>页</Popover.Item>, <Popover.Item>份</Popover.Item>, <Popover.Item>套</Popover.Item> ]}
                            align={{
                                overflow: { adjustY: 0, adjustX: 0 },
                                offset: [0, 5],
                            }}
                            // onVisibleChange={this.handleVisibleChange}
                            onSelect={this.onPopoverSelect}
                        >
                            <i className="iconfont icon-tubiao-"></i>
                        </Popover>
                    </Flex.Item>
                </Flex>
                <TextareaItem
                    placeholder="描述：对内容的简单说明"
                    autoHeight
                    rows={5}
                    count={200}
                    value={this.state.describe}
                    onChange={(val) => { this.setState({ describe: val}) }}
                />
            </div>
        )
    }
}

AddServer.contextTypes = {
    router: React.PropTypes.object
};