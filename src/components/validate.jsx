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

const getCookie = (name) => {
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return decodeURIComponent(arr[2]); return null;
};

const setCookie = (name, value, time) => {
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString();
};
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

export default {
    CheckPhone, 
    CheckKeywords, 
    getCookie, 
    setCookie
}
// export { CheckPhone, CheckKeywords, getCookie, setCookie};