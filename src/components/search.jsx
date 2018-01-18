import React from 'react';
import { SearchBar, Flex, WhiteSpace, Button, Toast, Modal } from 'antd-mobile';
import { hashHistory, Link } from 'react-router';

const alert = Modal.alert;
const PlaceHolder = (props) => (
    <ul>
        {
            props.block.map(function (value) {
                return <li style={{ float: "left", height: "30px", lineHeight: "30px", textAlign: "center", color: "#333", padding: "0 10px", margin: "6px", backgroundColor:"#F2F2F2",borderRadius:"18px"}}>
                    {value}
                </li>
            })
        }
    </ul>
)

export default class Search extends React.Component {
    state = {
        value: '',
        history:[
            "十多万群", "大武当", "大武当", "加热垫甲方就", "加热垫甲方就","十多万群"
        ],
        hots:[
            "十多万群", "大武当", "加热垫甲方就", "加热垫甲方就","人分为二分","十多万群", "大武当"
        ],
        show:true
    };
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
    render() {
        return (<div className="searchIpt">
            <div className="searchPD">
                <span className="iconfont icon-jiantou" onClick={() => { hashHistory.goBack()}}></span>
                <SearchBar
                    ref={ref => this.autoFocusInst = ref}
                    value={this.state.value}
                    placeholder="搜索设计师"
                    onSubmit={value => console.log(value, 'onSubmit')}
                    onClear={value => console.log(value, 'onClear')}
                    onFocus={() => console.log('onFocus')}
                    onBlur={() => console.log('onBlur')}
                    onCancel={() => console.log('onCancel')}
                    showCancelButton
                    onChange={this.onChange}
                />
            </div>
            
            <div className="search">
                <h3>搜索指定内容</h3>
                <ul>
                    <li>设计师</li> <span>|</span>
                    <li>作品</li> <span>|</span>
                    <li>服务</li> <span>|</span>
                    <li>需求</li>
                </ul>
            </div>

            <div className="searchHistory">
                <p>
                    <span>历史搜索</span> 
                    <i className="iconfont icon-shanchu fn-right" onClick={() => alert('Delete', '确认删除搜索记录吗?', [
                        { text: '取消', onPress: () => console.log('cancel') },
                        {
                            text: '确定',
                            onPress: () => new Promise((resolve) => {
                                Toast.info('onPress Promise', 1);
                                setTimeout(resolve, 1000);
                            }),
                        },
                    ])}></i>
                </p>
                
                <WhiteSpace size="md" /> 
                <div className="">
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
        </div>);
    }
}
