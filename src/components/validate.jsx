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
const CheckKeywords = (value) => {
    if(value.length > 18 || value.length < 6) {
        return {
            hasError: true,
            errorMessage: '请输入6-18位密码'
        }
    }
    return {
        hasError: false,
    }
}

export { CheckPhone, CheckKeywords };