import {isUK} from "@/utils/rules";

let baseUrlv =  'https://artlinx.' + (isUK() ? 'uk' : 'hk');
// let baseUrlv =  'http://localhost:4001';
export const baseUrl = {
    test: "https://getman.cn/mock",
    // dev: 'https://rbg123.com'
    dev: baseUrlv,
    // dev: "http://localhost:4001",
    // dev: "http://194.26.222.42",
};
export const projectUrl = {
    test: "http://localhost:8091",
    dev: baseUrlv,
    // dev: "http://localhost:4001",
    // dev: "http://194.26.222.42",
};
