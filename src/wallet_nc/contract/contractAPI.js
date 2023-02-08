import {getObjectConfig} from "@/wallet_nc/common/ObjectConfig";
import Web3 from "web3";
import erc721LazyAbi from "@/wallet_nc/contract/erc721lazy/abi.json";
import erc20Abi from "@/wallet_nc/contract/erc20/abi.json";
import erc721RarAbi from "@/wallet_nc/contract/erc721rarible/abi.json";
import exchangeV2Abi from "@/wallet_nc/contract/exchangeV2/abi.json";
import {Mint721Data, Part,} from "@/wallet_nc/common/erc721/order";
import {ETH, id,} from "@/wallet_nc/common/erc721/assets";
import {constractAddress} from "@/const/const";

var transProxyAddress = constractAddress.transferProxy;
var erc20transferProxy = constractAddress.erc20transferProxy;
var web3;
var rpcUrl =
    getObjectConfig().DATA_PROVIDERS[getObjectConfig().DEFAULT_NETWORK];
var netWork = rpcUrl;
var erc721LazyMinttransProxyAddress =
    constractAddress.erc721LazyMinttransProxyAddress;
var cnn = new Web3.providers.HttpProvider(netWork);
web3 = new Web3(cnn);
var exchangeV2Address = constractAddress.exchangeV2Address;
const approveGasLimit = 400000;
const mintGasLimit = 400000;
const exchangeGasLimit = 400000;
const approveGas = 21000;
const mintGas = 21000;
const exchangeGas = 21000;
// https://gasstation-mainnet.matic.network/
let maxFeePerGas = window.localStorage.getItem("networkFee") * 1000000000;
let maxPriorityFeePerGas = maxFeePerGas;

export default class NftWeb3 {
    constructor(props) {
        // super(props)
    }

    erc20allowance(from, tokenAddress, erc20transferProxy, cb) {
        var erc721LazyContract = new web3.eth.Contract(erc20Abi, tokenAddress);
        erc721LazyContract.methods
            .allowance(from, erc20transferProxy)
            .call()
            .then((response) => {
                cb(null, response);
            })
            .catch((error) => {
                console.log("Error:", error);
                cb(error, null);
            });
    }

    erc721allowance(tokenAddress, tokenId, cb) {
        var erc721LazyContract = new web3.eth.Contract(erc721RarAbi, tokenAddress);
        erc721LazyContract.methods
            .getApproved(tokenId)
            .call()
            .then((response) => {
                cb(null, response);
            })
            .catch((error) => {
                console.log("Error:", error);
                cb(error, null);
            });
    }

    /**
     *
     * @param tokenId tokenid
     * @param tokenURI 元数据ipfs地址
     * @param minter nft矿工地址
     * @param fees 版权费
     * @param signature 签名
     * @param transferTo nft接收方
     * @param whiteListProxy 授权方 或者 代理合约地址
     * @param web3client web3客户端
     * @param cb 回调函数
     */
    mintAndTransfer(
        tokenId,
        tokenURI,
        minter,
        royaltyPayment,
        signature,
        transferTo,
        from,
        web3client,
        cb,
        erc721LazyAddress
    ) {
        var erc721LazyContract = new web3client.Contract(
            erc721LazyAbi,
            erc721LazyAddress
        );
        maxFeePerGas = window.localStorage.getItem("networkFee") * 1000000000;
        maxPriorityFeePerGas = maxFeePerGas;
        // var creators = this.creators([minter]);
        // var royaltys = this.royalty([minter], royaltyPayment);
        var creators = Part(minter, 10000);
        var royaltys = Part(minter, royaltyPayment);
        var signatures;
        if (signature == null) {
            signatures = [];
        } else {
            signatures = [signature];
        }
        erc721LazyContract.methods
            .mintAndTransfer(
                // Mint721Data(tokenId, tokenURI, [creators], [royaltys], [signature]),
                Mint721Data(tokenId, tokenURI, [creators], [], [signature]),
                transferTo
            )
            .send({
                from: from,
                // gasLimit: mintGasLimit,
                // gas: mintGas,
                // maxFeePerGas: maxFeePerGas.toFixed(0),
                // maxPriorityFeePerGas: maxPriorityFeePerGas.toFixed(0),
            })
            .on("transactionHash", (hash) => {
                cb(null, hash, tokenId);
            })
            .catch((error) => {
                console.log("Error:", error);
                cb(error, null);
            });
    }

    approve(from, tokenId, web3client, cb, erc721LazyAddress) {
        maxFeePerGas = window.localStorage.getItem("networkFee") * 1000000000;
        maxPriorityFeePerGas = maxFeePerGas;
        console.log("transProxyAddress :", transProxyAddress);
        console.log("from :", from);
        var erc721LazyContract = new web3client.Contract(
            erc721LazyAbi,
            erc721LazyAddress
        );
        // debugger;
        erc721LazyContract.methods
            .approve(transProxyAddress, tokenId)
            .send({
                from: from,
                // gasLimit: approveGasLimit,
                // gas: approveGas,
                // maxFeePerGas: maxFeePerGas.toFixed(0),
                // maxPriorityFeePerGas: maxPriorityFeePerGas.toFixed(0),
            })
            // .on("transactionHash", (hash) => {
            .on("transactionHash", (hash) => {
                cb(null, hash);
            })
            .catch((error) => {
                console.log("Error:", error);
                cb(error, null);
            });
    }

    approveByAddress(tokenAddress, web3client, cb) {
        const from = window.localStorage.getItem("walletAddress");
        var erc721LazyContract = new web3client.Contract(
            erc721LazyAbi,
            tokenAddress
        );
        maxFeePerGas = window.localStorage.getItem("networkFee") * 1000000000;
        maxPriorityFeePerGas = maxFeePerGas;
        erc721LazyContract.methods
            .approve(erc20transferProxy, "0xffffffffffffffffffffffffffffffffffffffff")
            .send({
                from: from,
                // gasLimit: approveGasLimit,
                // gas: approveGas,
                // maxFeePerGas: maxFeePerGas.toFixed(0),
                // maxPriorityFeePerGas: maxPriorityFeePerGas.toFixed(0),
            })
            .on("transactionHash", (hash) => {
                cb(null, hash);
            })
            .catch((error) => {
                console.log("Error:", error);
                cb(error, null);
            });
    }

    getApprovedByAddressAndForAddress(tokenAddress, tokenId, web3client) {
        const from = window.localStorage.getItem("walletAddress");
        var erc721LazyContract = new web3client.Contract(
            erc721LazyAbi,
            tokenAddress
        );

        return erc721LazyContract.methods.getApproved(tokenId).call();
    }

    approveByAddressAndForAddress(
        tokenAddress,
        proxyAddress,
        tokenId,
        web3client,
        cb
    ) {
        const from = window.localStorage.getItem("walletAddress");
        var erc721LazyContract = new web3client.Contract(
            erc721LazyAbi,
            tokenAddress
        );
        maxFeePerGas = window.localStorage.getItem("networkFee") * 1000000000;
        maxPriorityFeePerGas = maxFeePerGas;
        erc721LazyContract.methods
            .approve(proxyAddress, tokenId)
            .send({
                from: from,
                // gasLimit: approveGasLimit,
                // gas: approveGas,
                // maxFeePerGas: maxFeePerGas.toFixed(0),
                // maxPriorityFeePerGas: maxPriorityFeePerGas.toFixed(0),
            })
            .on("transactionHash", (hash) => {
                cb(null, hash);
            })
            .catch((error) => {
                console.log("Error:", error);
                cb(error, null);
            });
    }

    approveLazy(tokenId, web3client, cb, erc721LazyAddress) {
        const from = window.localStorage.getItem("walletAddress");
        var erc721LazyContract = new web3client.Contract(
            erc721LazyAbi,
            erc721LazyAddress
        );
        console.log(
            erc721LazyContract.methods
                .approve(transProxyAddress, tokenId)
                .estimateGas({
                    from: from,
                })
        );
        maxFeePerGas = window.localStorage.getItem("networkFee") * 1000000000;
        maxPriorityFeePerGas = maxFeePerGas;
        erc721LazyContract.methods
            .approve(transProxyAddress, tokenId)
            .send({
                from: from,
                // gasLimit: approveGasLimit,
                // gas: approveGas,
                // maxFeePerGas: maxFeePerGas.toFixed(0),
                // maxPriorityFeePerGas: maxPriorityFeePerGas.toFixed(0),
            })
            .on("transactionHash", (hash) => {
                cb(null, hash);
            })
            .catch((error) => {
                console.log("Error:", error);
                cb(error, null);
            });
    }

    approvalForAll(web3client, cb, erc721LazyAddress) {
        const from = window.localStorage.getItem("walletAddress");
        var erc721LazyContract = new web3client.Contract(
            erc721LazyAbi,
            erc721LazyAddress
        );
        maxFeePerGas = window.localStorage.getItem("networkFee") * 1000000000;
        maxPriorityFeePerGas = maxFeePerGas;
        console.log(
            erc721LazyContract.methods
                .setApprovalForAll(transProxyAddress, true)
                .estimateGas({
                    from: from,
                    // gasLimit: approveGasLimit,
                    // gas: approveGas,
                    // maxFeePerGas: maxFeePerGas.toFixed(0),
                    // maxPriorityFeePerGas: maxPriorityFeePerGas.toFixed(0),
                })
        );
        erc721LazyContract.methods
            .setApprovalForAll(transProxyAddress, true)
            .send({
                from: from,
                // gasLimit: approveGasLimit,
                // gas: approveGas,
                // maxFeePerGas: maxFeePerGas.toFixed(0),
                // maxPriorityFeePerGas: maxPriorityFeePerGas.toFixed(0),
            })
            .on("transactionHash", (hash) => {
                cb(null, hash);
            })
            .catch((error) => {
                console.log("Error:", error);
                cb(error, null);
            });
    }

    approvalForAllLazy(web3client, cb, erc721LazyAddress, approves) {
        const from = window.localStorage.getItem("walletAddress");
        var erc721LazyContract = new web3client.Contract(
            erc721LazyAbi,
            erc721LazyAddress
        );
        maxFeePerGas = window.localStorage.getItem("networkFee") * 1000000000;
        maxPriorityFeePerGas = maxFeePerGas;
        console.log(
            erc721LazyContract.methods
                .setApprovalForAll(erc721LazyMinttransProxyAddress, approves)
                .estimateGas({
                    from: from,
                    // gasLimit: approveGasLimit,
                    // gas: approveGas,
                    // maxFeePerGas: maxFeePerGas.toFixed(0),
                    // maxPriorityFeePerGas: maxPriorityFeePerGas.toFixed(0),
                })
        );
        erc721LazyContract.methods
            .setApprovalForAll(erc721LazyMinttransProxyAddress, approves)
            .send({
                from: from,
                // gasLimit: approveGasLimit,
                // gas: approveGas,
                // maxFeePerGas: maxFeePerGas.toFixed(0),
                // maxPriorityFeePerGas: maxPriorityFeePerGas.toFixed(0),
            })
            .on("transactionHash", (hash) => {
                cb(null, hash);
            })
            .catch((error) => {
                console.log("Error:", error);
                cb(error, null);
            });
    }

    isApprovedForAll(web3client, cb, erc721LazyAddress) {
        const from = window.localStorage.getItem("walletAddress");
        var erc721LazyContract = new web3client.Contract(
            erc721LazyAbi,
            erc721LazyAddress
        );

        return erc721LazyContract.methods
            .isApprovedForAll(from, transProxyAddress)
            .call();
    }

    isApprovedForAllLazy(web3client, owner, erc721LazyAddress) {
        const from = window.localStorage.getItem("walletAddress");
        // var erc721LazyContract = new web3.eth.Contract(
        var erc721LazyContract = new web3client.Contract(
            erc721LazyAbi,
            erc721LazyAddress
        );
        maxFeePerGas = window.localStorage.getItem("networkFee") * 1000000000;
        maxPriorityFeePerGas = maxFeePerGas;
        console.log(
            erc721LazyContract.methods
                .isApprovedForAll(owner, erc721LazyMinttransProxyAddress)
                .estimateGas({
                    from: from,
                    // gasLimit: approveGasLimit,
                    // gas: approveGas,
                    // maxFeePerGas: maxFeePerGas.toFixed(0),
                    // maxPriorityFeePerGas: maxPriorityFeePerGas.toFixed(0),
                })
        );
        console.log(erc721LazyContract)
        return erc721LazyContract.methods
            .isApprovedForAll(owner, erc721LazyMinttransProxyAddress)
            .call();
    }

    /**
     *
     * @param left 订单
     * @param signatureLeft 卖家签名
     * @param right  订单
     * @param signatureRight  ??平台签名
     * @param web3client web3 prider
     * @param buyer 买家地址
     * @param cb  回调地址
     */
    matchOrders(left, signatureLeft, right, signatureRight, web3client, cb) {
        console.log(left, signatureLeft, right, signatureRight, web3client, cb);
        let value;
        console.log(left.takeAsset.assetType.assetClass);
        console.log(id("ETH"));
        if (left.takeAsset.assetType.assetClass == id("ETH")) {
            // value = left.takeAsset.value * 1.02;
            value = left.takeAsset.value;
        } else {
            value = 0;
        }
        maxFeePerGas = window.localStorage.getItem("networkFee") * 1000000000;
        maxPriorityFeePerGas = maxFeePerGas;
        const from = window.localStorage.getItem("walletAddress");
        var exchangeV2Contract = new web3client.Contract(
            exchangeV2Abi,
            exchangeV2Address
        );
        console.log(
            exchangeV2Contract.methods
                .matchOrders(left, signatureLeft, right, signatureRight)
                .estimateGas({
                    from: from,
                    value: value,
                    // gasLimit: exchangeGasLimit,
                    // gas: exchangeGas,
                    // maxFeePerGas: maxFeePerGas.toFixed(0),
                    // maxPriorityFeePerGas: maxPriorityFeePerGas.toFixed(0),
                    // value: 0,
                })
        );
        maxFeePerGas = window.localStorage.getItem("networkFee") * 1000000000;
        maxPriorityFeePerGas = maxFeePerGas;
        exchangeV2Contract.methods
            .matchOrders(left, signatureLeft, right, signatureRight)
            .send({
                from: from,
                value: value,
                // gasLimit: exchangeGasLimit,
                // gas: exchangeGas,
                // maxFeePerGas: maxFeePerGas.toFixed(0),
                // maxPriorityFeePerGas: maxPriorityFeePerGas.toFixed(0),

                // value: 0,
            })
            .on("transactionHash", (hash) => {
                cb(null, hash);
            })
            .catch((error) => {
                console.log("Error:", error);
                cb(error, null);
            });
    }

    cancel(left, web3client, cb) {
        const from = window.localStorage.getItem("walletAddress");
        var exchangeV2Contract = new web3client.Contract(
            exchangeV2Abi,
            exchangeV2Address
        );

        exchangeV2Contract.methods
            .cancel(left)
            .send({
                from: from,
                // gasLimit: exchangeGasLimit,
                // gas: exchangeGas,
                // maxFeePerGas: maxFeePerGas.toFixed(0),
                // maxPriorityFeePerGas: maxPriorityFeePerGas.toFixed(0),

                value: 0,
            })
            .on("transactionHash", (hash) => {
                cb(null, hash);
            })
            .catch((error) => {
                console.log("Error:", error);
                cb(error, null);
            });
    }

    // 查询tokenId的持有人
    OwnerOf(web3client, erc721LazyAddress, tokenId) {
        var erc721LazyContract = new web3client.Contract(
            erc721RarAbi,
            erc721LazyAddress
        );
        return erc721LazyContract.methods.ownerOf(tokenId).call();
    }

    BalanceOf(web3client, erc721LazyAddress, walletAddress) {
        var erc721LazyContract = new web3client.Contract(
            erc721RarAbi,
            erc721LazyAddress
        );
        return erc721LazyContract.methods.balanceOf(walletAddress).call();
    }

    // 查询tokenId的元数据URL
    tokenURI(web3client, erc721LazyAddress, tokenId) {
        var erc721LazyContract = new web3client.Contract(
            erc721RarAbi,
            erc721LazyAddress
        );
        // https://artlinx.hk/ipfs/api/v0/cat/QmZtGVte1Ezc3z75MTmuAd3V2m22EQVL2Dq9JRMhG6SiCa
        return erc721LazyContract.methods.tokenURI(tokenId).call();
    }

    validateOrderTest(left, signatureLeft, web3client, cb) {
        var exchangeV2Contract = new web3client.Contract(
            [
                {
                    inputs: [],
                    name: "__OrderValidatorTest_init",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                },
                {
                    inputs: [
                        {
                            components: [
                                {
                                    internalType: "address",
                                    name: "maker",
                                    type: "address",
                                },
                                {
                                    components: [
                                        {
                                            components: [
                                                {
                                                    internalType: "bytes4",
                                                    name: "assetClass",
                                                    type: "bytes4",
                                                },
                                                {
                                                    internalType: "bytes",
                                                    name: "data",
                                                    type: "bytes",
                                                },
                                            ],
                                            internalType: "struct LibAsset.AssetType",
                                            name: "assetType",
                                            type: "tuple",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "value",
                                            type: "uint256",
                                        },
                                    ],
                                    internalType: "struct LibAsset.Asset",
                                    name: "makeAsset",
                                    type: "tuple",
                                },
                                {
                                    internalType: "address",
                                    name: "taker",
                                    type: "address",
                                },
                                {
                                    components: [
                                        {
                                            components: [
                                                {
                                                    internalType: "bytes4",
                                                    name: "assetClass",
                                                    type: "bytes4",
                                                },
                                                {
                                                    internalType: "bytes",
                                                    name: "data",
                                                    type: "bytes",
                                                },
                                            ],
                                            internalType: "struct LibAsset.AssetType",
                                            name: "assetType",
                                            type: "tuple",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "value",
                                            type: "uint256",
                                        },
                                    ],
                                    internalType: "struct LibAsset.Asset",
                                    name: "takeAsset",
                                    type: "tuple",
                                },
                                {
                                    internalType: "uint256",
                                    name: "salt",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "start",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "end",
                                    type: "uint256",
                                },
                                {
                                    internalType: "bytes4",
                                    name: "dataType",
                                    type: "bytes4",
                                },
                                {
                                    internalType: "bytes",
                                    name: "data",
                                    type: "bytes",
                                },
                            ],
                            internalType: "struct LibOrder.Order",
                            name: "order",
                            type: "tuple",
                        },
                        {
                            internalType: "bytes",
                            name: "signature",
                            type: "bytes",
                        },
                    ],
                    name: "validateOrderTest",
                    outputs: [],
                    stateMutability: "view",
                    type: "function",
                },
            ],
            "0x1FA1809AF88147398B3ECbd791700f2cC0b7a7E7"
        );
        console.log(
            exchangeV2Contract.methods
                .validateOrderTest(left, signatureLeft)
                .estimateGas({
                    from: "0x18D7e46EC485089BCC8003C9d88E5A201Ba860A5",
                })
        );
        exchangeV2Contract.methods
            .validateOrderTest(left, signatureLeft)
            .send({
                from: global.account,
            })
            .on("transactionHash", (hash) => {
                cb(null, hash);
            })
            .catch((error) => {
                console.log("Error:", error);
                cb(error, null);
            });
    }

    toHex(param) {
        return web3.utils.toHex(param);
    }

    creators(list) {
        const value = 10000 / list.length;
        return list.map((account) => [account, value.toString()]);
        // return ['0x1cf0df2a5a20cd61d68d4489eebbf85b8d39e18a', '10000'];
    }

    royalty(list, royaltyPayment) {
        return list.map((account) => [account, royaltyPayment]);
    }
}
