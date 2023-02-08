<template>
  <div
    class="detail pcContainer"
    v-loading.fullscreen.lock="loading"
    :element-loading-text="loadingText"
  >
    <PcPageHeader />
    <MPageHeader title="details" />
    <div class="detailContent">
      <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">index</el-breadcrumb-item>
        <el-breadcrumb-item
          >{{ detail.productCategoryName }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ detail.productName }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="goodsMain">
        <div class="goodsLt">
          <div class="goodsLtTop" :class="{ media: detail.productType !== 1 }">
            <el-image
              class="fillImg"
              :src="detail.coverImage"
              fit="cover"
              v-if="detail.productType === 1"
              lazy
            >
              <div slot="placeholder">
                <el-image
                  class="fillImg"
                  :src="placeholderImg"
                  fit="cover"
                ></el-image>
              </div>
            </el-image>
            <video
              width="100%"
              height="100%"
              controls
              v-if="detail.productType === 3"
            >
              <source :src="detail.coverImage" type="video/mp4" />
              Your browser does not support this video。
            </video>
            <audio
              width="100%"
              height="100%"
              class="centerBlock"
              controls
              v-if="detail.productType === 2"
            >
              <source :src="detail.coverImage" type="audio/mpeg" />
              Your browser does not support this audio playback。
            </audio>
          </div>
          <div class="goodsLtBtm">
            <div class="avatarBox">
              <el-image
                class="avatarImg"
                :src="detail.userAvatar"
                fit="cover"
              ></el-image>
              <div class="avatarInfo">
                <span>Collection of the Artist</span>
                <span>洪语</span>
              </div>
            </div>
            <div class="avatarBox">
              <el-image
                class="avatarImg"
                :src="detail.userAvatar"
                fit="cover"
              ></el-image>
              <div class="avatarInfo">
                <span>Collection owner</span>
                <span>洪语</span>
              </div>
            </div>
          </div>
        </div>
        <div class="goodsRt">
          <h1 class="goodsName">{{ detail.productName }}</h1>
          <div class="priceAndType">
            <span class="goodsType">{{ detail.productCategoryName }}</span>
            <div class="price">
              <i>HK$</i>
              <span
                >{{
                  detail.price ? detail.price.toFixed(2).split(".")[0] : "0"
                }}.</span
              >
              <span class="smNum">{{
                detail.price ? detail.price.toFixed(2).split(".")[1] : "00"
              }}</span>
            </div>
          </div>
          <div class="buyAndOther">
            <div :class="{ flexBtnBox: isShowFoot || canReOnSale }">
              <el-button
                type="primary"
                size="small"
                class="btnTradeRec"
                :class="{ flexBtn: isShowFoot }"
                @click="drawer = true"
                plain
                >trading record
              </el-button>
              <el-button
                type="primary"
                size="small"
                class="onsaleBtn"
                @click="changePriceVisible = true"
                v-if="canReOnSale"
                >Back on
              </el-button>
              <el-button
                type="primary"
                size="small"
                class="btnBuy"
                @click="handleBuy"
                id="buyNow"
                v-if="!isShowFoot"
                >Buy It Now
              </el-button>
            </div>
            <div class="starLike" v-if="!isShowFoot">
              <span
                class="likeNum"
                :class="{ active: collectOpe.isFavorite === 1 }"
                @click="addFavorite"
              >
                {{ collectOpe.isFavorite === 1 ? "Have thumb up" : "Like" }}
                <span class="starLikeNum">{{ collectOpe.favoriteCount }}</span>
              </span>
              <span
                class="starNum"
                :class="{ active: collectOpe.isCollection === 1 }"
                @click="addCollection"
              >
                {{
                  collectOpe.isCollection === 1
                    ? "have already collected"
                    : "collect"
                }}
                <span class="starLikeNum">{{
                  collectOpe.collectionCount
                }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mGoodsInfo">
        <div class="mGoodsItem">
          <span class="label">Token favorites</span>
          <span class="val">{{ detail.collectDirName }}</span>
        </div>
        <div class="mGoodsItem">
          <span class="label">Token Contract address</span>
          <span class="val">{{
            detail.contractAddress | ellipsisContractAddress
          }}</span>
        </div>
        <div class="mGoodsItem">
          <span class="label">Token ID</span>
          <span class="val">{{ detail.tokenId }}</span>
        </div>
        <div class="mGoodsItem">
          <span class="label">Token CASE TIME</span>
          <span class="val">{{ detail.tokenTime }}</span>
        </div>
      </div>

      <div class="detailDesc">
        <div class="detailDescTab">
          <SelectTab :selections="selections" :active.sync="activeSelection" />
        </div>
        <div class="descContent" v-if="activeSelection === '1'">
          <div class="titleDivider">- Details Introduction -</div>
          {{ detail.productDesc }}
        </div>
        <div class="pcTradeRecord" v-if="activeSelection === '2'">
          <TradeRecordContent :records="tradeRecords" />
        </div>
      </div>

      <div class="similar">
        <div class="selectionCondition">
          <div class="selectionLt">
            <span class="title">相关推荐</span>
            <div class="types">
              <span
                v-for="item in similarTypes"
                :key="item.key"
                class="similarType"
                :class="{ active: item.key === currentKey }"
                @click="handleActiveType(item.key)"
                >{{ item.name }}</span
              >
            </div>
          </div>
          <div class="selectionRt">
            <Dropdown @select="handleSelectDropdown" />
            <SortIcon :isUp.sync="isUpType" @click.native="handleClickSort" />
          </div>
        </div>
        <SimilarList ref="sameAuthorList" />
      </div>
    </div>

    <!-- for mobile 交易记录抽屉 -->
    <TradeRecord :visible.sync="drawer" ref="tradeRecord" />

    <!-- 立即购买 -->
    <PayDrawerContent
      :visible.sync="buyDrawer"
      :clientWidth.sync="clientWidth"
      @navBuy="navBuy"
      ref="payDrawerContent"
    />
    <MTipModal
      :visible.sync="tipVisible"
      title="Tips"
      :content="content"
      cancelTxt="cancel"
      :confirmTxt="confirmTxt"
      @close="tipVisible = false"
      @ok="toConfirm"
    />
    <!-- 重新上架修改price弹窗 -->
    <ChangePrice
      v-if="changePriceVisible"
      :visible.sync="changePriceVisible"
      :originPrice="detail.price ? detail.price : ''"
      :coin="detail.coinType ? detail.coinType : ''"
      @close="changePriceVisible = false"
      @onlineAgain="onlineAgain"
    />
  </div>
</template>

<script>
import PcPageHeader from "@/components/PcPageHeader";
import MPageHeader from "@/components/MPageHeader";
import SelectTab from "@/components/SelectTab";
import TradeRecord from "@/components/TradeRecord";
import TradeRecordContent from "@/components/TradeRecordContent";
import Dropdown from "@/components/Dropdown";
import SortIcon from "@/components/SortIcon";
import SimilarList from "@/components/SimilarList";
import ChangePrice from "@/components/ChangePrice";
import PayDrawerContent from "@/components/PayDrawerContent";
import MTipModal from "@/components/MTipModal";
import { goodsDetail } from "@/mock";
import API from "@/service";
import abiSing from "@/contract/abiSing.json";
let ethUtil = require("ethereumjs-util");
const EtheremTx = require("ethereumjs-tx");
let exchangeabiSing = require("@/contract/exchangeabiSing.json");
let Web3 = require("web3");
import * as math from "mathjs";
import { re } from "mathjs";
import { numberAdd } from "@/utils/rules";
//测试数据
let web3 = new Web3(new Web3.providers.HttpProvider(API.getNetWorkUrl()));
let assetType = new Map();
assetType.set("ETH", 0);
assetType.set("ERC20", 1);
assetType.set("ERC1155", 2);
assetType.set("ERC721", 3);
assetType.set("ERC721Deprecated", 4);

export default {
  components: {
    PcPageHeader,
    MPageHeader,
    SelectTab,
    TradeRecord,
    Dropdown,
    SortIcon,
    SimilarList,
    PayDrawerContent,
    MTipModal,
    TradeRecordContent,
    ChangePrice,
  },
  filters: {
    ellipsisContractAddress(value) {
      if (!value) return "";
      if (value.length > 10) {
        return `${value.substring(0, 10)}********${value.substring(
          value.length - 10
        )}`;
      }
      return value;
    },
  },
  inject: ["reload"],
  data() {
    return {
      changePriceVisible: false,
      drawer: false,
      detail: {},
      selections: [
        {
          categoryName: "藏品介绍",
          productCategoryId: "1",
        },
        {
          categoryName: "交易记录",
          productCategoryId: "2",
        },
      ],
      activeSelection: "1",
      similarTypes: [
        {
          name: "Artist",
          key: "author",
        },
        {
          name: "同类型",
          key: "category",
        },
      ],
      currentKey: "Artist",
      isUpType: true,
      buyDrawer: false,
      loading: false,
      loadingText: "Loading, please wait",
      NftTokenAddress: {},
      sameAuthorList: [],
      sameCategoryList: [],
      totalAmount: 0,
      balance: 0,
      payType: 0,
      order: {},
      tipVisible: false,
      buyerFee: 0,
      content: "",
      confirmTxt: "",
      userStatus: 1,
      productStatus: 0,
      /** 交易记录 */
      tradeRecords: [],
      orderBy: "",
      orderByType: "",
      collectOpe: {
        isFavorite: 0,
        isCollection: 0,
      },
      placeholderImg: require("@/assets/images/artlinx_loading.jpg"),
      fee: 0,
      isToCharge: false,
      isRemindOnlineFee: false,
      onlinePrice: 0,
      isToPay: false,
      isRemindPayFee: false,
      sellerFee: 0,
      invitorAddress: "",
      clientWidth: 750,
      isLogin: true,
      certificationId: 0,
    };
  },
  computed: {
    isShowFoot() {
      const caseA = this.productStatus != 0;
      const caseB =
        this.getCurrentUser() &&
        window.localStorage.getItem("loginId") === this.detail.createId;
      // 不是我铸造的、交易已完成
      return caseA || caseB;
    },
    canReOnSale() {
      const caseA = this.productStatus != 0;
      const caseB =
        this.getCurrentUser() &&
        window.localStorage.getItem("loginId") !== this.detail.createId &&
        this.detail.productFrom !== 1;
      return caseA && caseB;
    },
  },
  mounted() {
    this.getCurrentUser();
    this.$nextTick(() => {
      this.clientWidth = document.documentElement.clientWidth;
    });
    const walletAddress = window.localStorage.getItem("walletAddress");
    if (walletAddress == "") {
      this.isLogin = false;
      // return;
    } else {
      this.certificationId = window.localStorage.getItem("loginId");
    }
    this.orderId = sessionStorage.getItem("wxPayOrderNo");
    if (this.orderId) {
      this.setTimer(2000);
    }
    //获取合约配置
    API.getContractConfig().then((result) => {
      console.log("contractConfig: " + JSON.stringify(result));
      if (result.code !== 200) {
        this.common.notification(this, result.msg, 3);
        return;
      } else {
        this.NftTokenAddress = result.data;
        this.buyerFee = result.data.buyerFee / 100;
        this.sellerFee = result.data.sellerFee / 100;
        console.log("this.sellerFee：" + this.sellerFee);
        // 查询余额
        if (this.isLogin) {
          this.getUserBalance();
        }
        //获取藏品详情
        this.initDetail();
      }
    });
  },
  beforeRouteLeave(to, form, next) {
    if (this.orderId) {
      sessionStorage.setItem("wxPayOrderNo", null);
    }
    next();
  },
  methods: {
    // 重新上架
    onlineAgain(price) {
      this.changePriceVisible = false;
      this.onlinePrice = price;
      this.addMallCollectionAgain();
      console.log("the latest price：" + price);
    },
    // 查询地址余额
    getUserBalance() {
      web3.eth
        .getBalance(window.localStorage.getItem("walletAddress"))
        .then((result) => {
          var balanceCurr = web3.utils.fromWei(result, "ether");
          console.log("balanceCurr：" + balanceCurr);
          this.balance = parseFloat(balanceCurr).toFixed(2);
        });
    },
    // 查询用户信息
    getUserInfo() {
      API.getUserInfo({ certificationId: this.certificationId }).then(
        (result) => {
          if (result.code !== 200) {
            this.common.notification(this, "Data loading failure", 3);
            return;
          }
          // console.log("用户信息：" + JSON.stringify(result));
          this.userStatus = result.data.status;
        }
      );
    },
    // 去操作
    toConfirm() {
      if (this.userStatus == 0 || this.userStatus == 3) {
        if (this.clientWidth < 800) {
          this.$router.push({
            path: "/realname",
          });
        } else {
          this.$router.push({
            path: "/realname",
          });
        }
        return;
      }
      if (this.isToPay) {
        let privateKey = this.getPrivateKey();
        let walletAddress = window.localStorage.getItem("walletAddress");
        this.tipVisible = false;
        this.navBuy(privateKey, walletAddress, this.totalAmount, this.payType);
      } else if (this.isToCharge) {
        this.$router.push({
          path: "/funding",
        });
        return;
      } else {
        this.tipVisible = false;
        this.addMallCollectionAgain();
      }
    },
    // Alipay支付
    startAliPay() {
      console.log(numberAdd(this.totalAmount, this.fee));
      API.startAliPay({
        address: window.localStorage.getItem("walletAddress"),
        type: 1,
        money: numberAdd(this.totalAmount, this.fee),
        from: 2,
        productId: parseInt(this.$route.params.id),
        totalAmount: this.totalAmount,
        contractAddress: this.detail.contractAddress,
        invitorAddress: this.invitorAddress,
        fee: this.fee,
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(this, result.msg, 3);
          return;
        }
        this.loading = true;
        this.loadingText = "Please wait while the tranctions is processing";
        console.log("表单form: " + JSON.stringify(result));
        const div = document.createElement("div");
        div.innerHTML = result.data;
        document.body.append(div);
        document.forms[0].submit();
      });
    },
    // WeChat Pay
    startWxPay() {
      console.log(numberAdd(this.totalAmount, this.fee));
      API.startWxPay({
        address: window.localStorage.getItem("walletAddress"),
        subject: "WeChat Pay",
        type: 1,
        money: numberAdd(this.totalAmount, this.fee),
        from: 2,
        productId: parseInt(this.$route.params.id),
        totalAmount: this.totalAmount,
        contractAddress: this.detail.contractAddress,
        invitorAddress: this.invitorAddress,
        fee: this.fee,
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(this, result.msg, 3);
          return;
        }
        this.loading = true;
        this.loadingText = "Please wait while the tranctions is processing";
        console.log("表单form: " + JSON.stringify(result));
        this.orderId = result.data.out_trade_no;
        sessionStorage.setItem("wxPayOrderNo", this.orderId);
        window.location.href = result.data.mweb_url;
      });
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
    // 查询订单详情
    getChargeAndOrderByOrderId() {
      API.getChargeAndOrderByOrderId({ orderId: this.orderId }).then(
        (result) => {
          console.log("Transaction Details :" + JSON.stringify(result));
          if (result.code !== 200) {
            return;
          }
          var charge = result.data.charge;
          if (charge != null && charge.status !== 0) {
            var chargeTitle =
              charge.status === 1 ? "pay success" : "Payment Failed";
            var type = charge.status === 1 ? 1 : 3;
            this.destoryed();
            this.common.notification(this, chargeTitle, type);
            this.$router.push({
              path: "/pay-successTest",
              query: {
                out_trade_no: this.orderId,
              },
            });
          }
        }
      );
    },
    // 查询藏品是否点赞/收藏
    checkIsFavoriteAndCollect() {
      API.checkIsFavoriteAndCollect({
        certificationId: this.certificationId,
        productId: this.$route.params.id,
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(this, "Data loading failure！", 3);
          return;
        }
        if (result.data != null) {
          this.collectOpe = result.data;
        }
      });
    },
    handleClickSort() {
      this.handleSelectDropdown(this.orderByType);
    },
    handleSelectDropdown(type) {
      this.orderByType = type;
      const asOrDsc = this.isUpType ? "asc" : "desc";
      if (type === "1") {
        this.orderBy = `price ${asOrDsc}`;
      }
      if (type === "2") {
        this.orderBy = `time ${asOrDsc}`;
      }
      if (type === "3") {
        this.orderBy = `favorite ${asOrDsc}`;
      }
      if (type === "4") {
        this.orderBy = `collection ${asOrDsc}`;
      }
      this.getSameAuthorOrCategoryCollectionList();
    },
    // 藏品点赞
    addFavorite() {
      if (!this.isLogin) {
        this.$router.push({
          path: "/login",
        });
        return;
      }
      API.addProductOpe({
        productId: this.detail.productId,
        certificationId: this.certificationId,
        opeType: 1,
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(
            this,
            "Failed to like, please try again later！",
            3
          );
          return;
        }
        var remindMsg = "Wish!";
        if (this.collectOpe.isFavorite === 1) {
          remindMsg = "The likes have been unliked！";
        }
        this.common.notification(this, remindMsg, 1);
        // 查询当前藏品是否点赞/收藏
        this.checkIsFavoriteAndCollect();
      });
    },
    // 藏品收藏
    addCollection() {
      if (!this.isLogin) {
        this.$router.push({
          path: "/login",
        });
        return;
      }
      API.addProductOpe({
        productId: this.detail.productId,
        certificationId: this.certificationId,
        opeType: 2,
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(
            this,
            "Favorites failed. Please try again later！",
            3
          );
          return;
        }
        var remindMsg = "Collection!";
        if (this.collectOpe.isCollection === 1) {
          remindMsg = "Cancelled collection！";
        }
        this.common.notification(this, remindMsg, 1);
        // 查询当前藏品是否点赞/收藏
        this.checkIsFavoriteAndCollect();
      });
    },
    // 交易记录列表
    getTradeRecordList() {
      API.getCollectDealRecordList({
        certificationId: this.certificationId,
        tokenId: this.detail.tokenId,
        contractAddress: this.detail.contractAddress,
      }).then((result) => {
        console.log("Trading record：" + JSON.stringify(result));
        if (result.code !== 200) {
          this.common.notification(this, "Data loading failure！", 3);
          return;
        }
        this.tradeRecords = result.data;
        this.$refs.tradeRecord.getTradeRecordList(result.data);
      });
    },
    navBuy(privateKey, walletAddress, totalAmount, payType) {
      this.totalAmount = totalAmount;
      this.payType = payType;
      // balance paid
      if (payType == 3) {
        if (this.totalAmount > this.balance) {
          this.content =
            "Your current balance is not enough to pay for this order, please recharge it!";
          this.confirmTxt = "Go to prepaid phone";
          this.isToCharge = true;
          this.tipVisible = true;
          return;
        }
      }
      //获取后台buyFee签名
      this.loadingText = "Please wait for a moment";
      this.loading = true;
      API.buyerFeesign({ id: this.order.id }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(this, result.msg, 3);
          this.loading = false;
          return;
        } else {
          this.order = result.data;
          this.exchange(
            this.NftTokenAddress.exchangeV1,
            walletAddress,
            privateKey
          );
        }
      });
    },
    exchange(exchangeV1contractAddress, walletAddress, privateKey) {
      const exchangecollection = new web3.eth.Contract(
        exchangeabiSing,
        exchangeV1contractAddress
      );
      let amount = 1; //
      // let buyer = "0xa0ee7a142d267c1f36714e4a8f75612f20a79720"; // token邀请人地址
      let buyer = this.invitorAddress;
      //TODO这里必须指定, 负责,金额将会锁定在交易合约之中!!!!!!!!!!!!!!!!!
      // let buyer = "0x0000000000000000000000000000000000000000"; // token接收方地址, 不指定默认sender
      let data = exchangecollection.methods
        .exchange(
          [
            [
              this.order.owner,
              this.order.saltValue,
              [
                this.order.token,
                parseInt(this.order.tokenId),
                parseInt(assetType.get(this.order.assettype)),
              ],
              [
                this.order.buyToken,
                parseInt(this.order.buyTokenId),
                parseInt(assetType.get(this.order.buyAssetType)),
              ],
            ],
            parseInt(this.order.value),
            web3.utils.toHex(this.order.fee),
            parseInt(this.order.sellPrice),
          ],
          [
            parseInt(this.order.signatureV),
            this.order.signatureR,
            this.order.signatureS,
          ],
          parseInt(this.order.buyPrice),
          [
            parseInt(JSON.parse(this.order.signature).v),
            JSON.parse(this.order.signature).r,
            JSON.parse(this.order.signature).s,
          ],
          parseInt(amount),
          buyer
        )
        .encodeABI();
      //计算需要支付的以太币
      let value = web3.utils.fromWei(this.order.fee + "", "ether");
      value = (value * amount) / this.order.value;
      value = value + (value * this.order.buyPrice) / 10000;
      value = this.printFn(value);
      value = web3.utils.toWei(value + "");
      console.log("value:\n" + value);
      // value = web3.utils.toWei(value, 'ether')
      this.sendSignedTransaction(
        data,
        exchangeV1contractAddress,
        walletAddress,
        privateKey,
        this.exchange_cb,
        value
      );
    },
    printFn(value) {
      const precision = 14;
      return Number(math.format(value, precision));
    },
    exchange_cb(ret) {
      //blockHash: "0x558654611ba802e79bdd1dc1319c908117e7bca18d35d3b7537e6fd84cf97921"
      // blockNumber: 49546
      // contractAddress: null
      // cumulativeGasUsed: 26396
      // from: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
      // gasUsed: 26396
      // logs: []
      // logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      // status: true
      // to: "0x8990c5daaa40673ef8826990a6fd8284a0a17d61"
      // transactionHash: "0xe9715010027a8db03e50b288338d69ace3bfff35e11c1c9cb7b758c5641ae4da"
      // transactionIndex: 0
      // type: "0x0"
      console.log(ret);
      console.log(ret.status);
      //TODO 购买成功   其他逻辑   购买完成后商品是否在同价下可以被其他人购买,还是需要再重新铸造
      API.buyCollect({
        certificationId: this.certificationId,
        productId: parseInt(this.$route.params.id),
        totalAmount: this.totalAmount,
        payType: this.payType,
        serviceRate: this.sellerFee,
        invitorRate: 2.5,
        contractAddress: this.detail.contractAddress,
        tradeHash: ret.transactionHash,
        invitorAddress: this.invitorAddress,
        tokenAddress: this.detail.contractAddress,
        fee: this.fee,
      }).then((result) => {
        if (result.code !== 200) {
          this.loading = false;
          this.common.notification(
            this,
            "Payment Failed, Please wait for a moment!",
            3
          );
          return;
        }
        // this.common.notification(this, "pay success!", 1);
        // this.reload();
        // this.loading = false;
        // this.buyDrawer = false;
        // 跳转pay success页面
        this.$router.push({
          path: "/pay-success",
          query: {
            totalAmount: this.totalAmount.toFixed(2),
          },
        });
      });
      //TODO  目前只考虑单次购买,所以以下逻辑不用执行
      //Approw  将操作给经办人
      // let privateKey = this.getPrivateKey();
      // let walletAddress = window.localStorage.getItem("walletAddress");
      // this.setApprovalForAll(this.order.token, privateKey, walletAddress);
    },
    // 藏品再次上架售卖
    addMallCollectionAgain() {
      this.loading = true;
      this.loadingText = "On the rack, please wait a moment";
      let privateKey = this.getPrivateKey();
      let walletAddress = window.localStorage.getItem("walletAddress");
      this.setApprovalForAll(
        this.detail.contractAddress,
        privateKey,
        walletAddress
      );
    },

    setApprovalForAll(ctsignTokencontractAddress, privateKey, walletAddress) {
      //上架  true
      const collection = new web3.eth.Contract(abiSing);
      let data = collection.methods
        .setApprovalForAll(this.NftTokenAddress.transferProxy, true)
        .encodeABI();
      this.sendSignedTransaction(
        data,
        ctsignTokencontractAddress,
        walletAddress,
        privateKey,
        this.setApprovalForAll_cb,
        0
      );
    },

    setApprovalForAll_cb(ret) {
      console.log(ret.status);
      //Fix Price 固定price
      let privateKey = this.getPrivateKey();
      let walletAddress = window.localStorage.getItem("walletAddress");

      //这里先请求后端,go back订单的详细信息
      API.bestOffers({
        param: `${this.detail.contractAddress}:${this.detail.tokenId}:${walletAddress}`,
      }).then((result) => {
        this.order = result.data;
        this.sellSignOrder(privateKey, walletAddress);
      });
    },
    //对应solidity中的encodePacked(num)
    encodePacked(...params) {
      let zeroStr64 =
        "0000000000000000000000000000000000000000000000000000000000000000";
      let resultHash = "0x";
      for (let i = 0; i < params.length; i++) {
        let param16Str = params[i].toString(16);
        if (param16Str.indexOf("0x") == 0) param16Str = param16Str.substr(2);
        param16Str = zeroStr64.substr(0, 64 - param16Str.length) + param16Str; //注释掉，使用紧凑压缩
        resultHash += param16Str;
      }
      return resultHash;
    },
    sellSignOrder(privateKey, walletAddress) {
      let selling = 1;
      let encode16Str = this.encodePacked(
        walletAddress,
        web3.utils.toHex(this.order.saltValue),
        this.order.token,
        parseInt(this.order.tokenId),
        assetType.get(this.order.assettype),
        this.order.buyToken,
        parseInt(this.order.buyTokenId),
        assetType.get(this.order.buyAssetType),
        parseInt(selling), //   ERC721 默认是1个,   小于一个没有测试
        web3.utils.toHex(web3.utils.toWei(this.onlinePrice + "")),
        parseInt(this.NftTokenAddress.sellerFee)
      );
      // console.log(stoken)
      let hashStr = web3.utils.sha3(encode16Str);
      hashStr = hashStr.replace("0x", "");
      console.log("hashStr:\n" + hashStr);
      let fullMessage =
        "\x19Ethereum Signed Message:\n" + hashStr.length + hashStr;
      hashStr = web3.utils.sha3(fullMessage);
      console.log("hashStr:\n" + hashStr);
      let privateBuffer = Buffer.from(privateKey, "hex");
      let ecsign = ethUtil.ecsign(
        Buffer.from(Web3.utils.hexToBytes(hashStr)),
        privateBuffer
      );
      console.log("r:\n" + ethUtil.bufferToHex(ecsign.r));
      console.log("s:\n" + ethUtil.bufferToHex(ecsign.s));
      console.log("v:\n" + ecsign.v);
      console.log("paramHash:\n" + hashStr);
      console.log("paramHash:\n" + hashStr);

      //r,s,v,    selling,    //   ERC721 默认是1个,   小于一个没有测试

      API.fixprice({
        r: ethUtil.bufferToHex(ecsign.r),
        s: ethUtil.bufferToHex(ecsign.s),
        v: ecsign.v,
        value: selling,
        fee: web3.utils.toWei(this.onlinePrice + ""),
        sellPrice: this.NftTokenAddress.sellerFee,
        id: this.order.id,
      }).then((result) => {
        console.log(result);
        this.loading = false;
        // 收藏品重新On a successful, 调用后台处理其他逻辑
        API.addMallCollectionAgain({
          createId: this.certificationId,
          productId: this.$route.params.id,
          collectDirId: this.detail.collectDirId,
          tokenId: this.detail.tokenId,
          price: this.onlinePrice,
          tradeHash: hashStr,
          fee: this.fee,
        }).then((result) => {
          if (result.code !== 200) {
            this.common.notification(
              this,
              "On failure, Please wait for a moment!",
              3
            );
            return;
          }
          this.common.notification(this, "On a successful!", 1);
          // 跳转首页当前藏品所属分类页面
          this.$router.push({
            path: "/",
            query: {
              sort: "time",
              tab: this.detail.productCategoryId,
            },
          });
        });
      });
    },

    async ethGas(contractAddress, data, value, walletAddress, cb, privateKeys) {
      await web3.eth.estimateGas(
        {
          to: contractAddress,
          data: data,
          value: value,
          from: walletAddress,
        },
        (error, gas) => {
          var _this = this;
          console.log("error\n:" + error);
          console.log("gas:\n" + gas);
          if (error != undefined) {
            if (error.toString().indexOf("insufficient funds") != -1) {
              _this.loading = false;
              _this.content =
                "Your current balance is not enough to pay for this order, please recharge it!";
              _this.confirmTxt = "Go to prepaid phone";
              _this.isToCharge = true;
              _this.tipVisible = true;
              return;
            }
          } else {
            var fee = web3.utils.fromWei(
              (gas * 2381000000000).toString(),
              "ether"
            );
            console.log("service fee：" + fee);
            _this.fee = parseFloat(fee).toFixed(2);
            if (_this.buyDrawer && !_this.isRemindPayFee) {
              _this.loading = false;
              _this.content =
                "It takes about a chain to pay for the order service fee " +
                _this.fee +
                "RMB About, whether to continue?";
              _this.confirmTxt = "go on";
              _this.isToPay = true;
              _this.isToCharge = false;
              _this.tipVisible = true;
              _this.isRemindPayFee = true;
              return;
            }
            if (!_this.buyDrawer && !_this.isRemindOnlineFee) {
              _this.loading = false;
              _this.content =
                "It takes about a chain to remount service fee " +
                _this.fee +
                "RMB About, whether to continue?";
              _this.confirmTxt = "go on";
              _this.isToCharge = false;
              _this.tipVisible = true;
              _this.isRemindOnlineFee = true;
              return;
            }
          }
          web3.eth
            .getTransactionCount(walletAddress, web3.eth.defaultBlock.latest)
            .then((nonce) => {
              console.info("nonce:\n" + nonce);
              let rawTx = {
                // nonce: ct3.utils.toHex(ct3.utils.hexToNumber(("0x" + nonce))),
                nonce: web3.utils.toHex(nonce),
                gasLimit: web3.utils.toHex(gas),
                gasPrice: web3.utils.toHex(2381000000000),
                to: web3.utils.toHex(contractAddress),
                from: walletAddress,
                value: web3.utils.toHex(value),
                data: web3.utils.toHex(data),
                chainId: API.getChainId(),
              };
              // console.log("privateKeys:" + privateKeys);
              let privateKeyBuffer = Buffer.from(privateKeys, "hex");
              let tx = new EtheremTx(rawTx);
              tx.sign(privateKeyBuffer);
              let serializedTx = tx.serialize();
              let serializedTxStr = "0x" + serializedTx.toString("hex");
              web3.eth.sendSignedTransaction(serializedTxStr).then((ret) => {
                cb(ret);
              });
            });
        }
      );
    },
    sendSignedTransaction(data, to, address, privateKeys, cb, value) {
      this.ethGas(to, data, value, address, cb, privateKeys);
      /* from 交易发起人地址 */
    },
    bestOffers(contractAddress, tokenId) {
      //TODO  暂时死数据
      API.bestOffers({ param: `${contractAddress}:${tokenId}` }).then(
        (result) => {
          this.order = result.data;
        }
      );
    },
    // 藏品详情
    async initDetail() {
      this.loading = true;
      console.log("Router:", this.$route.params);
      this.detail = goodsDetail;
      await API.getMallCollectionInfo({
        certificationId: this.certificationId,
        productId: this.$route.params.id,
      }).then((result) => {
        // console.log("藏品详情：" + JSON.stringify(result));
        if (result.code !== 200) {
          this.common.notification(this, "Data loading failure", 3);
          return;
        }
        if (this.data !== null) {
          this.detail = result.data;
          this.detail.productImage = this.parseHttp(result.data.coverImage);
          if (this.isLogin) {
            this.$refs.payDrawerContent.calPayInfo(
              result.data,
              this.buyerFee,
              this.balance
            );
          }
          this.productStatus = result.data.status;
          this.invitorAddress = result.data.invitorAddress;

          //获取当前最新的订单状态
          this.bestOffers(result.data.contractAddress, result.data.tokenId);
        }
        // 查询同类型或者同author藏品列表
        this.getSameAuthorOrCategoryCollectionList();
        if (this.isLogin) {
          // 查询当前藏品是否点赞/收藏
          this.checkIsFavoriteAndCollect();
          //获取用户信息
          this.getUserInfo();
        }
        //获取藏品交易记录
        this.getTradeRecordList();
        this.loading = false;
      });
    },
    // 查询同类型或者同author藏品列表
    getSameAuthorOrCategoryCollectionList() {
      API.getSameAuthorOrCategoryCollectionList({
        certificationId: this.certificationId,
        productId: this.$route.params.id,
        orderBy: this.orderBy,
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(this, "Data loading failure", 3);
          return;
        }
        if (result.data !== null) {
          this.sameAuthorList = result.data.sameAuthorList;
          this.sameCategoryList = result.data.sameCategoryList;
          this.handleActiveType(this.currentKey);
        }
      });
    },
    handleActiveType(val) {
      this.currentKey = val;
      if (val === "category") {
        this.$refs.sameAuthorList.getSameAuthorList(this.sameCategoryList);
      } else {
        this.$refs.sameAuthorList.getSameAuthorList(this.sameAuthorList);
      }
    },
    handleCloseDrawer() {
      this.drawer = false;
    },
    handleBuy() {
      if (!this.isLogin) {
        this.$router.push({
          path: "/login",
        });
        return;
      }

      if (this.userStatus == 4) {
        this.common.notification(
          this,
          "We cannot place orders during the real-name audit, please wait patiently！",
          2
        );
        return;
      }
      // 自己You can't order your own collection
      if (this.owner === window.localStorage.getItem("walletAddress")) {
        this.common.notification(
          this,
          "You can't order your own collection！",
          2
        );
        var buyNow = document.getElementById("buyNow");
        buyNow.setAttribute("disabled", true);
        return;
      }
      if (this.productStatus != 0) {
        var buyNow = document.getElementById("buyNow");
        buyNow.setAttribute("disabled", true);
        return;
      }
      this.buyDrawer = true;
      // if (this.clientWidth < 800) {
      //   this.buyDrawer = true;
      // } else {
      //   this.$router.push({
      //     path: `/order-info/${this.$route.params.id}`,
      //   });
      // }
    },
  },
};
</script>

<style lang="less" scoped>
.detail {
  @media screen and (max-width: 800px) {
    padding-bottom: 1.07rem;
  }

  /deep/ .radiusDrawerBuy {
    border-radius: 0.3rem 0.3rem 0 0;
    @media screen and (min-width: 800px) {
      border-radius: 0;
      background: #f7f7f7;
    }

    .el-drawer__header {
      margin-bottom: 0;
    }
  }

  /deep/ .pcHeader {
    @media screen and (max-width: 800px) {
      display: none;
    }
  }
}

.detailContent {
  max-width: 60%;
  margin: 0 auto;
  @media screen and (max-width: 800px) {
    max-width: 100%;
  }
}

.bread {
  margin: 0.24rem 0 0.27rem;
  @media screen and (max-width: 800px) {
    display: none;
  }
}

.goodsMain {
  width: 100%;
  height: 5.11rem;
  display: flex;
  padding: 0.21rem 0.23rem;
  background: #000000;
  border: 1px solid #d2d2d2;
  @media screen and (max-width: 800px) {
    height: auto;
    padding: 0;
    flex-direction: column;
    border: 0;
  }
}

.goodsLtTop {
  position: relative;
  width: 4.96rem;
  height: 3.74rem;
  margin-right: 0.5rem;
  margin-bottom: 0.3rem;
  border-radius: 0.04rem;
  background: #eee;
  &.media {
    background: #333;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
    height: 7.14rem;
    margin-bottom: 0.41rem;
  }
}

.goodsLtBtm {
  display: flex;
  align-items: center;
  @media screen and (max-width: 800px) {
    display: none;
  }
}

.avatarBox {
  display: flex;
  align-items: center;

  .avatarImg {
    width: 0.6rem;
    height: 0.6rem;
    margin-right: 0.13rem;
    border-radius: 100%;
  }

  .avatarInfo {
    display: flex;
    flex-direction: column;
    margin-right: 0.88rem;
    font-size: 0.16rem;
    color: #1a1a1a;
  }
}

.goodsRt {
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 800px) {
    padding: 0 0.26rem;
    flex-direction: column-reverse;
  }
}

.goodsName {
  line-height: 0.36rem;
  margin-bottom: 0.27rem;
  font-size: 0.36rem;
  color: #000000;
}

.priceAndType {
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 800px) {
    margin-bottom: 0.35rem;
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: center;
  }
}

.goodsType {
  margin-bottom: 0.7rem;
  font-size: 0.2rem;
  color: #000000;
  @media screen and (max-width: 800px) {
    padding: 0.11rem 0.18rem;
    margin-left: 0.22rem;
    margin-bottom: 0;
    background: #eeeeee;
    font-size: 0.24rem;
    color: #777;
    border-radius: 0.1rem;
  }
}

.price {
  margin-bottom: 0.28rem;
  color: #2fb1c0;
  @media screen and (max-width: 800px) {
    margin-bottom: 0;
  }

  i {
    font-size: 0.25rem;
  }

  span {
    font-size: 0.32rem;
    @media screen and (max-width: 800px) {
      font-size: 0.43rem;
    }
  }
  .smNum {
    @media screen and (max-width: 800px) {
      font-size: 0.31rem;
    }
  }
}

.buyAndOther {
  @media screen and (max-width: 800px) {
    position: fixed;
    display: flex;
    height: 1.07rem;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.25rem;
    background: #fff;
    box-shadow: 0px 0px 4px 0px rgba(197, 197, 197, 0.51);
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 88;
    .starLike {
      margin-top: 0;
    }

    .starLikeNum {
      display: none;
    }
  }
}

.btnTradeRec {
  display: none;
  @media screen and (max-width: 800px) {
    display: inline-block;
    margin-right: 0.37rem;
    background: #fff;
    font-size: 0.3rem;
    &.flexBtn {
      flex: 1;
    }
  }
}

.flexBtnBox {
  display: flex;
  flex: 1;
  .btnTradeRec {
    margin-right: 0;
  }
}

.onsaleBtn {
  flex: 1;
}

.btnBuy {
  width: 1.8rem;
  font-size: 0.24rem;
  @media screen and (max-width: 800px) {
    font-size: 0.3rem;
  }
}

.starLike {
  display: flex;
  align-items: center;
  margin-top: 0.45rem;
  font-size: 0.15rem;
  color: #666666;

  .likeNum {
    display: flex;
    align-items: center;
    margin-right: 0.63rem;
    cursor: pointer;
    @media screen and (max-width: 800px) {
      flex-direction: column;
      justify-content: center;
      font-size: 0.24rem;
      color: #555;
    }

    &::before {
      content: "";
      width: 0.32rem;
      height: 0.32rem;
      margin-right: 0.08rem;
      background: url("../assets/images/icon_dianzan_d@2x.png") no-repeat center;
      background-size: 0.32rem 0.32rem;
      @media screen and (max-width: 800px) {
        width: 0.36rem;
        height: 0.36rem;
        margin: 0 auto 0.1rem;
        color: #555;
      }
    }
    &.active::before {
      background: url("../assets/images/icon_dianzan_pre_d@2x.png") no-repeat
        center;
      background-size: 0.32rem 0.32rem;
    }
  }

  .starNum {
    display: flex;
    align-items: center;
    cursor: pointer;
    @media screen and (max-width: 800px) {
      flex-direction: column;
      font-size: 0.24rem;
    }

    &::before {
      content: "";
      width: 0.32rem;
      height: 0.32rem;
      margin-right: 0.08rem;
      background: url("../assets/images/icon_shoucang@2x.png") no-repeat center;
      background-size: 0.32rem 0.32rem;
      @media screen and (max-width: 800px) {
        width: 0.36rem;
        height: 0.36rem;
        margin: 0 auto 0.1rem;
      }
    }
    &.active::before {
      background: url("../assets/images/icon_sc_pre@2x.png") no-repeat center;
      background-size: 0.32rem 0.32rem;
    }
  }
}

.detailDesc {
  margin: 0.6rem 0;

  .detailDescTab {
    @media screen and (max-width: 800px) {
      display: none;
    }
  }
}

.descContent {
  margin: 0.6rem 0 0;
  padding-bottom: 0.53rem;
  font-size: 0.18rem;
  color: #333333;
  border-bottom: 1px solid #e5e5e5;
  @media screen and (max-width: 800px) {
    margin: 0 0.26rem 0.1rem;
    padding-top: 0.43rem;
    font-size: 0.24rem;
    line-height: 0.42rem;
    border-bottom: 0;
  }
}

.selectionCondition {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.77rem;
  @media screen and (max-width: 800px) {
    margin-bottom: 0.55rem;
  }
}

.selectionLt {
  display: flex;
  align-items: center;

  .title {
    margin-right: 0.52rem;
    font-size: 0.3rem;
    color: #1a1a1a;
    @media screen and (max-width: 800px) {
      display: none;
    }
  }

  .types {
    display: flex;
    font-size: 0.22rem;
  }
}

.similar {
  @media screen and (max-width: 800px) {
    padding: 0 0.26rem;
  }
}

.similarType {
  margin-right: 0.43rem;
  font-size: 0.22rem;
  color: #999;
  cursor: pointer;
  @media screen and (max-width: 800px) {
    font-size: 0.3rem;
  }

  &.active {
    color: #2fb1c0;
  }
}

.selectionRt {
  display: flex;
  align-items: center;
}

.titleDivider {
  display: none;
  @media screen and (max-width: 800px) {
    display: block;
    margin-bottom: 0.54rem;
    font-size: 0.3rem;
    color: #1a1a1a;
    text-align: center;
  }
}

.mGoodsInfo {
  display: none;
  @media screen and (max-width: 800px) {
    display: block;
    margin: 0 0.26rem;
    padding: 0.3rem 0 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }

  .mGoodsItem {
    display: flex;
    align-items: center;
    margin-bottom: 0.27rem;
  }

  .label {
    width: 1.8rem;
    margin-right: 0.26rem;
    font-size: 0.24rem;
    font-weight: 500;
    color: #777777;
  }

  .val {
    font-size: 0.24rem;
    font-weight: 500;
    color: #333;
  }
}

/deep/ .radiusDrawer {
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
}

.drawerContent {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0.38rem 0.26rem 0;
}

.drawerList {
  position: relative;
  flex: 1;
}

.drawerHead {
  position: relative;
  text-align: center;

  .drawerTitle {
    font-size: 0.3rem;
    color: #1a1a1a;
  }

  i {
    position: absolute;
    font-size: 0.28rem;
    color: #787878;
    right: 0;
    top: 0.08rem;
  }
}
.pcTradeRecord {
  @media screen and (max-width: 800px) {
    display: none;
  }
}
</style>
