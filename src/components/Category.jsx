import React from 'react'
import { hashHistory } from 'react-router'
import { NavBar, List, Icon, Toast} from 'antd-mobile'
import { Line, Jiange, CategoryPub} from './templateHomeCircle';



export default class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryList: JSON.parse(sessionStorage.getItem("categoryData")) ? JSON.parse(sessionStorage.getItem("categoryData")) : [],
            categoryId:"",
            category:""
        };
        this.getPicsLis=(res)=>{
            console.log(res);
            if(res.success) {
                this.setState({ 
                    categoryList:res.data
                })
                sessionStorage.setItem("categoryData", JSON.stringify(res.data))
            }
        }
    }
    componentDidMount() {
        runPromise("get_menu_class", {num:148}, this.getPicsLis, false, "get");
    }
    changeCategory=(e,val,id)=>{
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
            // lis[a].classList.remove("categoryPubLisBg")
        }
        if (e.currentTarget.innerHTML == val) {
            // e.currentTarget.classList.add("categoryPubLisBg")
        }
        this.setState({categoryId:id,category:val})
    }

    render() {
        return (
            <div className="needWrap">
                <div className="forgetNav" key="1">
                    <NavBar
                        mode="light"
                        icon={<Icon type="left" size="lg" color="#707070" />}
                        onLeftClick={() => hashHistory.goBack()}
                        rightContent={
                            <span onClick={() => {
                                // this.state.category != ""?
                                // hashHistory.push({
                                //     pathname:"/creatNeed",
                                //     query:{category:this.state.category,categoryId:this.state.categoryId}
                                // }) : Toast.info('请选择领域', 2, null, false);
                            }}>确定</span>
                        }
                    >选择领域</NavBar>
                </div>
                <div style={{ height: "1.2rem" }}></div>
                <div className="categoryWrap">
                    {
                        this.state.categoryList.map((value) => {
                            return <div className="categoryPub">
                                <h3>{value.menu_name}</h3>
                                {
                                    value.subMenuList.map((value) => {
                                        return <CategoryPub 
                                            text={value.menu_name} 
                                            id={value.id}
                                            className="categoryPubLis "
                                            changeCategory={(e)=>{this.changeCategory(e,value.menu_name,value.id)}}
                                        ></CategoryPub>
                                    })
                                }
                            </div>
                        })
                    }
                    
                </div>
            </div>
        )
    }
}