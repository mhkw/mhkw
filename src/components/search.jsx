import React from 'react';
import { SearchBar, Flex, WhiteSpace, Button, Toast, Modal } from 'antd-mobile';
import { hashHistory, Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';

import "../css/easy-animation.scss";

const alert = Modal.alert;
const PlaceHolder = (props) => (
    <ul>
        {
            props.block.map(function (value) {
                return <li>
                    {value}
                </li>
            })
        }
    </ul>
)

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            history: [
                "十多万群", "大武当", "大武当", "加热垫甲方就", "加热垫甲方就", "十多万群"
            ],
            hots: [
                "十多万群", "大武当", "加热垫甲方就", "加热垫甲方就", "人分为二分", "十多万群", "大武当"
            ],
            show: true,
            placeholder: ["搜索设计师", "搜索作品", "搜索服务", "搜索需求"],
            valplaceholder: "搜索设计师"
        };
    }
    
    componentDidMount() {
        this.autoFocusInst.focus();
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
        this.setState({
            valplaceholder:this.state.placeholder[idx]
        })
    }
    render() {
        return (
            // <QueueAnim>
            <div className="searchIpt AnimateX">
                    <div className="searchPD">
                        <span className="iconfont icon-jiantou" onClick={() => { hashHistory.goBack()}}></span>
                        <SearchBar
                            ref={ref => this.autoFocusInst = ref}
                            value={this.state.value}
                            placeholder={this.state.valplaceholder}
                            onSubmit={value => console.log(value, 'onSubmit')}
                            onClear={value => console.log(value, 'onClear')}
                            onFocus={() => console.log('onFocus')}
                            onBlur={() => console.log('onBlur')}
                            onCancel={() => console.log('onCancel')}
                            onChange={this.onChange}
                        />
                    </div>
                    
                    <div className="search">
                        <h3>搜索指定内容</h3>
                        <ul>
                            <li onClick={() => { this.changePlceholder(0)}}>设计师</li> <span>|</span>
                            <li onClick={() => { this.changePlceholder(1) }}>作品</li> <span>|</span>
                            <li onClick={() => { this.changePlceholder(2) }}>服务</li> <span>|</span>
                            <li onClick={() => { this.changePlceholder(3) }}>需求</li>
                        </ul>
                    </div>

                    <div className="searchHistory">
                        <p>
                            <span>历史搜索</span> 
                            <i className="iconfont icon-shanchu fn-right" onClick={() => alert('确认删除搜索记录吗?', '', [
                                { text: '取消', onPress: () => console.log('cancel') },
                                {
                                    text: '确定',
                                    onPress: () => new Promise((resolve) => {
                                        this.setState({
                                            history:[]
                                        })
                                        Toast.info('删除成功', 0.5);
                                        setTimeout(resolve, 200);
                                    }),
                                },
                            ])}></i>
                        </p>
                        <WhiteSpace size="md" /> 
                        <div className="historyLis">
                            <PlaceHolder block={this.state.history}/>
                        </div> 
                    </div>
                    <div className="searchHot">
                        <p><span>热门搜索</span> </p>
                        <WhiteSpace size="md" /> 
                        <div className="">
                            <PlaceHolder block={this.state.hots}/>
                        </div> 
                    </div>
                </div>
            // </QueueAnim>
        );
    }
}
