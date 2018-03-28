import React from 'react'
import { Tabs, Badge, NavBar, Icon, PullToRefresh, ListView } from 'antd-mobile';
import { Link, hashHistory } from 'react-router';

const loginUrl = {
    "selec": require('../images/selec.png'),
}

let realData = [];
let index = realData.length - 1;
let realDataLength = realData.length;
const NUM_ROWS = 10;
let pageIndex = 0;
export default class WorkList extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource: dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("workData")) ? JSON.parse(sessionStorage.getItem("workData")) : []),
            tabs :[
                { title: '全部' },
                { title: '平面设计' },
                { title: '交互设计' },
                { title: '三维艺术' },
                { title: '网页设计' },
                { title: '艺术绘画' },
                { title: '工业设计' },
                { title: '动画/影视' },
                { title: '摄影艺术' },
                { title: '产品设计' },
            ],
            ids:["148","242","244","246","243","241","245","247","248","386"],
            hasMore:false,
            useBodyScroll: false,
            refreshing: false,
            isLoading: true,
            size: 0,
            height: "",
            typeId:"148"
        };
        this.genData = (pIndex = 0, realLength, data) => {
            let dataBlob = [];
            dataBlob = data;
            return dataBlob;
        };
        this.handleSend=(res)=>{  //作品分类列表
            if(res.success){
                let currentabs = [{ title: '全部' }];
                let idsLis = [148];
                res.data.map((value)=>{
                    currentabs.push({title:value.menu_name})
                    idsLis.push(value.id)
                })
                this.setState({
                    tabs: currentabs,
                    ids:idsLis
                });
            }else{
                console.log(res);
            }
        };
        this.handleLoginSend = (res) => {
            console.log(res);
            if (res.success) {
                realData = res.data.item_list;
                realDataLength = res.data.item_list.length;
                if (pageIndex == 0) {
                    this.rData = [];
                    this.rData = [...this.rData, ...this.genData(pageIndex++, realDataLength, realData)];
                    sessionStorage.setItem("workData", JSON.stringify(realData));
                } else {
                    this.rData = [...this.rData, ...this.genData(pageIndex++, realDataLength, realData)];
                }
                const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.rData),
                    hasMore: res.data.total_count > this.state.size ? true : false,
                    isLoading: res.data.total_count > this.state.size ? true : false,
                    size: this.state.size+8,
                    height: hei,
                });
                setTimeout(() => {
                    this.setState({
                        refreshing: false
                    })
                }, 300);
            } else {
                Toast.info(res.message, 2, null, false);
            }
        }
    }
    componentDidMount() {
        this.rData = this.genData();
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
        this.getWorkKinds();
        this.getWorkList(148,0);
    }
    componentDidUpdate() {
        if (this.state.useBodyScroll) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }
    }
    routerWillLeave(nextLocation) {  //离开页面
        pageIndex = 0;
    }
    onRefresh = () => {   //顶部下拉刷新数据
        this.setState({
            refreshing: true
        });
        pageIndex = 0;
        this.getWorkList(this.state.typeId, 0);
    };
    onEndReached = (event) => {
        // load new data   数据加载完成
        if (!this.state.isLoading && !this.state.hasMore) {
            return;
        }
        this.getWorkList(this.state.typeId, this.state.size);
    };
    getWorkList(firstid,n) {     //获取作品列表
        runPromise("get_works_list_ex", {
            firstid: firstid,
            sort: "add_time",
            keyword: "",
            offset: n,            //从第几个开始
            limit: 8            //每次请求数量
        }, this.handleLoginSend, false, "post");
    }
    getWorkKinds(){     //获取作品类别
        runPromise("get_menu_class", {
            type:246
        }, this.handleSend, false, "get");
    }
    render() {
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                <div key={rowID} style={{ display: "inline-block", width: "50%", boxSizing: "border-box", padding: "5px"}}>
                    <div className="items" style={{ 
                        border: "1px solid #ccc", 
                        boxSizing: "border-box",
                        borderRadius:"3px",
                        backgroundColor:"#f5f5f5",
                        boxShadow:"0px 0px 10px #ccc",
                    }}>
                        <div>
                            <img src={obj.path_thumb ? obj.path_thumb : obj.path} style={{width:"100%",height:"5rem"}} />
                            <div style={{height:"26px",overflow:"hidden"}}>
                                <p className="exlips" style={{lineHeight:"24px",padding:"0 4px"}}>{obj.title}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <div>
                <div className="forgetNav" key="1">
                    <NavBar
                        mode="light"
                        icon={<Icon type="left" size="lg" color="#707070" />}
                        onLeftClick={() => hashHistory.goBack()}
                    // rightContent={[
                    //     <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
                    //     <i key="1" type="ellipsis" className="iconfont icon-shijian2" />,
                    // ]}
                    >作品</NavBar>
                </div>
                <div style={{ height: "1.2rem" }}></div>
                <Tabs tabs={this.state.tabs}
                    onTabClick={(tab, index) => { 
                        this.getWorkList(this.state.ids[index], 0); 
                        this.setState({ 
                            typeId: this.state.ids[index],
                            size : 0
                        }) 
                        pageIndex = 0;
                        document.querySelector(".am-list-body").scrollIntoView(true)
                    }}
                >
                </Tabs>
                <div className="homeWrap" style={{ width: "100%",padding:"0 5px",boxSizing:"border-box" }}>
                    <ListView
                        key={this.state.useBodyScroll}
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}
                        renderFooter={() => (<div style={{ padding: "0 10px", textAlign: 'center' }}>
                            {this.state.isLoading ? '加载中...' : '加载完成'}
                        </div>)}
                        style={{
                            height: this.state.height,
                            overflow: "auto"
                        }}
                        renderRow={row}
                        useBodyScroll={this.state.useBodyScroll}
                        pullToRefresh={<PullToRefresh
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}
                        onEndReached={this.onEndReached}
                        pageSize={9}
                    />
                </div>
            </div>
        )
    }
}