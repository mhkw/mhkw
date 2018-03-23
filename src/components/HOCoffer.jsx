import React from "react";
import { Toast } from "antd-mobile";

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
                })
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
        //报价-添加项目信息
        this.handleSaveMainProject = (res) => {
            if (res.success) {
                this.setState({
                    project_id: res.data
                })
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
        //报价-添加报价详细信息
        this.handleSaveProjects = (res) => {
            if (res.success) {
                this.setState({
                    project_id: res.data.project_id,
                    father_template_id: res.data.father_template_id,
                })
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
        //报价-添加付款列表,移动端主要是添加优惠方式，即手动输入最终下单的价格。
        this.ajaxSavePayStages = (res) => {
            if (res.success) {
                
            } else {
                Toast.fail(res.message, 1.5);
            }
        }
    }
    componentDidMount() {
        console.log("12")
        //服务模板
        runPromise('get_self_service_template_list', {
            offset: 0,
            limit: 10,
        }, this.handleGetSelfService, true);
    }
    setSelectedCustomer = (value) => {
        let { yunLinkName: customer_name, yunLinkPhone: customer_phone, yunLinkCompany: customer_company, yunLinkEmail: customer_email } = value;
        this.setState({ customer_name, customer_phone, customer_company, customer_email });
    }
    updateCountNumberAndPrice = (checkNum, checkPrice, checkedServerList, showModal, serverList) => {
        this.setState({ checkNum, checkPrice, checkedServerList, showModal, serverList })
    }
    CreateOfferQuotation = () => {
        console.log(this.state);
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
        let { proname, remarks, checkPrice, } = this.state;
        shortProjectsData.priceName = proname;
        shortProjectsData.remarks = remarks;
        shortProjectsData.totalAll = (parseFloat(checkPrice).toFixed(2) * 1.06).toFixed(2);
        this.state.checkedServerList.map((value,index)=>{
            let format_number = parseInt(value.number);
            let format_unit_price = parseFloat(value.unit_price).toFixed(2); //格式化的单价
            let format_rate = (format_unit_price * format_number * 0.06 ).toFixed(2); //格式化的税金
            let format_unit_total = (format_unit_price * format_number * 1.06).toFixed(2); //格式化的含税总价格
            let partOne ={};
            partOne.description = value.Name;
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
        return NewProjectsData;
    }
    //报价-添加付款列表
    ajaxSavePayStages = () => {
        runPromise('savePayStages', {
            arrTotal: (parseFloat(this.state.checkPrice).toFixed(2) * 1.06).toFixed(2),
            arrDiscount: this.state.haveDiscount && this.state.inputDiscountPrice ? this.state.inputDiscountPrice : null,
            discountCashMoney: 0.00,
            totalCashMoney: 0.18,
            project_id: this.state.project_id,
        }, this.handleSavePayStages);
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