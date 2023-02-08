const constractAddress = {
    erc1155LazyAddress: "",
    transferProxy: "0x68Fe560D6A5533c48f038B2c5117234405E7Ad4f",
    erc20transferProxy: "0xF35d042B52043A506677deC1EF866e5686f68d68",
    erc721LazyMinttransProxyAddress: "0xB68473e69a300B5D84c59B1BbaB07bfb639ab05B",
    exchangeV2Address: "0x48A0E6849667A200a5750034d3ff23cfFD576475",
    coinType: [
        {
            name: "ETH",
            address: "0x0000000000000000000000000000000000000000",
            decmial: 18,
        },
        {
            name: "USDC(ERC20)",
            address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            decmial: 18,
        },
    ],
};
const coinMap = {};
let coinArr = constractAddress.coinType;
for (let i = 0; i < coinArr.length; i++) {
    coinMap[coinArr[i].address] = coinArr[i].name;
    // coinMap[coinArr[i].decmial] = coinArr[i].decmial;
}
const coinDec = {};
for (let i1 = 0; i1 < coinArr.length; i1++) {
    coinDec[coinArr[i1].address] = coinArr[i1].decmial;
    // coinMap[coinArr[i].decmial] = coinArr[i].decmial;
}
const config = {
    chainId: 1,
    networkId: 1,
    chainName: "mainnet",
    chainURI:
        "https://eth-mainnet.g.alchemy.com/v2/3u6LBdwbmJTGv5ZT18Ae6BhoxJDSUynI",
    exploderURI: "https://etherscan.io/",
};
export {constractAddress, config, coinMap, coinDec};
