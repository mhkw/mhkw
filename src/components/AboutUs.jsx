import React from "react";
import { hashHistory } from "react-router";
import { NavBar, Icon, WingBlank, WhiteSpace } from "antd-mobile";
import BScroll from 'better-scroll'

export default class AboutUs extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            height:""
        }
    }
    componentDidMount(){
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 25;
        const scroll = new BScroll(document.querySelector('.wrapper'), { click: true, bounceTime: 300, swipeBounceTime: 200 })
        this.setState({
            height: hei
        })
    }
    render() {
        return (
            <div className="about-us-page" key="1">
                <NavBar
                    className="new-nav-bar top"
                    mode="light"
                    icon={<Icon type="left" size="lg" style={{ "color": "#a3a3a3" }} />}
                    onLeftClick={() => hashHistory.goBack()}
                >关于我们</NavBar>
                <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                    <div>
                        <WhiteSpace size="sm" />
                        <WingBlank size="lg">
                            <p className="body about-us-p">
                                客，古代有刀客，剑客，侠客……客者，皆是漂泊之人，更具不俗能为。
                                画客，即是艺术之客、创意之客，指的是在设计领域有不凡身手之人。
                                集结“客者”之地，古有武林大会，而今有画客。
                            </p>
                            <p className="body about-us-p">
                                所谓“画客网，网画客。”，意思就是网罗天下设计英才。
                                其实，画客网成立的初衷就是建立一个规范的设计交易平台，让有才华的设计师得以大展拳脚，而不没落于一方低价，一方敷衍的交易市场。
                            </p>
                            <p className="body about-us-p">
                                在这个革新的时代，画客网由衷欢迎各位顶级设计大师的入驻。我们会想方设法，排除您的后顾之忧，比如免费为您提供办公位、提供发票、代交社保、设计合同、设计维权等，让您不为凡事所操心，得以安心创作，设计出更多绝妙的作品。
                                同时，我们也迫切期待广大英明的企业家以及管理者的到来。
                            </p>
                            <p className="body about-us-p">
                                不管您的需求是临时还是长期的，画客网都是您最佳的选择。因为我们这里有优质而庞大的设计师群体，也有安全快捷的交易方式，而一对一、面对面的交流，则会让成品更加满足您的需求。
                                画客网是个开放包容的平台，也是个追求完美的平台。希望有我的付出，有您的加入，能让中国的设计行业走向专业，走向高端，走向美好的未来。
                            </p>
                            <p className="body about-us-p">
                                未来是您我共同缔造的。众人拾柴火焰高，画客网期待您加入这场盛世篝火。
                            </p>
                            <p className="important about-us-p">
                                画客网永久承诺：永久对设计师免费开放，并且绝不收取任何佣金！
                            </p>
                            <div className="about-us about-us-p">
                                <p>官网：http://www.huakewang.com/</p>
                                <p>电话：0571-86803103</p>
                                <p>邮箱：mia@huakewang.com</p>
                                <p>微信公众号：huake5 </p>
                            </div>
                        </WingBlank>
                    </div>
                </div>
                
            </div>
        )
    }
}