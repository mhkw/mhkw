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

export { CheckPhone, CheckKeywords };