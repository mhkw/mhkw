import React from 'react';
import { SearchBar, Flex, WhiteSpace, Button, Toast, Modal } from 'antd-mobile';
import { hashHistory } from 'react-router';

import "../css/easy-animation.scss";

const alert = Modal.alert;
const PlaceHolder = (props) => (
    <ul>
        {
            props.block.map(function (value) {
                return value.keyword == "" ? "" : <li onClick={(e) => { props.set(value.keyword)}}>{value.keyword}</li>
            })
        }
    </ul>
)

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            history: [],
            hots: [],
            show: true,
            placeholder: ["搜索设计师", "搜索作品", "搜索服务", "搜索需求"],
            valplaceholder: "搜索设计师",
            classNameAnimate:"AnimateX",
            tab:0
        };
        this.handleSearch = (res) => {
            console.log(res);
            if(res.success) {
                this.setState({
                    "history":res.data.mysearch,
                    "hots":res.data.hotsearch
                })
            }
        }
        this.handleDelSearch = (res) => {
            if(res.success) {
                this.setState({
                    history: []
                })
                Toast.info('删除成功', 0.5);
            }
        }
    }
    
    componentDidMount() {
        this.autoFocusInst.focus();
        runPromise('get_search_history', null, this.handleSearch, false, "get");
    }
    onChange = (value) => {
        this.setState({ value });
    };
    clear = () => {
        this.setState({ value: '' });
    };
    handleClick = () => {
        this.manualFocusInst.focus();
    }
    deleteHistory = ()=>{
        this.setState({
            show:!this.state.show
        })
    }
    changePlceholder(idx){
        this.autoFocusInst.focus();
        this.setState({
            valplaceholder:this.state.placeholder[idx],
            tab:idx
        })
        this.props.setState({tab:idx})
    }
    changeClassNameAnimate =()=>{
        // this.setState({
        //     classNameAnimate: "AnimateXB"
        // })
        // setTimeout(() => {
        //     hashHistory.goBack()
        // }, 100);
    }
    delHistoryList=()=>{
        runPromise('delete_search_history', null, this.handleDelSearch, false, "get");
    }
    set = (val) =>{
        this.setState({ value:val })
    }
    render() {
        return (
            <div className={"searchIpt"}>
                <div className="searchPD">
                    <span className="iconfont icon-jiantou" onClick={() => { hashHistory.goBack()} }></span>
                    <SearchBar
                        ref={ref => this.autoFocusInst = ref}
                        value={this.state.value}
                        placeholder={this.state.valplaceholder}
                        onSubmit={(value) => {console.log(value);}}
                        // onClear={value => console.log(value, 'onClear')}
                        // onFocus={() => console.log('onFocus')}
                        // onBlur={() => console.log('onBlur')}
                        onCancel={(value) => {
                            this.props.setState({ keywords:value}) 
                            value.trim() == '' ? Toast.info('请输入搜索关键词', 2, null, false) : 
                            hashHistory.push({
                                pathname: "/searchResult",
                                query:{
                                    keyword:value,
                                    tab:this.state.tab
                                }
                            })
                        }}
                        onChange={this.onChange}
                        cancelText="确定"
                        showCancelButton={false}
                    />
                </div>
                
                <div className="search">
                    <h3>搜索指定内容</h3>
                    <ul>
                        <li onClick={() => { this.changePlceholder(0)}}>设计师</li> <span>|</span>
                        <li onClick={() => { this.changePlceholder(1) }}>作品</li> <span>|</span>
                        <li onClick={() => { this.changePlceholder(2) }}>帖子</li> <span>|</span>
                        <li onClick={() => { this.changePlceholder(3) }}>需求</li>
                    </ul>
                </div>

                <div className="searchHistory" style={{display:this.state.history.length>0?"block":"none"}}>
                    <p>
                        <span>历史搜索</span> 
                        <i className="iconfont icon-shanchu fn-right" onClick={() => alert('确认删除搜索记录吗?', '', [
                            { text: '取消', onPress: () => console.log('cancel') },
                            {
                                text: '确定',
                                onPress: () => new Promise((resolve) => {
                                    this.delHistoryList()
                                    setTimeout(resolve, 20);                                        
                                }),
                            },
                        ])}></i>
                    </p>
                    <WhiteSpace size="md" />
                    <div className="historyLis">
                        <PlaceHolder block={this.state.history} set={this.set} />
                    </div> 
                </div>
                <div className="searchHot">
                    <p><span>热门搜索</span></p>
                    <WhiteSpace size="md" /> 
                    <div className="">
                        <PlaceHolder block={this.state.hots} set={this.set} />
                    </div> 
                </div>
            </div>
        );
    }
}
