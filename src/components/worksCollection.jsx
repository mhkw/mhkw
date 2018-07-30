import React from 'react'
import { Tabs, Badge, NavBar, Icon, PullToRefresh, ListView } from 'antd-mobile';
import { Link, hashHistory } from 'react-router';
import QueueAnim from 'rc-queue-anim';


let realData = [];
let index = realData.length - 1;
let realDataLength = realData.length;
const NUM_ROWS = 10;
let pageIndex = 0;
export default class WorksCollection extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource: dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("myWorkData")) ? JSON.parse(sessionStorage.getItem("myWorkData")) : []),
            hasMore:false,
            useBodyScroll: false,
            refreshing: false,
            isLoading: true,
            size: 0,
            height: "",
            total_works: 0,
        }
        this.genData = (pIndex = 0, realLength, data) => {
            let dataBlob = [];
            dataBlob = data;
            return dataBlob;
        };
        this.handleGetWorkList = (res) => {
            console.log(res)
            if (res.success) {
                realData = res.data.item_list;
                realDataLength = res.data.item_list.length;
                if (pageIndex == 0) {
                    this.rData = [];
                    this.rData = [...this.rData, ...this.genData(pageIndex++, realDataLength, realData)];
                    sessionStorage.setItem("myWorkData", JSON.stringify(realData));
                } else {
                    this.rData = [...this.rData, ...this.genData(pageIndex++, realDataLength, realData)];
                }
                const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.rData),
                    hasMore: res.data.total_works > this.state.size ? true : false,
                    isLoading: res.data.total_works > this.state.size ? true : false,
                    size: this.state.size + 8,
                    height: hei,
                    total_works: res.data.total_works,
                });
                let token = setTimeout(() => {
                    this.setState({
                        refreshing: false
                    })
                    clearTimeout(token);
                }, 300);
            } else {
                Toast.offline(res.message, 1.5);
            }
        }
    }
    componentDidMount() {
        this.rData = this.genData();
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
        //初始化获取数据
        this.getWorkList();
        document.querySelector(".worksCollection").scrollIntoView(true);
    }
    // componentDidUpdate() {
    //     if (this.state.useBodyScroll) {
    //         document.body.style.overflow = 'auto';
    //     } else {
    //         document.body.style.overflow = 'hidden';
    //     }
    // }
    routerWillLeave(nextLocation) {  //离开页面
        pageIndex = 0;
    }
    onRefresh = () => {   //顶部下拉刷新数据
        this.setState({
            refreshing: true
        });
        pageIndex = 0;
        this.getWorkList();
    };
    onEndReached = (event) => {
        // load new data   数据加载完成
        if (!this.state.isLoading && !this.state.hasMore) {
            return;
        }
        this.getWorkList(parseInt(this.state.size / 8) + 1);
    };
    getWorkList(n = 1) {     
        //获取作品列表
        let user_id;
        if (this.props.designer.id) {
            user_id = this.props.designer.id;
        } else if (this.props.location.query && this.props.location.query.userId) {
            user_id = this.props.location.query.userId;
        }
        
        runPromise("get_user_works_list_ex", {
            // user_id: validate.getCookie("user_id"),
            user_id: user_id || validate.getCookie("user_id"),
            sort: "add_time",
            per_page: 8,        //每页数量
            page: n,            //第几页，从第一页开始
        }, this.handleGetWorkList, true, "get");
    }
    row = (rowData, sectionID, rowID) => {
        const obj = rowData;
        const handleClickWorksDetails = (works_id, userId) => {
            hashHistory.push({
                pathname: '/worksDetails',
                query: {
                    form: 'home',
                    works_id,
                    userId,
                },
            });
        }
        return (
            <div key={rowID} style={{ display: "inline-block", width: "50%", boxSizing: "border-box", padding: "5px"}}>
                <div 
                    className="items" 
                    style={{ 
                        border: "1px solid #ccc", 
                        boxSizing: "border-box",
                        borderRadius:"3px",
                        backgroundColor:"#f5f5f5",
                        boxShadow:"0px 0px 10px #ccc",
                    }}
                    onClick={() => { handleClickWorksDetails(obj.id, obj.uid) }}
                >
                    <div className="work-item-div">
                        <img className="work-item-picture" src={obj.path_thumb ? obj.path_thumb : obj.path} style={{width:"100%",height:"5rem"}} />
                        <div style={{height:"26px",overflow:"hidden"}}>
                            <p className="exlips" style={{lineHeight:"24px",padding:"0 4px"}}>{obj.title}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className="worksCollection">
                <NavBar
                    mode="light"
                    icon={<Icon type="left" size="lg" color="#707070" />}
                    onLeftClick={() => hashHistory.goBack()}
                >作品集</NavBar>
                <div style={{ "height": "10px", "borderTop": "1px solid #ddd" }} ></div>
                <div className="homeWrap" style={{ width: "100%", padding: "0 5px", boxSizing: "border-box" }}>
                    <ListView
                        // key={this.state.useBodyScroll}
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}
                        renderFooter={() => (<div style={{ padding: "0 10px", textAlign: 'center' }}>
                            {this.state.isLoading ? '加载中...' : '加载完成'}
                        </div>)}
                        style={{
                            height: this.state.height,
                            overflow: "auto"
                        }}
                        renderRow={this.row}
                        useBodyScroll={this.state.useBodyScroll}
                        pullToRefresh={<PullToRefresh
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}
                        onEndReached={this.onEndReached}
                        pageSize={8}
                    />
                </div>
            </div>
        )
    }
}

WorksCollection.contextTypes = {
    router: React.PropTypes.object
};