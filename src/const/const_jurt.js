const constractAddress = {
  erc1155LazyAddress: "",
  transferProxy: "0xCC60f37EB5841B4E6419688D3f9647F907Bc58A9",
  erc20transferProxy: "0x28807FE81767e1f0d4E1A6b58d5609ca41610407",
  erc721LazyMinttransProxyAddress: "0x13CBcDdd6F765D9464d4e111145CB47FBDe23048",
  exchangeV2Address: "0x8721d9d8FFe912b93207a64F682121af1c56068F",
  coinType: [
    {
      name: "ETH",
      address: "0x0000000000000000000000000000000000000000",
      decmial: 18,
    },
    {
      name: "USDC(ERC20)",
      address: "0x423a4f714C3C37Dd71cED9d9d5e367d4a845af1d",
      decmial: 18,
    },
    {
      name: " DIV  (ERC20)",
      address: "0xc12dFefE9e1A257F97Db2Eb7DD5CB0834F6d303a",
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
  chainId: 52,
  networkId: 3321,
  chainName: "jurt",
  chainURI: "http://localhost:8080/blockChain",
  exploderURI: "https://jubbart-chain.com",
};

export { constractAddress, config, coinMap, coinDec };
