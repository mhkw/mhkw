import React from 'react'
import QueueAnim from 'rc-queue-anim';

export default class RegisterView extends React.Component {
    componentDidMount() {
    
    }
    constructor(props) {
        super(props);
        this.state = {
            show: true
        };
    }
    onClick = () => {
        this.setState({
            show: !this.state.show
        });
    }
    render() {
        return (
            <div className="queue-demo">
                <QueueAnim className="demo-content"
                           key="demo"
                           type={['right', 'left']}
                           ease={['easeOutQuart', 'easeInOutQuart']}>
                    {this.state.show ? [
                        <div className="demo-thead" key="a">
                            <ul>
                                <li />
                                <li />
                                <li />
                                sdsd
                            </ul>
                        </div>,
                        <div className="demo-tbody" key="b">
                            <ul>
                                <li>dddsssssssssssssssss</li>
                                <li>dddssssssssssssss</li>
                                <li>dddssssssssssssssss</li>
                                <li>dddssssssssssssssss</li>
                                <li>dddssssssssssssssss</li>
                                <li>dddssssssssssssssss</li>
                                <li>dddssssssssssssssss</li>
                                <li>dddssssssssssssssss</li>
                            </ul>
                        </div>
                    ] : null}
                </QueueAnim>
            </div>
        );
    }
}
