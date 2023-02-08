import store from "@/store";
const EIP712 = require("../EIP712");
function AssetType(assetClass, data) {
  return { assetClass, data };
}

function Asset(assetClass, assetData, value) {
  return { assetType: AssetType(assetClass, assetData), value };
}

function Order(
  maker,
  makeAsset,
  taker,
  takeAsset,
  salt,
  start,
  end,
  dataType,
  data
) {
  return {
    maker,
    makeAsset,
    taker,
    takeAsset,
    salt,
    start,
    end,
    dataType,
    data,
  };
}

function Part(account, value) {
  return {
    account,
    value,
  };
}

function Mint721Data(tokenId, tokenURI, creators, royalties, signatures) {
  return {
    tokenId,
    tokenURI,
    creators,
    royalties,
    signatures,
  };
}

const orderTypes = {
  AssetType: [
    { name: "assetClass", type: "bytes4" },
    { name: "data", type: "bytes" },
  ],
  Asset: [
    { name: "assetType", type: "AssetType" },
    { name: "value", type: "uint256" },
  ],
  Order: [
    { name: "maker", type: "address" },
    { name: "makeAsset", type: "Asset" },
    { name: "taker", type: "address" },
    { name: "takeAsset", type: "Asset" },
    { name: "salt", type: "uint256" },
    { name: "start", type: "uint256" },
    { name: "end", type: "uint256" },
    { name: "dataType", type: "bytes4" },
    { name: "data", type: "bytes" },
  ],
};

async function Ordersign(web3client, order, account, verifyingContract) {
  const chainId = Number(await web3client.getChainId());
  const data = EIP712.createTypeData(
    {
      name: "Exchange",
      version: "2",
      chainId,
      verifyingContract,
    },
    "Order",
    order,
    orderTypes
  );
  return (await EIP712.signTypedData(web3client, account, data)).sig;
}

export { AssetType, Asset, Order, Ordersign, Part, Mint721Data };
