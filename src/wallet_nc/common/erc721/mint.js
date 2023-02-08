import {getWeb3} from "@/cores/web3";

const {createTypeData, signTypedData} = require("../EIP712");
let web3 = getWeb3();
const Types = {
  Part: [
    {name: 'account', type: 'address'},
    {name: 'value', type: 'uint96'}
  ],
  Mint721: [
    {name: 'tokenId', type: 'uint256'},
    {name: 'tokenURI', type: 'string'},
    {name: 'creators', type: 'Part[]'},
    {name: 'royalties', type: 'Part[]'}
  ]
};

async function sign(account, tokenId, tokenURI, creators, royalties, verifyingContract) {
  const chainId = Number(await getWeb3().eth.getChainId());
  const data = createTypeData({
    name: "Mint721",
    chainId,
    version: "1",
    verifyingContract
  }, 'Mint721', {tokenId, tokenURI, creators, royalties}, Types);
  return (await signTypedData(getWeb3().eth, account, data)).sig;
}

module.exports = {sign};
