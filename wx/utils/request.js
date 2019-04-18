import env from './../env'

/**
 * promise请求
 * 参数：参考wx.request
 * 返回值：[promise]res
 */
export function requestP(options = {}) {
    const {
        url,
        data,
        header,
        method,
        dataType,
        responseType,
        success,
        fail,
        complete
    } = options;

    return new Promise((res, rej) => {
        wx.request({
            url,
            data,
            header: {
                'content-type': 'application/json',
                'token': wx.getStorageSync('token'), // 默认值
                'appname':  env.appname,
                'appversion': env.appversion
            },
            method,
            dataType,
            responseType,
            success({data, statusCode}) {
                const isSuccess = isHttpSuccess(statusCode);
                if (isSuccess) { // 成功的请求状态
                    if (data.code == 1) {
                        showErr(data.errorMsg)
                    }else if (data.code == 2) {
                        wx.showModal({
                            title: '登录超时',
                            content: '登录超时请重新登录',
                            complete: function () {
                                wx.removeStorage({key: 'token'});
                                wx.removeStorage({key: 'doctorsList'});
                                wx.reLaunch({url: '/pages/signIn/signIn'});
                            }
                        })
                    }
                    res(data);
                } else {
                    rej({
                        msg: `网络错误:${statusCode}`,
                        detail: data
                    });
                }
            },
            fail(err) {
                // rej(err);
                showErr(err);
            },
            complete() {
                wx.hideLoading();
            }
        });
    });
}

/**
 * 判断请求状态是否成功
 * 参数：http状态码
 * 返回值：[Boolen]
 */
function isHttpSuccess(status) {
    return status >= 200 && status < 300 || status === 304;
}

/**
 * 提炼错误信息
 * 参数：err
 * 返回值：[string]errMsg
 */
function errPicker(err) {
    if (typeof err === 'string') {
        return err;
    }
    return err.msg || err.errMsg || (err.detail && err.detail.errMsg) || '未知错误';
}

/**
 * 错误弹窗
 */
function showErr(err) {
    const msg = errPicker(err);
    wx.showModal({
        showCancel: false,
        content: msg
    });
}