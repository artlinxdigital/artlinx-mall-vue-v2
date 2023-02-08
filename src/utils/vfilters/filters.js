const vfilter = {
  timeFormat(value, winVue) {
    let miao = parseInt(Date.parse(new Date())/1000-value);
    let hours = parseInt(miao/3600);
    let fen = parseInt((miao - hours*3600)/60);
    let miao1 = miao - hours*3600 - fen*60;
    let timesShow;
    // console.log(winVue.hour)
    if (hours != 0){
      timesShow = hours + winVue.hour + fen + winVue.minute + miao1 + winVue.seconds;
    } else {
      if ( fen !=0){
        timesShow = fen + winVue.minute + miao1 + winVue.seconds;
      } else {
        timesShow = miao1 + winVue.seconds;
      }
    }
    return timesShow;
  },
  timers(value, timestamp){
    var date = new Date(timestamp*1000);
    let Y = date.getFullYear();
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
  },
  cutStr: function(value, num) {
    if (!value) return '';
    if (value == null || value == '') return'';
    return value.substring(0, num) + '...';
  },
  danwei: function (value) {
    let numStr = parseFloat((Number(value) * Math.pow(10, -18)));
    numStr = parseFloat(numStr).toFixed(18);
    numStr = String(numStr).substring(0,17);
    numStr = numStr.replace(/([0]*$)/g, "");
    if (numStr.indexOf('.') == numStr.length-1) {
      numStr = String(numStr).substring(0, numStr.length-1);
    }
    if (numStr == '0.') {
      numStr = 0
    }
    return numStr + '';
  }
}
export default vfilter;
