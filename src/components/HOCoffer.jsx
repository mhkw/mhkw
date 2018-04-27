import React from "react";
import { hashHistory } from 'react-router';
import { Toast } from "antd-mobile";
import axios from 'axios';
import qs from 'qs';

export default class HOCoffer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            remarks: "", //备注
            proname: '', //项目名称
            customer_email: '', //客户Email
            haveDiscount: false,
            inputDiscountPrice: null, //用户输入的优惠价格，即优先级最大的最终价格
            project_id: 0, //项目ID，这个值在第一次为项目添加客户信息时获取，作为生成报价单的项目ID。其他接口共用这个ID
            offerShareURL: '', //确认发送报价后的分享链接
        }
        //获取自己的服务报价模板列表
        this.handleGetSelfService = (res) => {
            // console.log(res);
            if (res.success) {
                let item_list = res.data.item_list;
                item_list.map((value, index, elem) => {
                    elem[index].number = 1;
                    elem[index].isChecked = false;
                    elem[index].server_name = value.Name;
                    elem[index].describe = value.Description;
                })
                this.setState({ serverList: item_list });
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
        //报价-为项目添加客户信息
        this.handleAddCustomer = (res) => {
            if (res.success) {
                this.setState({
                    project_id: res.data.project_id
                }, ()=>{
                    //拿到project_id后执行其他ajax
                    this.ajaxSaveMainProject();
                })
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
        //报价-添加项目信息
        this.handleSaveMainProject = (res) => {
            if (res.success) {
                // this.setState({
                //     project_id: res.data
                // })
                this.ajaxSaveProjects();
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
        //报价-添加报价详细信息
        this.handleSaveProjects = (res) => {
            if (res.success) {
                this.setState({
                    // project_id: res.data.project_id,
                    father_template_id: res.data.father_template_id,
                })
                this.ajaxSavePayStages();
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
        //报价-添加付款列表,移动端主要是添加优惠方式，即手动输入最终下单的价格。
        this.handleSavePayStages = (res) => {
            if (res.success) {
                this.ajaxSendQuote();
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
        //最后发送报价的ajax处理函数
        this.handleSendQuote = (res) => {
            if (res.success) {
                console.log(res);
                this.setState({
                    offerShareURL: 'https://www.huakewang.com/2017_data/H5offerSheet.html?id=122,name=%E9%83%91%E5%9B%BD%E5%BA%86,phone=17683993335,count=oauth,timestamp=1512631141'
                })
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
    }
    componentDidMount() {
        // console.log("componentDidMount")
        this.ajaxGetSelfServiceList(); 
    }
    ajaxGetSelfServiceList = (limit = 10, offset = 0, pullingUp = false) => {
        //服务模板
        runPromise('get_self_service_template_list', {
            limit,
            offset,
        }, this.handleGetSelfService, true, "post", pullingUp);
    }
    setSelectedCustomer = (value) => {
        let { yunLinkName: customer_name, yunLinkPhone: customer_phone, yunLinkCompany: customer_company, yunLinkEmail: customer_email } = value;
        this.setState({ customer_name, customer_phone, customer_company, customer_email });
    }
    updateCountNumberAndPrice = (checkNum, checkPrice, checkedServerList, showModal, serverList) => {
        this.setState({ 
            checkNum,
            checkPrice,
            checkedServerList, 
            showModal, 
            serverList,
            checkPriceTax: (parseFloat(checkPrice).toFixed(2) * 1.06).toFixed(2)
        })
    }
    CreateOfferQuotation = () => {
        // console.log(this.state);
        this.ajaxAddCustomer();
    }
    //报价-为项目添加客户信息
    ajaxAddCustomer = () => {
        runPromise('add_customer_for_project', {
            linkName: this.state.customer_name,
            linkCompany: this.state.customer_company,
            linkPhone: this.state.customer_phone,
            linkEmail: this.state.customer_email,
            project_id: this.state.project_id,
        }, this.handleAddCustomer);
    }
    //报价-添加项目信息
    ajaxSaveMainProject = () => {
        runPromise('SaveMainProject', {
            projectName: this.state.proname,
            appendixs: '',
            projectDealine: this.state.cut_off_date,
            projectDescription: '',
            project_id: this.state.project_id,
        }, this.handleSaveMainProject);
    }
    //报价-添加报价详细信息
    ajaxSaveProjects = () => {
        runPromise('saveProjects', {
            project_id: this.state.project_id,
            data: this.structureData(),
        }, this.handleSaveProjects);
    }
    //构造Data的函数，返回添加报价详细信息接口参数data
    structureData = () => {
        let NewProjectsData = Object.assign({}, dataProjectsJSON);
        let shortProjectsData = NewProjectsData["history"][0]["section"]["main"][0];
        //构造数据
        let { proname, remarks, checkPrice, checkPriceTax } = this.state;
        NewProjectsData["history"][0]["section"]["proname"] = proname;
        shortProjectsData.priceName = proname;
        shortProjectsData.remarks = remarks;
        shortProjectsData.totalAll = checkPriceTax;
        this.state.checkedServerList.map((value,index)=>{
            let format_number = parseInt(value.number);
            let format_unit_price = parseFloat(value.unit_price).toFixed(2); //格式化的单价
            let format_rate = (format_unit_price * format_number * 0.06 ).toFixed(2); //格式化的税金
            let format_unit_total = (format_unit_price * format_number * 1.06).toFixed(2); //格式化的含税总价格
            let partOne ={};
            partOne.description = value.Name;
            partOne.achievement = "";
            partOne.part = [];
            partOne.part.push({
                "order": "1",
                "content": value.Description,
                "desResult": "",
                "unit": value.unit,
                "number": value.number,
                "price": format_unit_price,
                "rate": format_rate,
                "total": format_unit_total
            });

            shortProjectsData.parts.push(partOne);
        });
        console.log(NewProjectsData);
        return NewProjectsData;
    }
    //报价-添加付款列表
    ajaxSavePayStages = () => {
        let payArr=[];
        let endPriceStr = this.state.inputDiscountPrice ? this.state.inputDiscountPrice : this.state.checkPrice;
        let endPrice = parseFloat(endPriceStr).toFixed(2);
        let price0 = (endPrice * 0.3).toFixed(2);
        let price1 = (endPrice * 0.7).toFixed(2);
        let tax0 = (price0 / 1.06 * 0.06).toFixed(2);
        let tax1 = (price1 / 1.06 * 0.06).toFixed(2);
        payArr.push([1, 30, '预付款', '确认接受订单', price0, tax0]);
        payArr.push([1, 70, '尾款', '任务完成', price1, tax1]);
        runPromise('savePayStages', {
            arrTotal: this.state.checkPriceTax,
            arrDiscount: this.state.haveDiscount && this.state.inputDiscountPrice ? this.state.inputDiscountPrice : null,
            discountCashMoney: this.state.inputDiscountPrice ? (parseFloat(this.state.inputDiscountPrice).toFixed(2) / 1.06 * 0.06).toFixed(2) : 0.00 ,
            totalCashMoney: (parseFloat(this.state.checkPrice).toFixed(2) * 0.06).toFixed(2),
            project_id: this.state.project_id,
            arr: payArr,
        }, this.handleSavePayStages);
    }
    //最后发送报价
    ajaxSendQuote = () => {
        // runPromise('send_quote', {
        //     project_id: this.state.project_id,
        // }, this.handleSendQuote);
        Toast.loading('发送报价中，请稍候',6);
        axios({
            method: 'post',
            url: 'https://www.huakewang.com/quoteApi/send_quote_ex',
            withCredentials: true,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            responseType: 'json',
            data: qs.stringify({
                project_id: this.state.project_id,
            })
        })
            .then((response) => {
                Toast.hide();
                requestIsSuccess(response) && this.handleSendQuote(response.data)
            })
            .catch((error) => {
                Toast.hide();
                console.log(error, "错误");
            });
    }
    render () {
        return (
            <div className="hoc-offer-box">
                {this.props.children && 
                    React.cloneElement(
                        this.props.children, 
                        { 
                            state: this.state,
                            setState: this.setState.bind(this),
                            setSelectedCustomer: this.setSelectedCustomer, 
                            updateCountNumberAndPrice: this.updateCountNumberAndPrice, 
                            remarks: this.state.remarks,
                            customer_name: this.state.customer_name,
                            customer_phone: this.state.customer_phone,
                            customer_company: this.state.customer_company,
                            customer_email: this.state.customer_email,
                            proname: this.state.proname,
                            cut_off_date: this.state.cut_off_date,
                            cut_off_day: this.state.cut_off_day,
                            date: this.state.date,
                            haveDiscount: this.state.haveDiscount, //是否设置优惠项
                            inputDiscountPrice: this.state.inputDiscountPrice, //用户输入的优惠价格
                            CreateOfferQuotation: this.CreateOfferQuotation, // 最后的点击，生成报价单
                            offerShareURL: this.state.offerShareURL,
                            ajaxGetSelfServiceList: this.ajaxGetSelfServiceList,
                        }
                    ) 
                }
            </div>
        )
    }
}

//添加报价详细信息数据,数据结构较为复杂，整个作为ajax的date参数
let dataProjectsJSON = {
    "history": [
        {   
            "section": {
                "proname": "", 
                "main": [   //报价单（移动端就一个报价单）
                    {
                        "priceName": "",  //报价单名称 = 项目名称
                        "cash": "要发票(税6%)",    //默认6%
                        "remarks": "",
                        "totalAll": "",      //报价单总计
                        "parts": []  //部分（每个服务当一部分，只会有一条详细，不会有多条）
                    }
                ]
            }
        }
    ]
}
/**
 * 判断请求是不是返回成功。如果是，则传递req，否则判断是不是未登入，如果不是弹出错误信息，否则自动跳转到未登录页
 * 
 * @author ZhengGuoQing
 * @param {any} req 
 */
function requestIsSuccess(req) {
    let res = req.data;
    if (res && res.success) {
        return true;
    } else if (res.field == "user_id" || res.field == "username") {
        Toast.offline("请先登录!", 1, () => {
            validate.setCookie("user_id", "");
            //如果没登录，跳转到登录页
            hashHistory.push({
                pathname: '/login',
                query: { form: 'promise' }
            });
        })
        return false;
    } else {
        //返回失败也要返回数据，因为返回失败可能要做其他的事
        // Toast.offline(res.message, 1)
        return true;
    }
}