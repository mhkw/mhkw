import { ListView, List, SearchBar, Flex, WhiteSpace, WingBlank, NavBar, Icon } from 'antd-mobile';

import { province as provinceData } from './cityData';

import { hashHistory } from 'react-router';

const { Item } = List;


const PlaceCity = (props) => (
    <List.Item
        onClick={() => { props.getCity(props.city) }}
        platform="android"
        {...props}
    >
        {props.city}
    </List.Item>
);

const FlexCity = (props) => (
    <div className="flex-city">
        <div className="sub-title">热门城市</div>
        <Flex>
            <Flex.Item><PlaceCity city="北京" {...props} /></Flex.Item>
            <Flex.Item><PlaceCity city="上海" {...props} /></Flex.Item>
            <Flex.Item><PlaceCity city="广州" {...props} /></Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />
        <Flex>
            <Flex.Item><PlaceCity city="深圳" {...props} /></Flex.Item>
            <Flex.Item><PlaceCity city="杭州" {...props} /></Flex.Item>
            <Flex.Item><PlaceCity city="南京" {...props} /></Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />
        <Flex>
            <Flex.Item><PlaceCity city="天津" {...props} /></Flex.Item>
            <Flex.Item><PlaceCity city="武汉" {...props} /></Flex.Item>
            <Flex.Item><PlaceCity city="重庆" {...props} /></Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />
    </div>
);

class StageSelectCity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHotCity: true
        }
    }
    getCity = (city) => {
        localStorage.setItem("city", city);
        // this.context.router.push('/addr');
        hashHistory.goBack();
    }
    onSearch = (val) => {
        this.props.onSearch(val);
        this.setState({
            showHotCity: !val
        });
    }
    render() {
        let iconLeft = React.createElement('i', { className: 'iconfont icon-chevron-copy-copy-copy-copy' }, '');
        return (
            <div className="StageSelectCity">
                <NavBar mode="light"
                    icon={<Icon size="md" type="left" color="#707070" />}
                    onLeftClick={() => hashHistory.goBack()}
                    leftContent={iconLeft}
                >
                    {"选择城市"}
                </NavBar>
                <SearchBar
                    className="search-city"
                    placeholder="请输入城市名称或首字母查询"
                    onChange={this.onSearch}
                    onClear={() => { }}
                    onCancel={() => { }}
                />
                <WingBlank
                    style={{
                        display: this.state.showHotCity ? "block" : "none"
                    }}
                    size='lg'
                >
                    <FlexCity getCity={this.getCity} />
                </WingBlank>
            </div>
        );
    }
}
StageSelectCity.contextTypes = {
    router: React.PropTypes.object
};
export default class ListViewDemo extends React.Component {
    constructor(props) {
        super(props);
        const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
        const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

        const dataSource = new ListView.DataSource({
            getRowData,
            getSectionHeaderData: getSectionData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.createDs = (ds, province) => {
            const dataBlob = {};
            const sectionIDs = [];
            const rowIDs = [];
            Object.keys(province).forEach((item, index) => {
                sectionIDs.push(item);
                dataBlob[item] = item;
                rowIDs[index] = [];

                province[item].forEach((jj) => {
                    rowIDs[index].push(jj.value);
                    dataBlob[jj.value] = jj.label;
                });
            });
            return ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
        };
        this.state = {
            inputValue: '',
            dataSource: this.createDs(dataSource, provinceData),
            headerPressCount: 0,
        };
    }

    onSearch = (val) => {
        const pd = { ...provinceData };
        Object.keys(pd).forEach((item) => {
            pd[item] = pd[item].filter(jj => jj.spell.toLocaleLowerCase().indexOf(val) > -1 || ~jj.label.indexOf(val));
        });
        this.setState({
            inputValue: val,
            dataSource: this.createDs(this.state.dataSource, pd),
        });
    }
    onClickCity(tar) {
        if (tar.target.className == "am-list-content") {
            let city = tar.target.innerHTML;
            localStorage.setItem("city", city);
            // this.context.router.push('/addr');
            hashHistory.goBack();
        }
    }
    render() {
        return (
            <div style={{ paddingTop: '0', position: 'relative' }}>
                <StageSelectCity onSearch={this.onSearch} />
                <ListView.IndexedList
                    dataSource={this.state.dataSource}
                    renderSectionHeader={sectionData => (<div className="ih">{sectionData}</div>)}
                    renderRow={rowData => (<Item onClick={(val) => { this.onClickCity(val) }} platform="android">{rowData}</Item>)}
                    className="am-list"
                    stickyHeader
                    stickyProps={{
                        stickyStyle: { zIndex: 999 },
                    }}
                    quickSearchBarStyle={{
                        top: "1.3rem",
                    }}
                    delayTime={10}
                    delayActivityIndicator={<div style={{ padding: 25, textAlign: 'center' }}>rendering...</div>}
                />
            </div>

        );
    }
}
ListViewDemo.contextTypes = {
    router: React.PropTypes.object
};