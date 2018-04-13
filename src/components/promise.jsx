import { hashHistory } from 'react-router';
import { Toast } from 'antd-mobile';

import axios from 'axios';
import qs from 'qs';

let Ajax = axios.create({
    // baseURL: 'https://bird.ioliu.cn/v2?Content-Type=application/x-www-form-urlencoded&url=https://www.huakewang.com/',
    baseURL: 'https://www.huakewang.com/',
    timeout: 6000,
    withCredentials: true,
    crossDomain: true,
    // headers: {
    //     Cookie: "ci_session=jQLusrFoBaPLWfwJG4zt%2FP265m3d7qCxNYFy19G8eTv0YCDjnFVsFZhjxA5xI7Bsh%2BMEty2KWJXUY67MnSHKG5kezbqmEVfKsGHwD7mbYIY1ZlNbCP1dPaB3pIWl8gViyWhubKeqVETam2mjibFS053uf4YVl1SKf6PnwueUnstjRakBKg7KNeStEo%2BlHV1hBcTvbxLeLyDv6m1Ju2p2J3bELZxyJyfn2co6x9n3J7Vker20Z9Cjn6%2BjIUf9R6BZysoEjiGDp%2FUctRSrQo6O9dGXCXTMAyQ7h1Ynsj3arIua5%2BcWeVFE8p6GmOIjQr63Ro%2BVYkkdeWDEdd%2FQ5Qi2NxvmSRzbVGSggmVrlTBIssc0UcLlC1WPHYZF%2FOdOKFDZfXa4A51Op3k5DrLNsAkZ8R1RlezGIDpJutuRTPx%2Boc%2F9O9NellglJMT6C4xFZgF65ReWiFInPWYZnU9pp9kPYX1MpeAPGAtkiJVZSCi96FghOot8tjvKhzKbf%2FzbpF%2FE;"
    // }
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

const ajaxURLList = {
    get_user_list_ex: "hkw_newapi/get_user_list_ex", //获取设计师列表 
    get_circle_list:"hkw_newapi/get_circle_list",       //画客圈
    add_love:"hkw_newapi/add_love",       //点赞
    get_comment_list: "hkw_newapi/get_comment_list",       //获取评论列表
    get_rep_comment_list:"hkw_newapi/get_rep_comment_list",       //获取评论列表,新增
    add_comment: "hkw_newapi/add_comment", //添加评论
    get_project_list: "hkw_newapi/get_project_list", //获取项目列表
    get_menu_class: "hkw_newapi/get_menu_class", //获取作品分类
    get_works_list_ex: "hkw_newapi/get_works_list_ex", //获取作品列表
    rep_comment: "hkw_newapi/rep_comment", //添加回复
    search: "hkw_newapi/search", //获取搜索设计师列表
    get_works_list: "hkw_newapi/get_works_list/NULL/add_time/16/1/f", //临时测试
    get_blance: "payapi/get_blance", //支付-获取现金余额
    get_designer_tree:"hkw_newapi/get_designer_tree",
    book_service_simple: "quoteApi/book_service_simple", //创建订单-给设计师下单
    get_main_project_list:"quoteApi/get_main_project_list", //获取服务订单和约见订单
    login:"hkw_newapi/login",   //登陆
    reg:"hkw_newapi/reg",    //注册
    get_pass:"hkw_newapi/get_pass",    //修改密码
    check:"verifycode/check",  //图形验证码验证
    get_reg_sms_code:"hkw_newapi/get_reg_sms_code",  //获取短信验证码
    get_reg_status:"hkw_newapi/get_reg_status",     //判断是否注册过
    get_self_info:"hkw_newapi/get_self_info",       //获取个人信息
    get_user_info:"hkw_newapi/get_user_info",       //获取个人信息需登陆
    get_frozen_cash:"payapi/get_frozen_cash",       //获取冻结资金
    get_real_name_auth:"hkw_newapi/get_real_name_auth",       //获取实名认证状态
    get_financial_list:"payapi/get_financial_list",           //获取交易记录
    add_service_template: "quoteApi/add_service_template", //报价-新增服务模板
    get_self_service_template_list: "quoteApi/get_self_service_template_list", // 报价-获取自己的服务报价模板列表
    project_pay_confirm: "quoteApi/project_pay_confirm", //报价订单，同意验收
    do_appraise: "quoteApi/do_appraise", //报价订单，评价
    project_pay_ask: "quoteApi/project_pay_ask", //报价订单，提醒验收，申请验收
    project_pay_remind: "quoteApi/project_pay_remind", //报价订单，提醒验收，验收提醒
    change_main_project_status: "quoteApi/change_main_project_status", //报价订单，报价状态切换
    get_pay_param: "payapi/get_pay_param", //支付-获取签名后的订单参数
    applay_for_withdraw: "payapi/applay_for_withdraw", //支付-申请提现
    get_withdraw_info: "payapi/get_withdraw_info", //支付-提现，正在提现中的金额
    getCustomers: "quoteApi/getCustomers", //报价-获取登录用户的客户列表
    addCustomer: "quoteApi/addCustomer", //报价-新增客户信息
    delCustomer: "quoteApi/delCustomer", //报价-删除客户信息
    add_customer_for_project: "quoteApi/add_customer_for_project", //报价-为项目添加客户信息
    SaveMainProject: "quoteApi/SaveMainProject", //报价-添加项目信息
    saveProjects: "quoteApi/saveProjects", //报价-添加报价详细信息
    savePayStages: "quoteApi/savePayStages", //报价-添加付款列表
    send_quote: "quoteApi/send_quote", //报价-发送报价
    get_user_works_list_ex: "hkw_newapi/get_user_works_list_ex", //获取个人作品列表
    get_works_info: "hkw_newapi/get_works_info", //作品详情页
    logout: "hkw_newapi/logout",   //退出登录
    change_password: "hkw_newapi/change_password",   //修改密码
    upload_image_byw_upy2: "upload/upload_image_byw_upy2", //base64转图片
    get_menu_class: "hkw_newapi/get_menu_class", //获取作品类别
    add_project: "hkw_newapi/add_project", //获取作品类别
    add_works_ex: "hkw_newapi/add_works_ex", //发布作品
    getKeycode: "hkw_newapi/getKeycode", //自动提取关键词
    add_circle: "hkw_newapi/add_circle", //发布帖子
    search: "hkw_newapi/search", //关键词搜索
    get_search_history: "hkw_newapi/get_search_history", //获取搜索记录
    delete_search_history: "hkw_newapi/delete_search_history", //删除搜索记录
    activity: "hkw_newapi/activity", //活动
    get_user_history_coordinate: "hkw_newapi/get_user_history_coordinate", //常用地址列表
    delete_user_coordinate: "hkw_newapi/delete_user_coordinate", //删除常用地址
    change_user_coordinate: "hkw_newapi/change_user_coordinate", //修改或新增某个常用地址
    user_report: "hkw_newapi/user_report", //投诉某个人
    add_user_black: "hkw_newapi/add_user_black", //将某个人添加黑名单
    delete_user_black: "hkw_newapi/delete_user_black", //将某个人移出黑名单
    add_favorite: "hkw_newapi/add_favorite", //添加关注，如果已经关注了则取消关注，后端自动判断是关注还行取消关注
    get_my_user_black_list: "hkw_newapi/get_my_user_black_list", //黑名单列表
    get_favoriter_favorite_list: "hkw_newapi/get_favoriter_favorite_list", //我的粉丝列表
    change_self_important_info: "hkw_newapi/change_self_important_info", //修改个人重要信息，包括手机号和邮箱地址
    get_validate_code_by_email: "hkw_newapi/get_validate_code_by_email", //获取邮件验证码
    get_user_base_info: "hkw_newapi/get_user_base_info", //获取个人基本信息，用来查看邮箱，手机，隐私设置关闭个人主页
    get_notice_set_list: "hkw_newapi/get_notice_set_list", //获取通知设置列表 ,个人设置页面
    get_privacy_set_list: "hkw_newapi/get_privacy_set_list", //获取隐私设置列表 ,个人设置页面
    change_notice_set: "hkw_newapi/change_notice_set", //设置通知设置的某一项, 个人设置页面
    change_privacy_set: "hkw_newapi/change_privacy_set", //设置隐私设置的某一项，不包括关闭个人主页, 个人设置页面
    change_user_info: "hkw_newapi/change_user_info", //设置隐私设置，设置我的主页是否显示, 个人设置页面

}

function get_user_list_ex(params) {
    
}

//定义一个基于Promise的异步任务执行器
function run(taskDef) {
    //创建迭代器
    let task = taskDef();

    //开始执行任务
    let result = task.next();

    //递归函数遍历
    (function step() {

        //如果有更多任务要做
        if (!result.done) {
            //用一个Promise来解决会简化问题
            let promise = Promise.resolve(result.value);
            promise.then(function (value) {
                result = task.next(value);
                step();
            }).catch(function (error) {
                result = task.throw(error);
                step();
            });
        }
    }())
}


/**
 * 执行异步任务执行器的函数
 * 
 * @author ZhengGuoQing
 * @param {String} ajaxName 具体执行ajax的请求名称
 * @param {Object} param ajax请求的参数对象，必须是对象，属性名和ajax参数的属性名相同
 * @param {Function} handle ajax执行完成后的处理函数
 * @param {Boolean} mustLogin 是否必须登录后才能发送请求，判断登录是查询本地存储的token
 * @param {String} method ajax请求类型，默认是post
 * @param {String} handleParam ajax执行完成后的处理函数的参数
 */
export default function runPromise(ajaxName, param, handle, mustLogin = false, method="post", handleParam) {
    let cookie_user_id = getCookie('user_id');
    if (mustLogin && !cookie_user_id) {
        //如果没登录，跳转到登录页
        hashHistory.push({
            pathname: '/login',
            query: { form: 'promise' }
        });
        return;
    }
    
    let serializeParam = { "user_id": cookie_user_id };
    let en_user_id = localStorage.getItem("en_user_id");
    if (en_user_id && en_user_id != "undefined") {
        serializeParam = { "user_id": cookie_user_id, en_user_id };
    }
    // let serializeParam = {};
    if (method == "post") {
        Object.assign(serializeParam, param);
    } else {
        serializeParam = param;
    }
    
    run(function* () {
        // let contents = yield ajaxName(param);
        let contents = yield sendAjax(ajaxURLList[ajaxName], serializeParam, method);
        handle(contents.data, handleParam);
    })
}

//发送ajax请求通用
function sendAjax(url, param, method) {
    return new Promise(function (resolve, reject) {
        if (method.toLowerCase() == "get") {
            let URL = url;
            if (param instanceof Object) {
                for (const key in param) {
                    if (param.hasOwnProperty(key)) {
                        const element = param[key];
                        URL += "/" + param[key];
                    }
                }
            }
            Ajax.get(URL).then(req => {
                requestIsSuccess(req) && resolve(req); //先判断请求是否返回成功
            }).catch(error => {
                //全局处理网络请求错误
                console.log(error);
                reject(error);
            });
        } else {
            Ajax.post(url, qs.stringify(param)).then(req => {
                requestIsSuccess(req) && resolve(req); //先判断请求是否返回成功
            }).catch(error => {
                //全局处理网络请求错误
                console.log(error);
                reject(error);
            });
        }
    });
}

/**
 * 获取cookie
 * 
 * @author ZhengGuoQing
 * @param {any} name 
 * @returns 
 */
function getCookie(name) {
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return decodeURIComponent(arr[2]); return null;
};

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
    } else if (res.field == "user_id" || res.field == "username" || req.filed == "login") {
        Toast.offline("请先登录!", 1, ()=>{
            validate.setCookie("user_id","");
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