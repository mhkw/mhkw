import React from 'react';
import { List, SearchBar, Flex, WhiteSpace, WingBlank, NavBar } from 'antd-mobile';

import ListViewDemo from './ListViewDemo';

const PlaceCity = (props) => (
    <List.Item
        onClick={() => { }}
        platform="android"
        {...props}
    >
        {props.city}
    </List.Item>
);

const FlexCity = () => (
    <div className="flex-city">
        <div className="sub-title">热门城市</div>
        <Flex>
            <Flex.Item><PlaceCity city="北京" /></Flex.Item>
            <Flex.Item><PlaceCity city="上海" /></Flex.Item>
            <Flex.Item><PlaceCity city="广州" /></Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />
        <Flex>
            <Flex.Item><PlaceCity city="深圳" /></Flex.Item>
            <Flex.Item><PlaceCity city="杭州" /></Flex.Item>
            <Flex.Item><PlaceCity city="南京" /></Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />
        <Flex>
            <Flex.Item><PlaceCity city="天津" /></Flex.Item>
            <Flex.Item><PlaceCity city="武汉" /></Flex.Item>
            <Flex.Item><PlaceCity city="重庆" /></Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />
    </div>
);

export default class StageSelectCity extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let iconLeft = React.createElement('i', { className: 'iconfont icon-chevron-copy-copy-copy-copy' }, '');
        return (
            <div className="StageSelectCity">
                <NavBar mode="light"
                    iconName="false"
                    onLeftClick={() => this.props.callbackCloseDrawer()}
                    leftContent={iconLeft}
                >
                    {"选择城市"}
                </NavBar>
                <SearchBar className="search-city" placeholder="请输入城市名称或首字母查询" />
                <WingBlank size='lg'>
                    <FlexCity />
                </WingBlank>
                <ListViewDemo />
            </div>
        );
    }
}