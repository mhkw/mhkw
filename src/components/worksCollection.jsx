import React from 'react';
import { hashHistory, Link } from 'react-router';
import { Toast, NavBar, Icon, Flex } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

export default class WorksCollection extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            worksList:[]
        }
    }
    render() {
        return (
            <div className="worksCollection">
                作品集
            </div>
        )
    }
}

WorksCollection.contextTypes = {
    router: React.PropTypes.object
};