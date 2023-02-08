// import {mainnet} from "./const__mainnet"
// import {jurt} from "./const_jurt"
// import {poly_mainnet} from "./const_poly_main"

import {isUK} from "@/utils/rules";

var mainnet = require('./const__mainnet.js');
var jurt = require('./const_jurt.js');
var poly_mainnet = require('./const_poly_main.js');
var ctchain_main = require('./const_ctchain_main.js');
let netMap = {
    matic: poly_mainnet,
    mainnet: mainnet,
    ctchain_main: ctchain_main,
    jurt: jurt
}
let currNetwork = window.localStorage.getItem("currNetwork");
if (!currNetwork || currNetwork == "undefined") {
    if (isUK()) {
        window.localStorage.setItem("currNetwork", "matic");
    } else {
        window.localStorage.setItem("currNetwork", "mainnet");
        // TODO test
        // window.localStorage.setItem("currNetwork", "ctchain_main");
    }
}
currNetwork = window.localStorage.getItem("currNetwork");
let constractAddress, config, coinMap, coinDec;
constractAddress = netMap[currNetwork].constractAddress;
config = netMap[currNetwork].config;
coinMap = netMap[currNetwork].coinMap;
coinDec = netMap[currNetwork].coinDec;
let supportChainId;
if (isUK()) {
    supportChainId = ["137"];
} else if (!isUK())  {
    supportChainId = ["1"];
    // supportChainId = ["27"];
}
export {constractAddress, config, coinMap, coinDec, supportChainId};
