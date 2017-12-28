import React,{Component} from 'react';
import ReactDom from 'react-dom';

import '../css/index.less'

class Dom extends Component {
    render() {
        return (
            <div className="title">
                <h3>成功渲染h3标签</h3>
            </div>
        )
    }
}

export default Dom;