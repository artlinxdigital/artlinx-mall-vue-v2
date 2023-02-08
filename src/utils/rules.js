// 验证手机号码
export function checkPhoneNumber(value) {
    const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[0-9]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    return reg.test(value);
}

// 验证邮箱
export function checkEmail(value) {
    const reg = /^[\da-z]+([\-\.\_]?[\da-z]+)*@[\da-z]+([\-\.]?[\da-z]+)*(\.[a-z]{2,})+$/;
    return reg.test(value);
}

export function isUK() {
    if (window.location.host.indexOf("artlinx.uk") > 0) {
        return true;
    } else {
        return false;
    }
}

// 验证身份证号码
export function checkIdNum(value) {
    const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
    return reg.test(value);
}

// 人脸识别错误信息
export function faceAuthErrMsg(code) {
    let errMsg = new Map();
    errMsg.set('1001', '调用活体引擎接口出错');
    errMsg.set('1002', '疑似非真人录制');
    errMsg.set('1003', 'video实人（真人）检测未通过');
    errMsg.set('1004', '人脸检测失败，无法提取比对照');
    errMsg.set('1005', '活体检测未通过');
    errMsg.set('1006', '证照库出错，请重试');
    errMsg.set('1101', '未检测到声音');
    errMsg.set('1102', '脸部未完整露出');
    errMsg.set('1103', '声音识别失败');
    errMsg.set('1104', 'video格式有误');
    errMsg.set('1105', 'video拉取失败，请重试');
    errMsg.set('1106', 'video声音太小');
    errMsg.set('1107', 'video为空，或大小不合适，请控制录制时长在6s左右');
    errMsg.set('1108', 'video像素太低');
    errMsg.set('1109', '嘴唇动作幅度过小');
    errMsg.set('1201', '光线太暗');
    errMsg.set('1202', '光线太强');
    errMsg.set('1203', '脸离屏幕太近');
    errMsg.set('1204', '脸离屏幕太右');
    errMsg.set('1205', '脸离屏幕太远');
    errMsg.set('1206', '脸离屏幕太左');
    errMsg.set('1207', '未检测到闭眼动作');
    errMsg.set('1208', '未检测到第一个动作');
    errMsg.set('1209', '未检测到张嘴动作');
    errMsg.set('1210', '未能检测到完整人脸');
    errMsg.set('1301', '实人检测失败');
    errMsg.set('1302', '实人检测未达到通过标准');
    errMsg.set('1303', 'video录制时间过短，请录制2秒以上的video');
    errMsg.set('2001', '调用比对引擎接口出错');
    errMsg.set('2002', '输入的姓名有误');
    errMsg.set('2003', '输入的身份证号有误');
    errMsg.set('2004', '传入图片过大或过小');
    errMsg.set('2005', '库中无此号，请到户籍所在地进行核实');
    errMsg.set('2006', '姓名和身份证号不一致，请核实后重试');
    errMsg.set('2007', '库中无此用户照片，请到户籍所在地进行核实');
    errMsg.set('2008', '客户库自建库或认证中心返照失败，请稍后再试');
    errMsg.set('2009', '传入图片分辨率太低，请重新上传');
    errMsg.set('2010', '人脸检测失败，无法提取比对照');
    errMsg.set('2011', '实人比对未通过');
    errMsg.set('2012', '检测到多张人脸');
    errMsg.set('2013', '未能检测到完整人脸');
    errMsg.set('2014', '传入图片分辨率太低，请重新上传');
    errMsg.set('2015', '比对失败');
    errMsg.set('2016', '比对相似度未达到通过标准');
    errMsg.set('3001', '无摄像头权限，请允许页面使用摄像头权限');
    errMsg.set('400101', '不合法的请求');
    errMsg.set('400102', '不合法的请求');
    errMsg.set('400103', '服务器拒绝访问此接口');
    errMsg.set('400104', '服务器拒绝访问此接口');
    errMsg.set('400502', '请求上送版本参数错误');
    errMsg.set('400504', '请求访问频率过高');
    errMsg.set('400506', '请求频率过高,请稍后再试');
    errMsg.set('400601', '请求参数体过大');
    errMsg.set('400604', '上送video非实时录制');
    errMsg.set('66660001', '不合法请求');
    errMsg.set('66660002', '服务已过有效期');
    errMsg.set('66660004', '无法确认为同一人');
    errMsg.set('66660005', '无照片信息，无法比对');
    errMsg.set('66660010', '姓名和身份证不一致，请确认');
    errMsg.set('66660011', '无此查询结果');
    errMsg.set('66660015', '姓名或身份证不合法');
    errMsg.set('66660016', 'video格式或大小不合法');
    errMsg.set('66660017', '验证次数超限');
    errMsg.set('66660018', '操作超时，请退出重试');
    errMsg.set('66660021', '网络不给力，Please wait for a moment');
    errMsg.set('66660022', '动态数字失效，请重新验证');
    errMsg.set('66660023', '请确保本人操作且正脸对框');
    errMsg.set('66660036', '请确保本人操作且正脸对框');
    errMsg.set('-5020', '请确保本人操作且正脸对框');
    errMsg.set('-5025', '请确保本人操作且正脸对框');
    errMsg.set('66660024', '无此证件号码');
    errMsg.set('66660025', '请确保本人操作且正脸对框');
    errMsg.set('66660026', '高清照大小不符合');
    errMsg.set('66660030', '不支持此类型服务');
    errMsg.set('66660033', '图片中人脸数超限，请确保最多只有两张脸');
    errMsg.set('66660035', '未识别到人脸，请确保正脸对框且清晰完整');
    errMsg.set('-1102', '未识别到人脸，请确保正脸对框且清晰完整');
    errMsg.set('66660037', '照片出现多张脸');
    errMsg.set('66660038', '未识别到人脸，请确保正脸对框且清晰完整');
    errMsg.set('-1101', '未识别到人脸，请确保正脸对框且清晰完整');
    errMsg.set('-4014', '未识别到人脸，请确保正脸对框且清晰完整');
    errMsg.set('66660039', '证件照不存在或无法处理');
    errMsg.set('66660040', '证件照不存在或无法处理');
    errMsg.set('-4017', '证件照不存在或无法处理');
    errMsg.set('-4018', '证件照不存在或无法处理');
    errMsg.set('66660041', '脸部有遮挡，请保持人脸清晰无遮挡');
    errMsg.set('66660042', '照片模糊，请保持人脸清晰勿晃动');
    errMsg.set('-5001', 'video异常，请重新录制');
    errMsg.set('-5005', '离屏幕太近或太远；录制时，确保人脸清晰完整');
    errMsg.set('-5008', '声音未能识别，请大声慢读一遍数字');
    errMsg.set('-5009', 'video中人脸检测不到；录制时，确保人脸清晰完整');
    errMsg.set('-5010', '声音未能识别；请大声慢读一遍数字');
    errMsg.set('-5011', '未识别到人脸；请保持本人操作且正脸对框');
    errMsg.set('-5018', '未识别到眨眼；录制时请保持正脸对框且眨眼');
    errMsg.set('-5027', '请确保本人操作且正脸对框');
    errMsg.set('-1404', '请确保本人操作且正脸对框');
    return errMsg.get(code);
}

/**
 * @param: fileName - 文件名称
 * @param: 数据go back 1) 无后缀匹配 - false
 * @param: 数据go back 2) 匹配图片 - image
 * @param: 数据go back 3) 匹配 txt - txt
 * @param: 数据go back 4) 匹配 excel - excel
 * @param: 数据go back 5) 匹配 word - word
 * @param: 数据go back 6) 匹配 pdf - pdf
 * @param: 数据go back 7) 匹配 ppt - ppt
 * @param: 数据go back 8) 匹配 video - video
 * @param: 数据go back 9) 匹配 audio - radio
 * @param: 数据go back 10) 其他匹配项 - other
 * @author: ljw
 **/

export function matchFileSuffixType(fileName) {
    // 后缀获取
    var suffix = '';
    // 获取类型结果
    var result = '';
    try {
        var flieArr = fileName.split('.');
        suffix = flieArr[flieArr.length - 1].toLowerCase();
        console.log('suffix:', suffix);
    } catch (err) {
        suffix = '';
    }
    // fileName无后缀go back false
    if (!suffix) {
        result = false;
        return result;
    }
    // 图片格式
    var imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
    // 进行图片匹配
    result = imglist.some(function (item) {
        return item == suffix;
    })
    if (result) {
        result = 'image';
        return result;
    }
    // 匹配txt
    var txtlist = ['txt'];
    result = txtlist.some(function (item) {
        return item == suffix;
    })
    if (result) {
        result = 'txt';
        return result;
    }
    // 匹配 excel
    var excelist = ['xls', 'xlsx'];
    result = excelist.some(function (item) {
        return item == suffix;
    })
    if (result) {
        result = 'excel';
        return result;
    }
    // 匹配 word
    var wordlist = ['doc', 'docx'];
    result = wordlist.some(function (item) {
        return item == suffix;
    })
    if (result) {
        result = 'word';
        return result;
    }
    // 匹配 pdf
    var pdflist = ['pdf'];
    result = pdflist.some(function (item) {
        return item == suffix;
    })
    if (result) {
        result = 'pdf';
        return result;
    }
    // 匹配 ppt
    var pptlist = ['ppt'];
    result = pptlist.some(function (item) {
        return item == suffix;
    })
    if (result) {
        result = 'ppt';
        return result;
    }
    // 匹配 video
    var videolist = ['mp4', 'm2v', 'mkv', 'wmv', 'flv', 'avi', 'mov', 'rmvb', 'rm', 'webm', 'mpeg', '3gp', 'asf'];
    result = videolist.some(function (item) {
        return item == suffix;
    })
    if (result) {
        result = 'video';
        return result;
    }
    // 匹配 audio
    var radiolist = ['mp3', 'wav', 'ogg'];
    result = radiolist.some(function (item) {
        return item == suffix
    })
    if (result) {
        result = 'radio';
        return result;
    }
    // 其他 文件类型
    result = 'other';
    return result;
}

// 浮点数相加
export function numberAdd(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m + arg2 * m) / m).toFixed(n);
}

// 浮点数相减
export function numberSub(arg1, arg2) {
    var re1, re2, m, n;
    try {
        re1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        re1 = 0;
    }
    try {
        re2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        re2 = 0;
    }
    m = Math.pow(10, Math.max(re1, re2));
    n = (re1 >= re2) ? re1 : re2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

// 浮点数相乘
export function numberMul(arg1, arg2) {
    var m = 0;
    var s1 = arg1.toString();
    var s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    } catch (e) {
    }

    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

// 浮点数相除
export function numberDiv(arg1, arg2, digit) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    } catch (e) {
    }

    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    //获取小数点后的计算值
    var result = ((r1 / r2) * Math.pow(10, t2 - t1)).toString();
    var result2 = result.split(".")[1];
    result2 = result2.substring(0, digit > result2.length ? result2.length : digit);

    return Number(result.split(".")[0] + "." + result2);
}

// 日期格式化
export function parseTime(time, pattern) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        } else if (typeof time === 'string') {
            time = time.replace(new RegExp(/-/gm), '/');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

