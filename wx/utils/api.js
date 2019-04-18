import {requestP} from './request'
import env from './../env'

const domain = env.url;

const R = {
    //获取验证码
    userPhlogincode(phone) {
        const url = `${domain}/user/phlogincode/?username=${phone}`
        return requestP({
            url,
            method: 'POST'
        });
    },
    //登陆
    userPhlogin(phone, code) {
        const url = `${domain}/user/phlogin/?username=${phone}&code=${code}`
        return requestP({
            url,
            method: 'POST'
        });
    },

    myDoctorList() {
        const url = `${domain}/my/doctor/list/`
        return requestP({
            url,
            method: 'GET'
        });
    },

    userMemberInfo(memberId) {
        const url = `${domain}/user/member/info/?memberId=${memberId}`
        return requestP({
            url,
            method: 'GET'
        });
    },
    //查看更多
    userLabelList(memberId) {
        const url = `${domain}/user/label/list/?memberId=${memberId}&type=2`
        return requestP({
            url,
            method: 'GET'
        });
    },

    mixiFindScreen(name, lon, lat, page) {
        const url = `${domain}/mixi/find/screen/?name=${name}&longitude=${lon}&latitude=${lat}&page=${page}`
        return requestP({
            url,
            method: 'GET'
        });
    },

    mixiFindScreenByRealName(lon, lat, realname, name) {
        const url = `${domain}/mixi/find/screen/?longitude=${lon}&latitude=${lat}&realname=${realname}&name=${name}&`
        return requestP({
            url,
            method: 'GET'
        });
    },

}

export default R;