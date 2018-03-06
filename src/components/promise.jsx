import { hashHistory } from 'react-router';
import { Toast } from 'antd-mobile';

import axios from 'axios';
import qs from 'qs';

let Ajax = axios.create({
    // baseURL: 'https://bird.ioliu.cn/v2?Content-Type=application/x-www-form-urlencoded&url=https://www.huakewang.com/',
    baseURL: 'https://www.huakewang.com/',
    timeout: 2000,
    withCredentials: true,
    crossDomain: true,
    // headers: {
    //     Cookie: "ci_session=jQLusrFoBaPLWfwJG4zt%2FP265m3d7qCxNYFy19G8eTv0YCDjnFVsFZhjxA5xI7Bsh%2BMEty2KWJXUY67MnSHKG5kezbqmEVfKsGHwD7mbYIY1ZlNbCP1dPaB3pIWl8gViyWhubKeqVETam2mjibFS053uf4YVl1SKf6PnwueUnstjRakBKg7KNeStEo%2BlHV1hBcTvbxLeLyDv6m1Ju2p2J3bELZxyJyfn2co6x9n3J7Vker20Z9Cjn6%2BjIUf9R6BZysoEjiGDp%2FUctRSrQo6O9dGXCXTMAyQ7h1Ynsj3arIua5%2BcWeVFE8p6GmOIjQr63Ro%2BVYkkdeWDEdd%2FQ5Qi2NxvmSRzbVGSggmVrlTBIssc0UcLlC1WPHYZF%2FOdOKFDZfXa4A51Op3k5DrLNsAkZ8R1RlezGIDpJutuRTPx%2Boc%2F9O9NellglJMT6C4xFZgF65ReWiFInPWYZnU9pp9kPYX1MpeAPGAtkiJVZSCi96FghOot8tjvKhzKbf%2FzbpF%2FE;"
    // }
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

const ajaxURLList = {
    get_user_list_ex: "hkw_newapi/get_user_list_ex", //获取设计师列表 
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
    get_financial_list:"payapi/get_financial_list",       //获取交易记录
    add_service_template: "quoteApi/add_service_template", //报价-新增服务模板
    get_self_service_template_list: "quoteApi/get_self_service_template_list", // 报价-获取自己的服务报价模板列表
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
    Object.assign(serializeParam, param);
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
    } else if (res.field == "user_id" || res.field == "username") {
        Toast.offline("请先登录!", 1, ()=>{
            //如果没登录，跳转到登录页
            hashHistory.push({
                pathname: '/login',
                query: { form: 'promise' }
            });
        })
        return false;
    } else {
        Toast.offline("请求错误!", 1)
        return false;
    }
}