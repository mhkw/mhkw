import React from 'react'
import { hashHistory } from 'react-router'
import { NavBar, List, Icon, Toast,ActivityIndicator} from 'antd-mobile'
import { Line, Jiange, CategoryPub} from './templateHomeCircle';
import { Motion, spring } from 'react-motion';
import BScroll from 'better-scroll'

export default class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryList: JSON.parse(sessionStorage.getItem("categoryData")) ? JSON.parse(sessionStorage.getItem("categoryData")) : [],
            categoryId:"",
            fcategoryId:"",
            category:"",
            animating:false,
            height:""
        };
        this.getPicsLis=(res)=>{
            console.log(res);
            if(res.success) {
                this.setState({ 
                    categoryList:res.data,
                    animating:false
                })
                sessionStorage.setItem("categoryData", JSON.stringify(res.data))
            }
        }
    }
    componentDidMount() {
        const hei = document.documentElement.clientHeight - document.querySelector('.top').offsetHeight - 25;  
        const scroll = new BScroll(document.querySelector('.wrapper'), { click: true, bounceTime: 300, swipeBounceTime: 200, momentumLimitTime: 200}) 
        this.setState({ 
            animating:true,
            height:hei
        })
        runPromise("get_menu_class", {num:148}, this.getPicsLis, false, "get");
        this.initSelectedCategory();
    }
    changeCategory=(e,val,id,fid)=>{
        // let lis = document.querySelectorAll('.categoryPubLisBg');
        // if(e.currentTarget.innerHTML == val) {
        //     if (e.currentTarget.className.indexOf('categoryPubLisBg') != -1) {
        //         e.currentTarget.classList.remove("categoryPubLisBg")
        //     }else{
        //         if (lis.length < 3) {
        //             e.currentTarget.classList.add("categoryPubLisBg")
        //         } else {
        //             Toast.info('最多选择三个领域', 2, null, false);
        //         }
        //     }
        // }
        let lis = document.querySelectorAll('.categoryPubLis');
        for(let a = 0;a < lis.length;a++){
            lis[a].classList.remove("categoryPubLisBg")
        }
        if (e.currentTarget.innerHTML == val) {
            e.currentTarget.classList.add("categoryPubLisBg")
        }
        this.setState({ fcategoryId: fid, categoryId: id, category: val });
        this.props.setState({ fcategoryId: fid,categoryId:id,category:val});
    }
    //默认选中某个值
    initSelectedCategory = () => {
        let categoryId = this.props.state.categoryId;
        let lis = document.querySelectorAll('.categoryPubLis');
        for (let a = 0; a < lis.length; a++) {
            lis[a].classList.remove("categoryPubLisBg");
            if (lis[a].getAttribute("id") == categoryId) {
                lis[a].classList.add("categoryPubLisBg");
            }
        }
    }

    render() {
        return (
            <Motion defaultStyle={{ left: 300 }} style={{left:spring(0,{stiffness: 300, damping: 28})}}>
                {interpolatingStyle => 
                    <div className="needWrap" style={{ ...interpolatingStyle, position: "relative" }}>
                        <div className="forgetNav top">
                            <NavBar
                                mode="light"
                                icon={<Icon type="left" size="lg" color="#707070" />}
                                onLeftClick={() => hashHistory.goBack()}
                                rightContent={
                                    <span onClick={() => {
                                        this.state.category != ""?
                                        // hashHistory.push({
                                        //     pathname:"/creatWork"
                                        // }) : Toast.info('请选择领域', 2, null, false);
                                        hashHistory.goBack() : Toast.info('请选择领域', 1, null, false);
                                        this.props.setState({ categoryId: this.state.categoryId, fcategoryId: this.state.fcategoryId, category: this.state.category })                                
                                    }}>确定</span>
                                }
                            >选择领域</NavBar>
                        </div>
                        <div style={{ height: "1.2rem" }}></div>
                        <div className="wrapper" style={{ overflow: "hidden", height: this.state.height }}>
                            <div className="categoryWrap" >
                                {
                                    this.state.categoryList.map((value) => {
                                        return <div className="categoryPub" key={value.id} id={value.id}>
                                            <h3>{value.menu_name}</h3>
                                            {
                                                value.subMenuList.map((val) => {
                                                    return <CategoryPub
                                                        text={val.menu_name}
                                                        key={val.id}
                                                        id={val.id}
                                                        className="categoryPubLis "
                                                        changeCategory={(e) => { this.changeCategory(e, val.menu_name, val.id, value.id) }}
                                                    ></CategoryPub>
                                                })
                                            }
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        {/* <div className="toast-example">
                            <ActivityIndicator
                                toast
                                text="加载中..."
                                animating={this.state.animating}
                            />
                        </div> */}
                    </div>
                }
            </Motion>
        )
    }
}