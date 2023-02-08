const constractAddress = {
    erc1155LazyAddress: "",
    transferProxy: "0x9595E2D17524d08c5A9180A70dC8d88abA80960b",
    erc20transferProxy: "0x89f31eFf8fA5B16E2F2659E755b7C1933C4adC85",
    erc721LazyMinttransProxyAddress: "0xeeA699FD53a930bEb8Bac80c6d452EF2f0db799A",
    exchangeV2Address: "0xE2fC8762AdD4d20252ebA1f21d59749A1ccdEDaa",
    coinType: [
        {
            name: "ETH",
            address: "0x0000000000000000000000000000000000000000",
            decmial: 18,
        },
        // 0x367b0c721D2e74b773A5128c32e8313B7D0e810F
        {
            name: "USDC(ERC20)",
            address: "0x845388bfe8e7389b5709867f0ab0ec379c9fcde7",
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
    chainId: 27,
    networkId: 27,
    chainName: "ctchain_main",
    chainURI:
        // "https://ctblock.cn/blockChain",
        "http://localhost:8080/blockChain",
    exploderURI: "https://ctblock.cn/",
};
export {constractAddress, config, coinMap, coinDec};
