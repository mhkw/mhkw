import React from 'react';
import { Tabs, SearchBar, Badge, Flex, WhiteSpace, Button, Toast, Modal } from 'antd-mobile';
import { hashHistory } from 'react-router';
import QueueAnim from 'rc-queue-anim';

const tabs = [
    { title: <Badge text={'3'}>First Tab</Badge> },
    { title: <Badge text={'今日(20)'}>Second Tab</Badge> },
    { title: <Badge dot>Third Tab</Badge> },
];

const tabs2 = [
    { title: 'First Tab', sub: '1' },
    { title: 'Second Tab', sub: '2' },
    { title: 'Third Tab', sub: '3' },
];

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
            
        };
        this.handleSearch=(res)=>{
            console.log(res);
        }
    }
    
    componentDidMount() {
        this.autoFocusInst.focus();
        runPromise('search', {
            keycode: "设计师",
            longitude:0,
            latitude:0
        }, this.handleSearch, false, "post");
    }
    
    render() {
        return (
            <QueueAnim>
                <div className="searchIpt">
                    <div className="forgetNav" key="1">
                        <NavBar
                            mode="light"
                            icon={<Icon type="left" size="lg" color="#707070" />}
                            onLeftClick={() => hashHistory.goBack()}
                            // rightContent={
                            //     <span onClick={(e) => { this.checkNeedMsg() }}>确定</span>
                            // }
                        >搜索结果</NavBar>
                    </div>
                </div>
            </QueueAnim>
        );
    }
}
