<template>
  <div class="paySuccess" v-loading.fullscreen.lock='loading' :element-loading-text='loadingText'>
    <PcPageHeader />
    <div class="tipContainer">
      <i :class="iconClass"></i>
      <span class="subTxt">{{payRemindMsg}}</span>
      <span class="mony">HK${{totalAmount}}</span>
      <div class="btnRow">
        <el-button type="primary" class="btnCompelete" @click="$router.push('/')" :loading="payLoading">{{payLoadingInfo}}</el-button>
        <el-button class="btnHome" @click="$router.push('/')" v-if="!payLoading">Go back home</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import PcPageHeader from "@/components/PcPageHeader";
import API from "@/service";
import { numberAdd } from '@/utils/rules';
import * as math from 'mathjs';

const EtheremTx = require('ethereumjs-tx');
let exchangeabiSing = require("@/contract/exchangeabiSing.json");
let Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider(API.getNetWorkUrl()));
let assetType = new Map();
assetType.set("ETH", 0)
assetType.set("ERC20", 1)
assetType.set("ERC1155", 2)
assetType.set("ERC721", 3)
assetType.set("ERC721Deprecated", 4)

export default {
  components: {
    PcPageHeader
  },
  data() {
    return {
      totalAmount: 0,
      loading: false,
      loadingText: 'Loading, please wait',
      NftTokenAddress: {},
      payType: 0,
      order: {},
      buyerFee: 0,
      fee: 0,
      sellerFee: 0,
      invitorAddress: "",
      orderId: "",
      param: {},
      productId: 0,
      payRemindMsg: 'Please wait for a moment while transaction is in progress......',
      payLoading: true,
      payLoadingInfo: "in trading ...",
      iconClass: 'iconSuccess'
    };
  },
  mounted() {this.getCurrentUser();
    //获取合约配置
    API.getContractConfig().then(result => {
      console.log("contractConfig: " + JSON.stringify(result));
      if (result.code !== 200) {
        this.common.notification(this, result.msg, 3);
        return;
      } else {
        this.NftTokenAddress = result.data;
        this.buyerFee = (result.data.buyerFee) / 100;
        this.sellerFee = (result.data.sellerFee) / 100;
        console.log("this.sellerFee：" + this.sellerFee);
      }
    });
    this.orderId = this.$route.query.out_trade_no;
    console.log("订单编号：" + this.orderId);
    this.isCallBack = sessionStorage.getItem(this.orderId + '');
    if (this.orderId) {
        this.iconClass = "iconWaitTime";
        this.setTimer(2000);
    } else {
      this.totalAmount = this.$route.query.totalAmount;
      this.payRemindMsg = "pay success";
      this.payLoading = false;
      this.payLoadingInfo = "completion of payment";
    }
    // var totalAmount = this.$route.query.totalAmount;
    // if (totalAmount != null && totalAmount != '' && totalAmount != undefined) {
    //     this.totalAmount = totalAmount;
    // }
  },
  beforeRouteLeave(to, form, next) {
    if (this.orderId) {
      sessionStorage.setItem(this.orderId + '', null);
    }
    next();
  },
   methods: {
    // 查询充值和下单详情
    async getChargeAndOrderByOrderId() {
        API.getChargeAndOrderByOrderId({orderId: this.orderId}).then(result => {
            console.log("Transaction Details :" + JSON.stringify(result));
            if (result.code !== 200) {
                this.common.notification(this, result.msg, 3);
                return;
            }

            this.loading = true;
            this.loadingText = 'Loading, please wait';

            var charge = result.data.charge;
            this.param = result.data.param;
            this.productId = this.param.productId;

            if (charge.status !== 0) {
                var chargeTitle = charge.status === 1 ? 'change hands' : 'Transaction Failure';
                var type = charge.status === 1 ? 1 : 3;
                this.destoryed();
                this.loading = false;
                if (type == 3) {
                  if (!this.isCallBack) {
                    this.common.notification(this, chargeTitle, type);
                  }
                  this.$router.push({
                    path: '/pay-fail',
                    productId: this.productId
                  });
                  return;
                }

                this.totalAmount = numberAdd(this.param.totalAmount, this.param.fee);
                console.log("下单总金额：" + this.totalAmount);

                API.getMallCollectionInfo({
                  certificationId: window.localStorage.getItem("loginId"),
                  productId: this.productId
                }).then(result => {
                  if (result.code !== 200) {
                    console.log("商品详情Data loading failure");
                    return;
                  }
                  // 上架中的藏品
                  if (result.data != null) {
                    if (result.data.status === 0) {
                      //获取当前最新的订单状态
                      this.bestOffers(result.data.contractAddress, result.data.tokenId);
                    } else {
                      this.$router.push({
                        path: '/pay-fail',
                        productId: this.productId
                      });
                      return;
                    }
                  }
                });
            }
            sessionStorage.setItem(this.orderId + '', 1);
        });
    },
    bestOffers(contractAddress,tokenId) {
      //TODO  暂时死数据
      API.bestOffers({param: `${contractAddress}:${tokenId}`}).then(result => {
        this.order = result.data;
        // 链上交易
        let privateKey = this.getPrivateKey();
        let walletAddress = window.localStorage.getItem("walletAddress");
        this.navBuy(privateKey, walletAddress, this.totalAmount, this.param.payType);
      })
    },
    // 轮询查询
    setTimer(initMilliecond) {
        this.destoryed();

        this.timer = setInterval(() => {
            this.getChargeAndOrderByOrderId();
        }, initMilliecond);
    },
    // 销毁定时任务
    destoryed() {
      var _this = this;
      window.clearInterval(_this.timer);
    },
    navBuy(privateKey, walletAddress, totalAmount, payType) {
      this.totalAmount = totalAmount;
      this.payType = payType;
      //获取后台buyFee签名
      this.loadingText = "Please wait for a moment while transaction is in progress";
      this.loading = true;
      console.log("this.order：" + JSON.stringify(this.order));
      API.buyerFeesign({id:this.order.id}).then(result=>{
        if (result.code !== 200) {
          this.common.notification(this, result.msg, 3);
          this.loading = false;
          return;
        } else {
          this.order = result.data;
          this.exchange(this.NftTokenAddress.exchangeV1, walletAddress, privateKey);
        }
      })
    },
    exchange(exchangeV1contractAddress, walletAddress, privateKey) {
      const exchangecollection = new web3.eth.Contract(exchangeabiSing, exchangeV1contractAddress);
      let amount = 1; //
      // let buyer = "0xa0ee7a142d267c1f36714e4a8f75612f20a79720"; // token邀请人地址
      let buyer = this.param.invitorAddress;
      //TODO这里必须指定, 负责,金额将会锁定在交易合约之中!!!!!!!!!!!!!!!!!
      // let buyer = "0x0000000000000000000000000000000000000000"; // token接收方地址, 不指定默认sender
      let data = exchangecollection.methods.exchange(
          [[this.order.owner,
            this.order.saltValue,
            [this.order.token,
              parseInt(this.order.tokenId),
              parseInt(assetType.get(this.order.assettype))],
            [this.order.buyToken,
              parseInt(this.order.buyTokenId),
              parseInt(assetType.get(this.order.buyAssetType))]],
            parseInt(this.order.value),
            web3.utils.toHex(this.order.fee),
            parseInt(this.order.sellPrice)],
          [parseInt(this.order.signatureV),
            this.order.signatureR,
            this.order.signatureS],
          parseInt(this.order.buyPrice),
          [parseInt(JSON.parse(this.order.signature).v),
            JSON.parse(this.order.signature).r,
            JSON.parse(this.order.signature).s],
          parseInt(amount),
          buyer).encodeABI();
      //计算需要支付的以太币
      let value = web3.utils.fromWei(this.order.fee+'','ether');
      value = value * amount / this.order.value;
      value = value + (value * this.order.buyPrice / 10000);
      value = this.printFn(value);
      value = web3.utils.toWei(value+'');
      console.log("value:\n" + value)
      // value = web3.utils.toWei(value, 'ether')
      this.sendSignedTransaction(data, exchangeV1contractAddress, walletAddress, privateKey, this.exchange_cb, value);

    },
    printFn(value) {
      const precision = 14;
      return Number(math.format(value, precision));
    },
    exchange_cb(ret) {
      console.log(ret);
      console.log(ret.status);
      // 购买成功   其他逻辑   购买完成后商品是否在同价下可以被其他人购买,还是需要再重新铸造
      API.buyCollect({
        certificationId: window.localStorage.getItem("loginId"),
        productId: this.param.productId,
        totalAmount: this.param.totalAmount,
        payType: this.param.payType,
        serviceRate: this.sellerFee,
        invitorRate: 0,
        contractAddress: this.param.contractAddress,
        tradeHash: ret.transactionHash,
        invitorAddress: this.param.invitorAddress,
        tokenAddress: this.param.contractAddress,
        fee: this.param.fee
      }).then(result => {
        this.loading = false;
        if (result.code !== 200) {
          // this.common.notification(this, "操作失败, Please wait for a moment!", 3);
          this.$router.push({
            path: '/pay-fail',
            productId: this.param.productId
          });
          return;
        }
        this.payRemindMsg = "pay success";
        this.iconClass = "iconSuccess";
        this.payLoadingInfo = "completion of payment";
        this.common.notification(this, "success!", 1);
      });
      this.loading = false;
      this.payLoading = false;
    },
    sendSignedTransaction(data, to, address, privateKeys, cb, value) {
      this.ethGas(to, data, value, address, cb, privateKeys);
    },
    // 计算service fee
    async ethGas(contractAddress, data, value, walletAddress, cb, privateKeys) {
      await web3.eth.estimateGas(
          {
            to: contractAddress,
            data: data,
            value: value,
            from: walletAddress
          },
          (error, gas) => {
            var _this = this;
            console.log("error\n:" + error);
            console.log("gas:\n" + gas);
            if (error != undefined) {
              _this.$router.push({
                path: '/pay-fail',
                productId: _this.productId
              });
              return;
            }
            gas = gas ? gas : 320000;
            var fee = web3.utils.fromWei((gas * 2381000000000).toString(), 'ether');
            console.log("service fee：" + fee);
            _this.fee = parseFloat(fee).toFixed(2);
            web3.eth.getTransactionCount(walletAddress, web3.eth.defaultBlock.latest).then(nonce => {
              console.info("nonce:\n" + nonce);
              let rawTx = {
                nonce: web3.utils.toHex(nonce),
                gasLimit: web3.utils.toHex(gas),
                gasPrice: web3.utils.toHex(2381000000000),
                to: web3.utils.toHex(contractAddress),
                from: walletAddress,
                value: web3.utils.toHex(value),
                data: web3.utils.toHex(data),
                chainId: API.getChainId()
              }
              // console.log("privateKeys:" + privateKeys);
              let privateKeyBuffer = Buffer.from(privateKeys, "hex");
              let tx = new EtheremTx(rawTx);
              tx.sign(privateKeyBuffer);
              let serializedTx = tx.serialize();
              let serializedTxStr = "0x" + serializedTx.toString("hex");
              web3.eth.sendSignedTransaction(serializedTxStr).then((ret) => {
                cb(ret)
              });
            })
          }
      );
    },
  }
}
</script>

<style lang="less" scoped>
.paySuccess {
  min-height: 100vh;
}
.tipContainer {
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 0.16rem;
  backdrop-filter: blur(0.18rem);
  @media screen and (max-width: 800px) {
    width: auto;
    margin: 0 0.16rem;
    padding: 0 0.16rem 0.4rem;
  }
  .subTxt {
    margin-bottom: 0.56rem;
    font-size: 0.3rem;
    color: #000000;
    @media screen and (max-width: 800px) {
      margin-bottom: 0.3rem;
      font-size: 0.26rem;
    }
  }
  .mony {
    margin-bottom: 1rem;
    font-size: 0.4rem;
    font-weight: bold;
    color: #000000;
    @media screen and (max-width: 800px) {
      margin-bottom: 0.6rem;
      font-size: 0.3rem;
    }
  }
}
.iconSuccess {
  width: 1rem;
  height: 1rem;
  margin: 1.5rem auto 0.26rem;
  background: url('../assets/images/ok@2x.png') no-repeat center;
  background-size: 1rem 1rem;
  @media screen and (max-width: 800px) {
    width: 0.8rem;
    height: 0.8rem;
    margin: 1rem auto 0.52rem;
    background-size: 0.8rem 0.8rem;
  }
}
.iconWaitTime {
  width: 1rem;
  height: 1rem;
  margin: 1.5rem auto 0.26rem;
  background: url('../assets/images/wait_time@2x.png') no-repeat center;
  background-size: 1rem 1rem;
  @media screen and (max-width: 800px) {
    width: 0.8rem;
    height: 0.8rem;
    margin: 1rem auto 0.52rem;
    background-size: 0.8rem 0.8rem;
  }
}
.btnCompelete {
  margin-bottom: 0.41rem;
  margin-right: 0.4rem;
  @media screen and (max-width: 800px) {
    margin-right: 0.2rem;
  }
}
.btnHome {
  margin-left: 0;
}
</style>
