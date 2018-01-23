import React from 'react'
import { NavBar, Icon, WingBlank, List, InputItem, Flex, Popover, TextareaItem } from 'antd-mobile';
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
            describe:""
        }
    }
    onPopoverSelect = (opt) => {
        this.setState({
            Popover_visible: false,
            unit: opt.props.children,
        });
    };
    render() {
        return (
            <div className="add-server" key="1">
                <NavBar
                    className="add-server-nav-bar"
                    mode="light"
                    icon={<Icon type="left" size="md" color="#108ee9" />}
                    onLeftClick={() => hashHistory.goBack()}
                    leftContent={<span style={{ fontSize: "15px" }}>返回</span>}
                    rightContent={<span style={{ color: "#108ee9", fontSize: "16px" }}>保存</span>}
                >添加服务</NavBar>
                <InputItem
                    className="server-name"
                    type="string"
                    maxLength="20"
                    placeholder="请输入服务名称"
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
                    rows="5"
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