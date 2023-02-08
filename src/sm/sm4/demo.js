// var geoip = require('geoip-lite');
// console.log("Test");
// var ip = "106.14.254.63";
// // var ip = "47.108.48.148";
// // var ip = "8.129.56.205";
// if (ip.substr(0, 7) == "::ffff:") {
//     ip = ip.substr(7)
// }
// var info = {};
// info.ip = ip;
// var geo = geoip.lookup(ip);
// console.log(JSON.stringify(geo));
// var cbc = require('./lib/utils/cbc.js');
// cbc.decrypt_cbc("K++iI4IhSGMnEJZT/jv1ow==", "1234567890123456", "1234567890123456")
// var sm4 = require('./lib/utils/sm4.js');
// var sm2 = require('./lib/utils/sm2.js');
// var s4 = require('./lib/utils/SM4Util.js');
// let md5 = require("js-md5");
// var en_str = cbc.encrypt_cbc("朝气", "1234567890123456");
// console.log(en_str);  //cScF6W6Y3wV1I893ANye2Q==
// var cbc = require('./lib/utils/cbc.js');
// var de_str = cbc.decrypt_cbc("cScF6W6Y3wV1I893ANye2Q==", "1234567890123456", "1234567890123456")
// console.log(de_str);
//新加密算法
// var en_str = s4.encrypt_ecb("朝气");
// console.log('en_str:'+en_str);
// var de_str = s4.decrypt_ecb(en_str);
// console.log('de_str:'+de_str);
// var cbc_en = s4.encrypt_cbc("朝气");
// console.log('cbc_en:'+cbc_en);
// var cbc_de = s4.decrypt_cbc(cbc_en);
// console.log('cbc_de:'+cbc_de);
var en_str1= this.$sm4.encrypt_ecb('朝气','25d55ad283aa400af464c76d713c07ad');
console.log('en_str1:'+en_str1);
var de_str2= this.$sm4.decrypt_ecb(en_str1,'25d55ad283aa400af464c76d713c07ad');
console.log('de_str2:'+de_str2);
// console.log(md5('12345678').substring(8,24))
// var cbc_en_str2= sm4.encrypt_cbc('朝气','JeF8U9wHFOMfs2Y8');
// console.log('cbc_en_str2:'+cbc_en_str2);
var cbc_de_str2= this.$sm4.decrypt_ecb("DpxSlqZ85dE7W7cLOa2mGBl3fsruIEg1xEvXih4gr1U=",'f8e37e7caf2f983246316fb846ce07afa5070e557f85a7f33f72ba290a7ea02e');
console.log('cbc_de_str2:'+cbc_de_str2);
// const msg = 'hello world'
// const pubkeyHex = '0452712EBA7FE2C9615F6DE59C6EF662R085BD52B25952597CC95014BB8F201987F8D818EFFE710DBEC08FE2E4C7E3E0113EEBAB4B0E8B044E1A3CC8B149D76BE7';
// const cipherMode = 0;

// // 获取加密过后的密文
// const result = sm2Encrypt(msg, pubkeyHex, cipherMode);


