export default {
    // 弹框提示信息
    notification(thif, msg, style) {
        let type = 'success';
        if (style == 2) {
            type = 'warning'
        }
        if (style == 3) {
            type = 'error'
        }
        thif.$notify({
            title: '',
            message: msg,
            type: type
        });
    },
}