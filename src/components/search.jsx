import React from 'react';
import { SearchBar, Flex, WhiteSpace } from 'antd-mobile';


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
        block:[
            "十多万群", "大武当", "加热垫甲方就","十多万群", "大武当", "加热垫甲方就"
        ]
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
    render() {
        return (<div className="searchIpt">
            <div className="searchPD">
                <span className="iconfont icon-jiantou" ></span>
                <SearchBar
                    ref={ref => this.autoFocusInst = ref}
                    value={this.state.value}
                    placeholder="Search"
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
                <p><span>历史搜索</span> <i className="iconfont icon-shanchu fn-right"></i></p>
                <WhiteSpace size="md" /> 
                <div className="">
                    <PlaceHolder block={this.state.block}/>
                </div> 
            </div>
        </div>);
    }
}
