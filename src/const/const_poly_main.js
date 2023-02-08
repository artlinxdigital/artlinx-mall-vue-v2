const constractAddress = {
    erc1155LazyAddress: "",
    transferProxy: "0x8Fa93b69e2B243a64118eAbA0e5f63388e7c72B4",
    erc20transferProxy: "0x1a151460cac6A0243BABa7282ad1969Fc8fb68D5",
    erc721LazyMinttransProxyAddress: "0xCB231302571859137Ae702CA5d0544F18B45792f",
    exchangeV2Address: "0x98F8AC8cCFAa5d65e597eD692592C57410d11283",
    coinType: [
        {
            name: "MATIC",
            address: "0x0000000000000000000000000000000000000000",
            decmial: 18,
        },
        {
            name: "USDC(ERC20)",
            address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            decmial: 18,
        },
        {
            name: "MARS(ERC20)",
            address: "0x000000000000000000000000000000000000000000",
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
    chainId: 137,
    networkId: 137,
    chainName: "matic",
    chainURI: "https://polygon-rpc.com/",
    exploderURI: "https://polygonscan.com",
};
export {constractAddress, config, coinMap, coinDec};
