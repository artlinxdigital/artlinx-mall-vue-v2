<template>
  <div
    class="detail pcContainer"
    v-loading.fullscreen.lock="loading"
    :element-loading-text="loadingText"
  >
    <!--  三个背景圈圈 -->
    <span class="filterBgLt"></span>
    <span class="filterBgRb"></span>
    <span class="filterBgLb"></span>

    <PcPageHeader @search="searchList" />
    <div class="detailContent">
      <div class="dtailInfoWrap">
        <div class="dtailInfoWrapIn">
          <Bread
            :productCategoryName="detail.productCategoryName"
            :productName="detail.productName"
          />

          <div class="detailCard">
            <div class="detailCardLt">
              <el-image
                class="fillImg"
                :src="detail.coverImage"
                fit="cover"
                v-if="detail.productType === 1"
                :previewSrcList="[detail.coverImage]"
                lazy
              >
                <div slot="placeholder">
                  <el-image
                    class="fillImg"
                    :src="placeholderImg"
                    fit="cover"
                  ></el-image>
                </div>
                <div slot="error" class="image-slot">
                  <el-image
                    class="fillImg"
                    :src="errImg"
                    fit="contain"
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
                Your browser does not support audio playback。
              </audio>
            </div>
            <div class="detailCardRt">
              <h1 class="goodsName">
                {{ detail.productName }}
                <el-popover placement="right" width="76px" trigger="hover">
                  <div
                    style="width: 126px; height: 126px"
                    id="detailQRCode"
                    ref="detailQRCode"
                  >
                    <!-- <img style="width: 100%; height: 100%" src="../assets/images/qrcode_www.baidu.com.png" alt=""> -->
                  </div>
                  <div style="text-align: center; margin-top: 10px">
                    QR code
                  </div>
                  <span slot="reference" class="qrcodeIco"></span>
                </el-popover>
              </h1>
              <p class="goodsDesc">
                {{ detail.productCategoryName }}
              </p>
              <div class="createDate">
                Creation date：{{
                  detail.tokenTime && detail.tokenTime.split(" ")[0]
                }}
              </div>

              <!-- <div class="authorWrap">
                <div class="authorImg">
                  <el-image
                    class="fillImg"
                    :src="authorImg"
                    fit="cover"
                    lazy
                  ></el-image>
                </div>
                <span class="authorName">{{ detail.productCreatorNickName | ellipsisNickName }}</span>
              </div> -->

              <div class="priceBox">
                <i class="icMony">HK$</i>
                <span class="price">{{
                  detail.price && detail.price.toFixed(2)
                }}</span>
              </div>

              <div class="buyAndOther" v-if="canReOnSale || !isShowFoot">
                <div :class="{ flexBtnBox: isShowFoot || canReOnSale }">
                  <button
                    class="btnBuy"
                    @click="beforeOnlineAgain"
                    v-if="canReOnSale"
                  >
                    Sell
                  </button>
                  <button class="btnBuy" @click="handleBuy" v-if="!isShowFoot">
                    Buy It Now
                  </button>
                </div>
                <div class="starLike" v-if="!isShowFoot">
                  <div
                    class="star"
                    :class="{ active: collectOpe.isCollection === 1 }"
                    @click="addCollection"
                  >
                    <i class="iconfont icon-aixin"></i>
                    <span>{{ collectOpe.collectionCount }}</span>
                  </div>
                  <div
                    class="like"
                    :class="{ active: collectOpe.isFavorite === 1 }"
                    @click="addFavorite"
                  >
                    <i class="iconfont icon-dianzan"></i>
                    <span>{{ collectOpe.favoriteCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 其它信息 -->
      <div class="otherInfo">
        <div class="otherInfoLt">
          <!-- 藏品信息 -->
          <GoodsInfo
            :contractAddress="detail.contractAddress"
            :tokenId="detail.tokenId"
          />
          <!-- 藏品信息 -->
          <GoodsDesc :desc="detail.productDesc" :date="detail.tokenTime" />
          <!-- author信息 -->
          <AuthorPanel :authorInfo="authorInfo" />
        </div>

        <div class="otherInfoRt">
          <!-- 交易信息 -->
          <TradeInfo :records="tradeRecords" />
        </div>
      </div>

      <!-- 相关推荐 -->
      <div class="recomendBox">
        <Recomend ref="sameAuthorList" />
      </div>
    </div>

    <!-- 立即购买 -->
    <PayDrawerContent
      :visible.sync="buyDrawer"
      :clientWidth.sync="clientWidth"
      :userName="userInfo.nickName"
      @navBuy="navBuy"
      @backToDetail="backToDetail"
      ref="payDrawerContent"
    />

    <!-- 重新上架修改price弹窗 -->
    <ChangePrice
      v-if="changePriceVisible"
      :visible.sync="changePriceVisible"
      :originPrice="detail.price ? detail.price : ''"
      :coin="detail.coinType ? detail.coinType : ''"
      :clientWidth.sync="clientWidth"
      @close="changePriceVisible = false"
      @onlineAgain="onlineAgain"
    />

    <!-- 提示信息弹窗 -->
    <TipModal
      :visible.sync="tipVisible"
      title="Tips"
      :content="content"
      cancelTxt="cancel"
      :confirmTxt="confirmTxt"
      @close="tipVisible = false"
      @ok="toConfirm"
    />

    <!-- 支付二维码弹窗 -->
    <PayCodeModal :visible.sync="payCodeVisible" ref="payCodeModal" />

    <MTipModal
      :visible.sync="mTipVisible"
      title="Tips"
      :content="mContent"
      cancelTxt="cancel"
      :confirmTxt="mConfirmTxt"
      @close="mTipVisible = false"
      @ok="mToConfirm"
    />
  </div>
</template>

<script>
import PcPageHeader from "@/components/PcPageHeader";
import GoodsDesc from "@/components/CollectionDetail/GoodsDesc";
import GoodsInfo from "@/components/CollectionDetail/GoodsInfo";
import AuthorPanel from "@/components/CollectionDetail/AuthorPanel";
import TradeInfo from "@/components/CollectionDetail/TradeInfo";
import Recomend from "@/components/CollectionDetail/Recomend";
import Bread from "@/components/CollectionDetail/Bread";
import ChangePrice from "@/components/CollectionDetail/ChangePrice";
import PayDrawerContent from "@/components/CollectionDetail/PayDrawerContent";
import PayCodeModal from "@/components/CollectionDetail/PayCodeModal";
import TipModal from "@/components/TipModal";
import MTipModal from "@/components/MTipModal";
import { isInMobile } from "@/utils/checkEnv";
import API from "@/service";
import abiSing from "@/contract/abiSing.json";
let ethUtil = require("ethereumjs-util");
const EtheremTx = require("ethereumjs-tx");
let exchangeabiSing = require("@/contract/exchangeabiSing.json");
let Web3 = require("web3");
import * as math from "mathjs";
import { det, re } from "mathjs";
import { numberAdd } from "@/utils/rules";
import { projectUrl } from "@/service/config";
import QRCode1 from "qrcodejs2";
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
    GoodsDesc,
    GoodsInfo,
    AuthorPanel,
    TradeInfo,
    Recomend,
    PayDrawerContent,
    ChangePrice,
    Bread,
    PayCodeModal,
    TipModal,
    MTipModal,
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
    ellipsisNickName(value) {
      if (!value) return "";
      if (value.length > 4) {
        if (value.length > 8) {
          return `${value.substring(0, 4)}****${value.substring(
            value.length - 4
          )}`;
        }
        return `${value.substring(0, 2)}****${value.substring(
          value.length - 2
        )}`;
      }
      return value;
    },
  },
  inject: ["reload"],
  data() {
    return {
      authorImg: require("@/assets/images/newTheme/author_avatar.jpeg"),
      changePriceVisible: false,
      drawer: false,
      detail: {},
      activeSelection: "1",
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
      confirmTxt: "confirm",
      userStatus: 1,
      applyStatus: -1,
      productStatus: 0,
      /** 交易记录 */
      tradeRecords: [],
      orderBy: "",
      orderByType: "",
      collectOpe: {},
      placeholderImg: require("@/assets/images/artlinx_loading.jpg"),
      errImg: require("@/assets/images/load_err.jpg"),
      fee: 0,
      isToCharge: false,
      isRemindOnlineFee: false,
      onlinePrice: 0,
      isToPay: false,
      isRemindPayFee: false,
      sellerFee: 0,
      invitorAddress: "",
      clientWidth: 750,
      payCodeVisible: false,
      codeUrl: "",
      userInfo: {},
      loginId: "",
      isLogin: true,
      certificationId: 0,
      orderId: "",
      mTipVisible: false,
      mContent: "",
      mConfirmTxt: "confirm",
      isToHome: false,
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
    authorInfo() {
      const {
        productCreatorNickName,
        tokenTime,
        productCreatorIntro,
        productCreatorAvatar,
        productAuthor,
        productAuthorDesc,
      } = this.detail;
      return {
        productCreatorNickName,
        tokenTime,
        productCreatorAvatar,
        introduction: this.userInfo.introduction,
        productCreatorIntro,
        productAuthor,
        productAuthorDesc,
      };
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
    if (this.orderId && this.orderId != "null") {
      this.setTimer(2000);
    }
    //获取合约配置
    API.getContractConfig().then((result) => {
      // console.log("contractConfig: " + JSON.stringify(result));
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
    this.createDetailQRCode();
  },
  beforeRouteLeave(to, form, next) {
    if (this.orderId) {
      sessionStorage.setItem("wxPayOrderNo", null);
      this.destoryed();
    }
    next();
  },
  methods: {
    // 搜索
    searchList(keyword) {
      if (keyword) {
        this.$router.push({
          name: "Home",
          params: {
            keyword: keyword,
          },
        });
      }
    },
    // 生成藏品详情页面二维码
    createDetailQRCode() {
      let dom = document.getElementById("detailQRCode");
      document.getElementById("detailQRCode").innerHTML = "";
      new QRCode1(dom, {
        text: window.location.href,
        width: 126,
        height: 126,
        colorDark: "#333333", //二维码颜色
        colorLight: "#ffffff", //二维码背景色
        correctLevel: QRCode1.CorrectLevel.L, //容错率，L/M/H
      });
    },
    // Go back for details
    backToDetail() {
      this.reload();
    },
    // 重新上架之前的逻辑判断
    beforeOnlineAgain() {
      this.changePriceVisible = true;
    },
    mToConfirm() {
      if (this.userStatus !== 1) {
        this.$router.push({
          path: "/realname",
        });
        return;
      }
      if (this.applyStatus === -1 || this.applyStatus === 2) {
        this.addReleaseApply();
      }
    },
    // 申请成为铸造者
    addReleaseApply() {
      this.$API
        .addReleaseApply({
          certificationId: window.localStorage.getItem("loginId"),
        })
        .then((result) => {
          this.mTipVisible = false;
          if (result.code !== 200) {
            if (result.msg) {
              this.common.notification(this, result.msg, 3);
              return;
            }
            this.common.notification(
              this,
              "Application failed to submit, please try again later!",
              3
            );
            return;
          }
          this.common.notification(
            this,
            "Application has been submitted, please be patient!",
            1
          );
          return;
        });
    },
    // 生成藏品详情页面二维码
    createDetailQRCode() {
      let dom = document.getElementById("detailQRCode");
      document.getElementById("detailQRCode").innerHTML = "";
      new QRCode1(dom, {
        text: window.location.href,
        width: 126,
        height: 126,
        colorDark: "#333333", //二维码颜色
        colorLight: "#ffffff", //二维码背景色
        correctLevel: QRCode1.CorrectLevel.L, //容错率，L/M/H
      });
    },
    // 重新上架
    onlineAgain(price) {
      this.changePriceVisible = false;
      this.onlinePrice = price;
      this.addMallCollectionAgain();
      console.log("the latest price：" + price);
    },
    // 查询地址余额
    async getUserBalance() {
      await web3.eth
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
          this.userInfo = result.data;
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
        this.isRemindPayFee = true;
        // Alipay支付
        if (this.payType == 2) {
          this.startAliPay();
        }
        // WeChat Pay
        if (this.payType == 1) {
          this.startWxPay();
        }
        // balance paid
        if (this.payType == 3) {
          this.navBuy(
            privateKey,
            walletAddress,
            this.totalAmount,
            this.payType
          );
        }
      } else if (this.isToCharge) {
        this.$router.push({
          path: "/funding",
        });
        return;
      } else if (this.isToHome) {
        this.$router.push({
          path: "/",
        });
        return;
      } else {
        this.tipVisible = false;
        this.isRemindOnlineFee = true;
        this.addMallCollectionAgain();
      }
    },
    // Alipay支付
    startAliPay() {
      console.log(numberAdd(this.totalAmount, this.fee));
      API.startAliPay({
        address: window.localStorage.getItem("walletAddress"),
        type: isInMobile() ? 1 : 3,
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
        console.log("表单form: " + JSON.stringify(result));
        this.isRemindPayFee = false;
        if (isInMobile()) {
          this.loading = true;
          this.loadingText = "Please wait while the tranctions is processing";
          const div = document.createElement("div");
          div.innerHTML = result.data;
          document.body.append(div);
          this.loading = false;
          document.forms[0].submit();
        } else {
          this.codeUrl = `${projectUrl.dev}` + result.data;
          // this.codeUrl = `${projectUrl.test}` + result.data;
          this.orderId = result.msg;
          this.setTimer(2000);
          this.$refs.payCodeModal.payCodeInfo(
            this.payType,
            this.codeUrl,
            this.timer
          );
          this.payCodeVisible = true;
        }
      });
    },
    // WeChat Pay
    startWxPay() {
      console.log(numberAdd(this.totalAmount, this.fee));
      if (!isInMobile()) {
        this.payCodeVisible = true;
      }
      API.startWxPay({
        address: window.localStorage.getItem("walletAddress"),
        subject: "WeChat Pay",
        type: isInMobile() ? 1 : 0,
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
        console.log("表单form: " + JSON.stringify(result));
        this.isRemindPayFee = false;
        if (isInMobile()) {
          this.loading = true;
          this.loadingText = "Please wait while the tranctions is processing";
          this.orderId = result.data.out_trade_no;
          sessionStorage.setItem("wxPayOrderNo", this.orderId);
          this.loading = false;
          window.location.href = result.data.mweb_url;
        } else {
          this.codeUrl = result.data.codeUrl;
          this.orderId = result.data.out_trade_no;
          this.setTimer(2000);
          this.$refs.payCodeModal.payCodeInfo(
            this.payType,
            this.codeUrl,
            this.timer
          );
        }
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
            if (isInMobile()) {
              sessionStorage.setItem("wxPayOrderNo", null);
            } else {
              this.payCodeVisible = false;
            }
            this.common.notification(this, chargeTitle, type);
            this.$router.push({
              path: "/pay-success",
              query: {
                out_trade_no: this.orderId,
                chainType: this.detail.chainType,
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
        productId: this.detail.productId,
        certificationId: this.certificationId,
        tokenId: this.detail.tokenId,
        contractAddress: this.detail.contractAddress,
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(this, "Data loading failure！", 3);
          return;
        }
        this.tradeRecords = result.data;
        // this.$refs.tradeRecord.getTradeRecordList(result.data);
      });
    },
    navBuy(privateKey, walletAddress, totalAmount, payType) {
      this.totalAmount = totalAmount;
      this.payType = payType;
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
      this.loadingText = this.isRemindPayFee
        ? "Please wait for a moment while transaction is in progress"
        : "Please wait for a moment";
      this.loading = true;
      API.buyerFeesign({ id: this.order.id }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(this, result.msg, 3);
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
        invitorRate: 0,
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
            totalAmount: numberAdd(this.totalAmount, this.fee),
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
      this.loadingText = this.isRemindOnlineFee
        ? "On the rack, please wait a moment"
        : "Please wait for a moment";
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
          gas = gas ? gas : 320000;
          var fee = web3.utils.fromWei(
            (gas * 2381000000000).toString(),
            "ether"
          );
          console.log("service fee：" + fee);
          _this.fee = parseFloat(fee).toFixed(2);
          if (error != undefined) {
            if (error.toString().indexOf("not enough stock") != -1) {
              _this.loading = false;
              _this.content =
                "The current collection has been traded, you can Go back homego on browse other collections!";
              _this.confirmTxt = "Go to the home page";
              _this.isToHome = true;
              _this.tipVisible = true;
              return;
            }
            if (error.toString().indexOf("insufficient funds") != -1) {
              if (_this.payType == 3) {
                _this.loading = false;
                _this.content =
                  "Your current balance is not enough to pay for this order, please recharge it!";
                _this.confirmTxt = "Go to prepaid phone";
                _this.isToCharge = true;
                _this.tipVisible = true;
                return;
              } else {
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
                  return;
                }
              }
            }
          } else {
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
          this.detail.coverImage ='https://imagedelivery.net/SynVCJ8TRAd-vPjFeKYdCQ/' + result.data.coverImage + '/public';
          this.$refs.payDrawerContent.calPayInfo(
            result.data,
            this.buyerFee,
            this.balance
          );
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
    },
  },
};
</script>

<style lang="less" scoped>
@import url("../assets/less/varible.less");

.detail {
  position: relative;
  overflow: hidden;
}

.filterBgLt {
  position: absolute;
  width: 5.46rem;
  height: 5.46rem;
  background: #ffffff;
  opacity: 0.16;
  filter: blur(50px);
  left: -2.43rem;
  top: 4.98rem;
  border-radius: 100%;
  @media screen and (max-width: 800px) {
    display: none;
  }
}

.filterBgRb {
  position: absolute;
  width: 6.03rem;
  height: 6.03rem;
  //background: rgba(8, 95, 255, 0.23);
  filter: blur(50px);
  right: -3.3rem;
  top: 9.98rem;
  border-radius: 100%;
  @media screen and (max-width: 800px) {
    display: none;
  }
}

.filterBgLb {
  position: absolute;
  width: 5.66rem;
  height: 5.66rem;
  background: transparent;
  filter: blur(50px);
  left: -1.5rem;
  top: 13.98rem;
  border-radius: 100%;
  @media screen and (max-width: 800px) {
    display: none;
  }
}

.detailContent {
  padding: 0 50px;
  @media screen and (max-width: 800px) {
    padding: 0;
  }
}
.dtailInfoWrap {
  position: relative;
  padding: 24px 80px;
  border-radius: 0.16rem;
  background: url("../assets/images/newTheme/detail_bg.png") no-repeat top
    center;
  background-size: 100% 79%;
  @media screen and (max-width: 800px) {
    padding: 0.33rem 0.15rem 0.24rem;
    //background: linear-gradient(
    //  148deg,
    //  #13c8ff 0%,
    //  #12beff 6%,
    //  #11b3ff 12%,
    //  #10a7ff 19%,
    //  #0e9bff 26%,
    //  #0d8eff 36%,
    //  #0c82ff 47%,
    //  #0a75ff 62%,
    //  #0969ff 79%,
    //  #085fff 100%
    //);
    //background-size: 100% 3.94rem;
    //background-repeat: no-repeat;
    border-radius: 0.05rem;
  }
}
.dtailInfoWrapIn {
  max-width: @maxWidthWrap;
  margin: 0 auto;
}

.detailCard {
  display: flex;
  align-items: center;
  // min-height: 4.38rem;
  margin: 0.22rem auto 0;
  padding: 0.29rem 0.33rem;
  background: rgba(255, 255, 255, 0.1)
    url("../assets/images/newTheme/detail_bg_in.png") no-repeat center;
  background-size: cover;
  border-radius: 2px;
  overflow: hidden;
  // filter: blur(0) brightness(100%);
  backdrop-filter: blur(0.2rem);
  @media screen and (max-width: 800px) {
    flex-direction: column;
    align-items: baseline;
    padding: 10px;
    margin: 0 auto;
    background: none;
    backdrop-filter: initial;
  }
}
.detailCardLt {
  position: relative;
  width: 3.3rem;
  height: 3.76rem;
  //border-radius: 0.16rem;
  background-color: #fff;
  .fillImg {
    //border-radius: 0.16rem;
  }
  video,
  audio {
    width: 100%;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
    height: 4.38rem;
    padding: 0.17rem;
    background: #ffffff;
  }
}
.detailCardRt {
  height: 100%;
  padding-left: 0.32rem;
  @media screen and (max-width: 800px) {
    padding-left: 0;
  }
}
.goodsName {
  font-size: 0.36rem;
  font-weight: 500;
  color: #000000;
  @media screen and (max-width: 800px) {
    margin-top: 0.23rem;
    font-size: 0.24rem;
  }
  span {
    display: inline;
    line-height: 0.4rem;
    font-size: 0.36rem;
    color: #1a1a1a;
    vertical-align: middle;
    &.qrcodeIco {
      position: relative;
      display: inline-block;
      width: 0.32rem;
      height: 0.32rem;
      margin-left: 0.1rem;
      background: url("../assets/images/ic_sm_qrcode.png") no-repeat center;
      background-size: contain;
      cursor: pointer;
      vertical-align: text-bottom;
    }
  }
}
.goodsDesc {
  margin: 0.16rem 0;
  font-size: 0.14rem;
  color: #fff;
  line-height: 0.21rem;
}
.createDate {
  margin: 0.16rem 0 0.32rem;
  font-size: 0.14rem;
  font-weight: 500;
  color: #707070;
  @media screen and (max-width: 800px) {
    margin-bottom: 0.24rem;
    color: #b0b0b0;
  }
}
.authorWrap {
  display: inline-flex;
  align-items: center;
  height: 0.48rem;
  padding: 0.08rem 0.16rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.24rem;
}
.authorImg {
  width: 0.32rem;
  height: 0.32rem;
  border-radius: 100%;
  .fillImg {
    border-radius: 100%;
  }
}
.authorName {
  //margin-left: 0.12rem;
  font-size: 0.14rem;
  font-weight: 500;
  color: #000000;
}
.priceBox {
  display: flex;
  align-items: baseline;
  margin: 0.32rem 0;
  @media screen and (max-width: 800px) {
    margin: 0.24rem 0;
  }
  .icMony {
    margin-right: 0.08rem;
    font-size: 0.2rem;
    font-weight: 500;
    font-family: "NotoSansCJK", "SourceHanSansCN-Medium", "SourceHanSansCN";
    color: #ffd121;
  }
  .price {
    font-family: "NotoSansCJK", "DINAlternate-Bold", "DINAlternate";
    font-size: 0.32rem;
    font-weight: bold;
    color: #ffc921;
  }
}
.btnBuy {
  padding: 0.16rem 0.64rem;
  background: #2a513f;
  border-radius: 0.4rem;
  font-size: 0.16rem;
  font-family: "NotoSansCJK", "SourceHanSansCN-Medium", "SourceHanSansCN";
  font-weight: 500;
  color: #ffffff;
  border: 0;
  @media screen and (max-width: 800px) {
    width: 1.72rem;
    height: 0.36rem;
    padding: 0;
  }
  &:hover {
    transition: all 0.3s ease-in-out;
    background: rgba(18, 22, 31, 0.95);
  }
}
.flexBtnBox {
  width: 100%;
  .btnBuy {
    @media screen and (max-width: 800px) {
      width: 100%;
    }
  }
}
.buyAndOther {
  display: flex;
  align-items: center;
  @media screen and (max-width: 800px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    flex-direction: row-reverse;
    padding: 0.15rem 0.16rem 0.15rem;
    background: #ffffff;
    backdrop-filter: blur(0.2rem);
    z-index: 10;
  }
}
.starLike {
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 0.32rem;
  font-size: 0.16rem;
  font-weight: bold;
  .iconfont {
    margin-right: 0.1rem;
    font-size: 0.2rem;
    @media screen and (max-width: 800px) {
      margin-right: 0.04rem;
    }
  }
  .star,
  .like {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0.85rem;
    margin-right: 0.16rem;
    padding: 0.15rem 0.14rem;
    border-radius: 0.3rem;
    color: #707070;
    cursor: pointer;
    @media screen and (max-width: 800px) {
      min-width: 0.73rem;
      height: 0.36rem;
      margin-right: 0.08rem;
      span {
        font-size: 0.14rem;
      }
    }
    &.active {
      // color: #f00;
    }
  }
  .star {
    background: #000000;
  }
  .like {
    background: #ffc921;
  }
}
.otherInfo {
  display: flex;
  justify-content: space-between;
  max-width: @maxWidthWrap;
  // padding: 0 0.8rem;
  margin: 1.02rem auto 0.96rem;
  .otherInfoLt {
    width: 46.79%;
    @media screen and (max-width: 800px) {
      width: 100%;
    }
  }
  .otherInfoRt {
    width: 44.42%;
    @media screen and (max-width: 800px) {
      width: 100%;
      margin-top: 0.2rem;
    }
  }
  @media screen and (max-width: 800px) {
    flex-direction: column;
    margin: 0 0.16rem;
  }
}
.recomendBox {
  max-width: @maxWidthWrap;
  margin: 0 auto;
  @media screen and (max-width: 800px) {
    margin: 0 0.16rem;
  }
}
.image-slot {
  height: 100%;
  background-color: #fff;
}
</style>
