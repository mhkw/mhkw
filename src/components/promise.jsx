import { hashHistory } from 'react-router';
import { Toast } from 'antd-mobile';

import axios from 'axios';
import qs from 'qs';

let Ajax = axios.create({
    // baseURL: 'https://bird.ioliu.cn/v2?Content-Type=application/x-www-form-urlencoded&url=https://www.huakewang.com/',
    baseURL: 'https://www.huakewang.com/',
    timeout: 2000,
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

const ajaxURLList = {
    get_user_list_ex: "hkw_newapi/get_user_list_ex", //获取设计师列表 
    search: "hkw_newapi/search", //获取搜索设计师列表
    get_works_list: "hkw_newapi/get_works_list/NULL/add_time/16/1/f", //临时测试
    get_blance: "payapi/get_blance", //支付-获取现金余额
    get_designer_tree:"hkw_newapi/get_designer_tree"
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

    run(function* () {
        // let contents = yield ajaxName(param);
        let contents = yield sendAjax(ajaxURLList[ajaxName], param, method);
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
                resolve(req);
            }).catch(error => {
                //全局处理网络请求错误
                console.log(error);
                reject(error);
            });
        } else {
            Ajax.post(url, qs.stringify(param)).then(req => {
                resolve(req);
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