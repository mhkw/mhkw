import React from "react";
import { hashHistory, Link } from "react-router";
import { Toast, NavBar, Icon, InputItem, List, Modal, WhiteSpace, WingBlank, Tag, Button } from "antd-mobile";
import BScroll from 'better-scroll'

export default class AuthSkill extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            designer_tree: [], //技能树
            keywords: [], //设计师选择的技能
            height: ""
        }
    }
    clickSave = () => {
        // console.log("save");
        let { keywords } = this.state;
        if (keywords.length < 1) {
            Toast.info("至少选一项", 1);
        } else {
            this.props.propsSetState("Self", {
                keywords,
            });
            this.props.ajaxChangeDesignerTree(keywords);
        }
    }
    getSelfInfo = (props) => {
        //获取擅长技能数据
        if (props.Skill && props.Skill.length > 0) {
            let designer_tree = props.Skill;
            let { keywords } = props.Self;
            this.setState({ designer_tree, keywords });
        }
    }
    componentDidMount(){
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 25;
        const scroll = new BScroll(document.querySelector('.wrapper'), { click: true })
        this.setState({
            height: hei
        })
    }
    componentWillMount() {
        this.getSelfInfo(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getSelfInfo(nextProps);
    }
    changeKeywords = (selected, val) => {
        // console.log(selected, val)
        let keywords = this.state.keywords;
        if (selected) {
            keywords.push(val);
        } else {
            let index = keywords.indexOf(val);
            if (index >= 0) {
                keywords.splice(index, 1);
            }
        }
        this.setState({ keywords });
    }
    render() {
        return (
            <div className="auth-skill-page" key="1">
                <NavBar
                    className="new-nav-bar top"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                    rightContent={<Button className="rechargeButton" onClick={this.clickSave}>保存</Button>}
                >擅长技能</NavBar>
                <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                    <div>
                        {
                            this.state.designer_tree.length > 0 &&
                            this.state.designer_tree.map((value, index) => (
                                <List key={value.id} renderHeader={value.category_name} className="auth-skill">
                                    {
                                        value.keyword.split(",").map((val, eq) => {
                                            return val.length > 0 ?
                                                <Tag
                                                    className="skill-label"
                                                    selected={!!~this.state.keywords.indexOf(val)}
                                                    onChange={(selected) => { this.changeKeywords(selected, val) }}
                                                >{val}</Tag> : null
                                        })
                                    }
                                </List>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}