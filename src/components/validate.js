// 验证手机号
const CheckPhone = (value) => {
    if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
        return {
            hasError: true,
            errorMessage: '请输入正确的11位手机号'
        }
    }
    return {
        hasError: false
    }
}
//验证密码长度
const CheckKeywords = (value) => {
    if(value.length < 6) {
        return {
            hasError: true,
            errorMessage: '密码长度不能低于6位'
        }
    }
    return {
        hasError: false
    }
}
//短信验证码

// const getCookie = (name) => {
//     let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
//     if (arr != null) return decodeURIComponent(arr[2]); return null;
// };

// const setCookie = (name, value, time) => {
//     var strsec = getsec(time);
//     var exp = new Date();
//     exp.setTime(exp.getTime() + strsec * 1);
//     document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString();
// };
const getCookie = (name) => {
    return localStorage.getItem("mock_cookie_" + name);
}
const setCookie = (name, value) => {
    return localStorage.setItem("mock_cookie_" + name, value);
}

const getsec = (str) => {
    if (str == "" || str == null) {
        str = "3d";
    }
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
        return str1 * 1000;
    } else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;
    } else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;
    }
}
const timetrans = (date) => {
    var date = new Date(date * 1000);//如果date为10位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    // return Y + M + D + h + m + s;
    return Y + M + D;
}
export default {
    CheckPhone, 
    CheckKeywords, 
    getCookie, 
    setCookie,
    timetrans
}
// export { CheckPhone, CheckKeywords, getCookie, setCookie};