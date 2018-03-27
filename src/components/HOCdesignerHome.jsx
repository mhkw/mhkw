import React from "react";
import { hashHistory } from 'react-router';
import { Toast } from "antd-mobile";

export default class HOCdesignerHome extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: '',
            designer: {},
        }
        this.handleGetSelfInfo = (res) => {
            if (res.success) {
                this.setState({
                    designer: res.data
                })
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
    }
    componentDidMount() {
        let userId = this.props.location.query.userId;
        if (userId) {
            this.setState({ userId });
            this.ajaxGetSelfInfo(69590);
        }
    }
    ajaxGetSelfInfo = (userId) => {
        runPromise('get_user_info', {
            user_id: userId,
        }, this.handleGetSelfInfo, true, 'get');
    }
    render() {
        return (
            <div className="hoc-designer-home">
                {this.props.children &&
                    React.cloneElement(
                        this.props.children,
                        {
                            state: this.state,
                            setState: this.setState.bind(this),
                            designer: this.state.designer,
                        }
                    )
                }
            </div>
        )
    }
}