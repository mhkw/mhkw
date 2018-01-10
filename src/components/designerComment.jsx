import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Flex } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

export default class DesignerComment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            commentList: []
        }
    }
    render() {
        return (
            <div className="designerComment">
                评论列表
            </div>
        )
    }
}

DesignerComment.contextTypes = {
    router: React.PropTypes.object
};