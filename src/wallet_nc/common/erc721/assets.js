import store from "@/store";
const ethUtil = require("ethereumjs-util");

function id(str) {
  return `0x${ethUtil
    .keccak256(Buffer.from(str))
    .toString("hex")
    .substring(0, 8)}`;
}

function enc(token, tokenId) {
  if (tokenId) {
    return store.getters["wallet/web3"].eth.abi.encodeParameters(
      ["address", "uint256"],
      [token, tokenId]
    );
  }
  return store.getters["wallet/web3"].eth.abi.encodeParameter("address", token);
}

function encLazy(collectAddress, data) {
  console.log("encLazy_Param:");
  console.log(JSON.stringify([collectAddress, data]));
  return store.getters["wallet/web3"].eth.abi.encodeParameters(
    ["address", "(uint,string,(address,uint96)[],(address,uint96)[],bytes[])"],
    [collectAddress, data]
  );
}

function encDataV1(data) {
  return store.getters["wallet/web3"].eth.abi.encodeParameters(
    ["((address,uint96)[],(address,uint96)[])"],
    [data]
  );
}
function encDataV2(data) {
  return store.getters["wallet/web3"].eth.abi.encodeParameters(
    ["((address,uint96)[],(address,uint96)[],bool)"],
    [data]
  );
}

const ETH = id("ETH");
const ERC20 = id("ERC20");
const ERC721 = id("ERC721");
const ERC721_LAZY = id("ERC721_LAZY");
const ERC1155 = id("ERC1155");
const ERC1155_LAZY = id("ERC1155_LAZY");
const COLLECTION = id("COLLECTION");
const CRYPTO_PUNK = id("CRYPTO_PUNK");
const ORDER_DATA_V1 = id("V1");
const ORDER_DATA_V2 = id("V2");
const TO_MAKER = id("TO_MAKER");
const TO_TAKER = id("TO_TAKER");
const PROTOCOL = id("PROTOCOL");
const ROYALTY = id("ROYALTY");
const ORIGIN = id("ORIGIN");
const PAYOUT = id("PAYOUT");

export {
  id,
  ETH,
  ERC20,
  ERC721,
  ERC721_LAZY,
  ERC1155,
  ERC1155_LAZY,
  ORDER_DATA_V1,
  ORDER_DATA_V2,
  TO_MAKER,
  TO_TAKER,
  PROTOCOL,
  ROYALTY,
  ORIGIN,
  PAYOUT,
  CRYPTO_PUNK,
  COLLECTION,
  enc,
  encLazy,
  encDataV1,
  encDataV2,
};
