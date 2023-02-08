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

    <PcPageHeader @search="searchList"/>
    <div class="detailContent">
      <div class="dtailInfoWrap">
        <div class="dtailInfoWrapIn">
          <Bread
              :productCategoryName="detail.productCategoryName"
              :productName="detail.productName"
          />

          <div class="detailCard">
            <div class="detailCardLt">
              <!-- v-if="detail.productType === 1" -->
              <el-image
                  class="fillImg"
                  v-if="detail.coverImage"
                  :src="'https://imagedelivery.net/SynVCJ8TRAd-vPjFeKYdCQ/' +  detail.coverImage + '/public'"
                  fit="cover"
                  :previewSrcList="['https://imagedelivery.net/SynVCJ8TRAd-vPjFeKYdCQ/' +  detail.coverImage + '/public']"
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
              <!-- <video width="100%" height="100%" controls v-if="false">
                <!-- v-if="detail.productType === 3" -->
              <!-- <source :src="detail.coverImage" type="video/mp4" />
                Your browser does not support this video。 -->
              <!-- </video> -->
              <!-- <audio
                width="100%"
                height="100%"
                class="centerBlock"
                controls
                v-if="detail.productType === 2"
              >
                <source :src="detail.coverImage" type="audio/mpeg" />
                Your browser does not support this audio playback。
              </audio> -->
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

              <div class="priceBox" v-if="!onlyDisplayShow">
                <i class="icMony">{{ coinMap[detail.coinType] }}:</i>
                <span class="price">{{
                    detail.price && detail.price.toFixed(2)
                  }}</span>
              </div>
              <div class="priceBox">
                <button
                    class="btnInquiry"
                    v-if="onlyDisplayShow && isLogin"
                    @click="toInquiry"
                >
                  Enquiry
                </button>
              </div>
              <div class="buyAndOther">
                <div :class="{ flexBtnBox: isShowFootShow || canReOnSaleShow }">
                  <button
                      class="btnBuy"
                      @click="checkBeforeOnlineAgain"
                      v-if="canReOnSaleShow && !onlyDisplayShow"
                  >
                    Sell
                  </button>
                  <button
                      class="btnBuy"
                      @click="takeDown"
                      v-if="canRevokeShow && !onlyDisplayShow"
                  >
                    Take Down
                  </button>
                  <button
                      class="btnBuy"
                      @click="handleBuy"
                      v-if="
                      !isShowFootShow &&
                      isEnoughApprove &&
                      !onlyDisplayShow &&
                      '0x0000000000000000000000000000000000000000' != ownerProxy
                    "
                  >
                    Buy It Now
                  </button>

                  <button
                      class="btnBuy"
                      @click="handleApprove"
                      v-if="!isShowFootShow && !isEnoughApprove"
                  >
                    Approve
                  </button>
                  <button class="btnBuy" v-if="onlyDisplayShow">
                    Only Display
                  </button>
                </div>
                <div class="starLike" v-if="!isShowFootShow">
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
          <GoodsDesc :desc="detail.productDesc" :date="detail.tokenTime"/>
          <!-- 作者信息 -->
          <AuthorPanel :authorInfo="authorInfo"/>
        </div>

        <div class="otherInfoRt">
          <!-- 交易信息 -->
          <TradeInfo :records="tradeRecords"/>
        </div>
      </div>

      <!-- 相关推荐 -->
      <div class="recomendBox">
        <Recomend ref="sameAuthorList"/>
      </div>
    </div>

    <!-- 立即购买 -->
    <PayBoxContent
        :visible.sync="buyDrawer"
        :clientWidth.sync="clientWidth"
        :userName="userInfo.nickName"
        :detail="detail"
        @bopPay="bopPay"
        ref="PayBoxContent"
    />

    <!-- 重新上架修改价格弹窗 -->
    <ChangePrice
        v-if="changePriceVisible"
        :visible.sync="changePriceVisible"
        :originPrice="detail.price ? detail.price : ''"
        :coin="detail.coinType ? detail.coinType : ''"
        :clientWidth.sync="clientWidth"
        @close="changePriceVisible = false"
        @onlineAgain="onlineAgain"
    />

    <!-- 支付二维码弹窗 -->
    <PayCodeModal :visible.sync="payCodeVisible" ref="payCodeModal"/>

    <!-- 提示信息弹窗 -->
    <TipModal
        :visible.sync="revokeTipVisible"
        title="Tips"
        content="Are you sure you want to take down the collection?"
        cancelTxt="cancel"
        confirmTxt="confirm"
        @close="revokeTipVisible = false"
        @ok="revokeConfirm"
    />
    <MTipModal
        :visible.sync="mTipVisible"
        title="Tips"
        :content="mContent"
        cancelTxt="cancel"
        :confirmTxt="mConfirmTxt"
        @close="mTipVisible = false"
        @ok="mToConfirm"
    />
    <!-- 询价信息弹窗 -->
    <TipModalSingle
        :visible.sync="inquiryTipVisible"
        title="Tips"
        content="We have received your enquiry and will contact you by email ASAP."
        cancelTxt="cancel"
        confirmTxt="confirm"
        @close="inquiryTipVisible = false"
        @ok="inquiryConfirm"
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
import PayBoxContent from "@/components/ProductDetail/PayBoxContent";
import PayCodeModal from "@/components/CollectionDetail/PayCodeModal";
import TipModal from "@/components/TipModal";
import TipModalSingle from "@/components/TipModalSingle";
import MTipModal from "@/components/MTipModal";
import API from "@/service";
import abiSing from "@/contract/abiSing.json";
import QRCode1 from "qrcodejs2";

import contractAPI from "@/wallet_nc/contract/contractAPI";
import {Asset, Order, Ordersign} from "@/wallet_nc/common/erc721/order";
import {encDataV1, ERC1155, ERC721, ERC721_LAZY, ETH, id, ORDER_DATA_V1,} from "@/wallet_nc/common/erc721/assets";
import {coinMap, constractAddress} from "@/const/const";

let ethUtil = require("ethereumjs-util");
const EtheremTx = require("ethereumjs-tx");
let exchangeabiSing = require("@/contract/exchangeabiSing.json");
let Web3 = require("web3");
const ZERO = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";
const ONE = "0x0000000000000000000000000000000000000001";
const TRANSACTION_RECEIPT_STATUS = {
  SUCCESS: 1,
  REVERTED: 0,
};
let dAPI = new contractAPI();
//测试数据
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
    PayBoxContent,
    ChangePrice,
    Bread,
    PayCodeModal,
    TipModalSingle,
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
      orderLeftJson: {},
      activeSelection: "1",
      currentKey: "author",
      isUpType: true,
      buyDrawer: false,
      loading: false,
      loadingText: "Loading, please wait",
      NftTokenAddress: {},
      sameAuthorList: [],
      sameCategoryList: [],
      totalAmount: 0,
      payType: 0,
      order: {},
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
      bankStatus: 0,
      tradeStatus: 0,
      isTradeContinue: false,
      web3: null,
      coinType: "ETH",
      coinName: "ETH",
      coinMap: {},
      coinAddress: ZERO,
      isEnoughApprove: false,
      canRevokeShow: false,
      revokeTipVisible: false,
      owner: "",
      canReOnSaleShow: false,
      isShowFootShow: false,
      onlyDisplayShow: false,
      inquiryTipVisible: false,
      signOwner: "",
      ownerProxy: "0x0000000000000000000000000000000000000000",
      isMint: true,
    };
  },
  computed: {
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
  watch: {
    "$store.state.wallet.walletConnected": {
      handler(newName, oldName) {
        // console.log("newName:", newName);
        // console.log("oldName:", oldName);
        if (newName) {
          // 钱包连接成功后刷新数据
          this.web3 = this.$store.getters["wallet/web3"];
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true,
    },
  },
  beforeMount() {
    //获取藏品详情
    this.initDetail();
  },
  mounted() {
    this.getCurrentUser();
    this.coinMap = coinMap;
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

    //获取合约配置
    API.getContractConfig().then(async (result) => {
      // console.log("contractConfig: " + JSON.stringify(result));
      if (result.code !== 200) {
        this.common.notification(this, result.msg, 3);
        return;
      } else {
        this.NftTokenAddress = result.data;
        this.buyerFee = result.data.buyerFee / 100;
        this.sellerFee = result.data.sellerFee / 100;
        console.log("this.sellerFee：" + this.sellerFee);
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
    toInquiry() {
      this.inquiryTipVisible = true;
    },
    inquiryConfirm() {
      this.inquiryTipVisible = false;
      this.loading = true;
      API.inquiryCollection({
        inquiryCertificationId: this.certificationId,
        productId: this.detail.productId,
        inquiryAccount: window.localStorage.getItem("walletAddress"),
      })
          .then((res) => {
            if (res && res.code === 200) {
              this.common.notification(this, "Enquiry successfully", 1);
            }
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
    },
    isShowFoot() {
      // const caseA = this.productStatus != 0;
      const caseB =
          this.getCurrentUser() &&
          this.owner === window.localStorage.getItem("walletAddress");
      // 不是我铸造的、交易已完成
      this.isShowFootShow = caseB;
    },

    onlyDisplay() {
      const caseA = this.detail.status == 2 || this.detail.status == 3;
      // const caseA = false;
      if (
          this.owner != "" &&
          this.owner === window.localStorage.getItem("walletAddress")
      ) {
        this.onlyDisplayShow = false;
      } else {
        if (this.ownerProxy == ZERO) {
          this.onlyDisplayShow = true;
        } else {
          this.onlyDisplayShow = caseA;
        }
      }
    },

    async initOwner() {
      try {
        let owner;

        try {
          owner = await dAPI.OwnerOf(
              this.web3.eth,
              this.detail.contractAddress,
              this.detail.tokenId
          );
        } catch (e) {
          // console.trace(e);
          console.log(e.message);
          this.isMint = false;
          // owner = this.orderLeftJson.maker.toLowerCase();
          owner = this.detail.tokenId.substr(0, 42).toLowerCase();
        }

        owner = owner.toLowerCase();
        this.owner = owner;
        this.approveJudge(this.detail.contractAddress, this.detail.tokenId);
      } catch (e) {
        console.log(e.message);
        this.owner = "";
        console.log("init Owner error!");
      }
    },
    canRevoke() {
      const caseA = this.productStatus == 0;
      const caseB =
          this.getCurrentUser() &&
          this.owner === window.localStorage.getItem("walletAddress");
      const caseC = this.ownerProxy != ZERO;
      this.canRevokeShow = caseA && caseB;
    },
    canReOnSale() {
      const caseA = this.productStatus != 0;

      console.log("owner", this.owner);
      const caseB =
          this.getCurrentUser() &&
          this.owner === window.localStorage.getItem("walletAddress");
      const caseC = this.ownerProxy == ZERO;

      this.canReOnSaleShow = (caseA && caseB) || (caseB && caseC);
      // return caseA && caseB;
    },
    // 撤回藏品回调
    async revokeApprove_cb(err, hash) {
      console.log("藏品撤回交易哈希：" + hash);
      if (err != null) {
        this.common.notification(this, err.message, 3);
        this.loading = false;
        return;
      }
      let provider = this.$store.state.wallet.provider;
      const result = await provider.waitForTransaction(hash);
      console.log("err:", err);
      console.log("ret:", hash);

      if (result.status === TRANSACTION_RECEIPT_STATUS.REVERTED) {
        throw "Transaction Reverted";
      }
      // 调用后台撤回藏品接口
      API.revokeMallCollection({
        certificationId: this.certificationId,
        productId: this.detail.productId,
        tradeHash: hash,
        collectDirId: this.detail.collectDirId,
        remark: window.localStorage.getItem("currNetwork"),
      })
          .then((res) => {
            if (res && res.code === 200) {
              this.common.notification(this, "Revoke successfully", 1);
              this.$router.push({
                path: "/",
                query: {
                  sort: "time",
                  tab: this.selectTagId,
                },
              });
            } else {
              this.common.notification(this, "Revoke failed", 3);
            }
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
    },
    takeDown() {
      if(this.isMint == false) {
        this.$message.error("Lazy casting collection cannot be removed from the shelf!");
      } else {
        this.revokeTipVisible = true;
      }
    },
    // 撤回藏品
    revokeApprove() {
      this.loading = true;
      this.loadingText =
          "The collection is being withdrawn, please wait a moment";
      const contractAddress = this.detail.contractAddress;

      // 调用cancel
      console.log("this.orderLeftJson:", this.orderLeftJson);
      dAPI.cancel(this.orderLeftJson, this.web3.eth, this.revokeApprove_cb);

    },
    revokeConfirm() {
      this.revokeTipVisible = false;
      this.revokeApprove();
    },

    erc20allowance(err, ret) {
      console.log("erc20allowance err:" + err);
      console.log("erc20allowance ret:" + ret);
      if (err != null) {
        // alert(err);
        this.loading = false;
        return;
      }

      if (ret < this.detail.price) {
        this.isEnoughApprove = false;
      } else {
        this.isEnoughApprove = true;
      }
    },
    handleApprove() {
      this.loading = true;
      let web3client = this.web3.eth;

      dAPI.approveByAddress(
          this.detail.coinType,
          web3client,
          this.approveByAddress_cb
      );
    },

    async approveByAddress_cb(err, hash) {
      console.log("err:" + err);
      console.log("transHash:" + hash);
      let provider = this.$store.state.wallet.provider;
      const result = await provider.waitForTransaction(hash);
      console.log("err:", err);
      console.log("ret:", hash);

      if (result.status === TRANSACTION_RECEIPT_STATUS.REVERTED) {
        throw "Transaction Reverted";
      }

      this.loading = false;
      this.isEnoughApprove = true;
    },
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
    // 重新上架之前的逻辑判断
    checkBeforeOnlineAgain() {
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
    onlineAgain(price, address) {
      console.log("buyaddress:", address);

      console.log("address;", address);
      switch (address) {
        case ZERO:
          this.coinType = "ETH";
          this.coinName = "ETH";
          this.coinAddress = ZERO;
          break;
        default:
          this.coinAddress = address;
          this.coinType = "ERC20";
          var coinArr = constractAddress.coinType;
          for (let i = 0; i < coinArr.length; i++) {
            if (coinArr[i].address == address) {
              this.coinName = coinArr[i].name;
              break;
            }
          }
          break;
      }
      this.coinAddress = address;
      this.changePriceVisible = false;
      this.onlinePrice = price;
      this.addMallCollectionAgain();
      console.log("最新的价格：" + price);
    },

    // 查询用户信息
    getUserInfo() {
      API.getUserInfo({certificationId: this.certificationId}).then(
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
    // 销毁定时任务
    destoryed() {
      var _this = this;
      window.clearInterval(_this.timer);
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
      });
    },
    async bopPay(totalAmount, payType) {
      this.totalAmount = totalAmount;
      this.payType = payType;

      await this.toTwiceBuyFun();
    },
    // 二次上架购买
    async toTwiceBuyFun() {
      // 从订单接口获取
      var NFTINFO_EXCHANGE = JSON.parse(this.detail.orderLeft);
      var start = NFTINFO_EXCHANGE["start"];
      var end = NFTINFO_EXCHANGE["end"];

      var make = Asset(
          NFTINFO_EXCHANGE["makeAsset"]["assetType"]["assetClass"],
          NFTINFO_EXCHANGE["makeAsset"]["assetType"]["data"],
          NFTINFO_EXCHANGE["makeAsset"]["value"]
      );
      var take = Asset(
          NFTINFO_EXCHANGE["takeAsset"]["assetType"]["assetClass"],
          NFTINFO_EXCHANGE["takeAsset"]["assetType"]["data"],
          NFTINFO_EXCHANGE["takeAsset"]["value"]
      );

      var left, signatureLeft, right, web3client;
      left = NFTINFO_EXCHANGE;
      signatureLeft = this.detail.signatureLeft;
      // var strdata = NFTINFO_EXCHANGE['data'];
      var payouts = [];
      // var payouts = [['0x1cf0df2a5a20cd61d68d4489eebbf85b8d39e18a', '10000']];
      var originFees = [];
      // var from = "0x1cf0df2a5a20cd61d68d4489eebbf85b8d39e18a";
      // const from = window.localStorage.getItem("walletAddress");
      web3client = this.web3.eth;
      const from = window.localStorage.getItem("walletAddress");
      // var encDataRight = encDataV2([payouts, originFees, false]);
      var encDataRight = encDataV1([payouts, originFees]);
      console.log("global.account", from);
      right = Order(
          from,
          take,
          ZERO,
          make,
          NFTINFO_EXCHANGE["salt"],
          start,
          end,
          ORDER_DATA_V1,
          encDataRight
      );
      // getSignature(right, exchangeV2Address).then((signatureRight) => {
      console.log(right);
      this.loading = true;
      this.loadingText = "Please wait while the tranctions is processing";

      // try {
      await dAPI.matchOrders(
          left,
          signatureLeft,
          right,
          "0x",
          web3client,
          this.matchOrder_db
      );
      // } catch (switchError) {
      //   this.loading = false;
      //   console.error("Error switching networks", switchError);
      //   return;
      // }
    },
    async matchOrder_db(err, hash) {
      console.log("err:" + err);
      console.log("transHash:" + hash);
      if (err != null) {
        // alert(err);
        this.loading = false;
        return;
      }
      let provider = this.$store.state.wallet.provider;
      const result = await provider.waitForTransaction(hash);
      console.log("err:", err);
      console.log("ret:", hash);

      if (result.status === TRANSACTION_RECEIPT_STATUS.REVERTED) {
        throw "Transaction Reverted";
      }
      API.toPay({
        certificationId: this.certificationId,
        productId: parseInt(this.$route.params.id),
        price: this.totalAmount,
        payType: this.payType,
        serviceRate: this.sellerFee,
        invitorRate: 2,
        contractAddress: this.detail.contractAddress,
        tradeHash: "",
        invitorAddress: this.invitorAddress,
        tokenAddress: this.detail.contractAddress,
        fee: this.fee,
      }).then(async (result) => {
        console.log("云联支付结果：" + JSON.stringify(result));
        if (result.code == 200 && result.qrcode !== null) {
          // this.loading = true;
          // this.loadingText = "Please wait while the tranctions is processing";
          this.orderId = result.orderoId;
          this.loading = false;
          // 支付成功的回调
          this.$router.push({
            path: "/pay-success",
            query: {
              out_trade_no: this.orderId,
              trade_hash: hash,
              coin_type: this.detail.coinType,
            },
          });

          // window.open(result.qrcode,'_blank')
        } else {
          this.common.notification(
              this,
              "Payment error, please try again later！",
              3
          );
          this.$router.push({
            path: "/",
          });
        }
      });
    },

    // 藏品再次上架售卖
    addMallCollectionAgain() {
      this.loading = true;
      this.loadingText = this.isRemindOnlineFee
          ? "On the rack, please wait a moment"
          : "Please wait for a moment";
     let web3client =  this.web3.eth;
      const walletAddress = window.localStorage.getItem("walletAddress");

      if(this.ownerProxy == ZERO) {
        if (this.isMint == false) {
          dAPI.approvalForAllLazy(
              web3client,
              this.setApprovalForAll_cb,
              this.detail.contractAddress,
              true
          );
        } else {
          this.approve(
              this.detail.contractAddress,
              window.localStorage.getItem("walletAddress"),
              this.detail.tokenId
          );
        }
      } else {
        this.toTwiceFixPrice(ZERO_HASH);
      }
    },
    toTwiceFixPrice(hash) {
      var price = this.web3.utils.toWei(this.onlinePrice);
      let tokenId = this.detail.tokenId;
      this.toTwiceFixPriceFun(tokenId, price, hash);
    },
    // 二次上架设置价格
    async toTwiceFixPriceFun(tokenId, price, hash) {
      const from = window.localStorage.getItem("walletAddress");
      var payouts = dAPI.creators([from]); //  多个入款账户!!
      // var originFees = dAPI.creators([from]);
      // var originFees = [['0x1cf0df2a5a20cd61d68d4489eebbf85b8d39e18a', '10000']];
      var originFees = []; // 版税
      var encDataLeft = encDataV1([payouts, originFees]);

      var erc721LazyAddress = this.detail.contractAddress;
      const exchangeV2Address = constractAddress.exchangeV2Address;
      let tradeToken = "";
      if (this.coinType == "ETH") {
        tradeToken = "0x";
      } else {
        tradeToken = this.coinAddress;
      }
      const left = Order(
          from,
          Asset(ERC721, this.enc(erc721LazyAddress, tokenId), 1),
          ZERO,
          Asset(id(this.coinType), this.enc(tradeToken), price),
          this.random(1, 10000),
          0,
          0,
          ORDER_DATA_V1,
          encDataLeft
      );
      try {
        var signature = await this.getSignature(left, exchangeV2Address);
        console.log("signOrderFormsignature" + signature);
      } catch (switchError) {
        this.loading = false;
        console.error("Error switching networks", switchError);
        return;
      }

      this.loading = false;

      // 收藏品重新上架成功, 调用后台处理其他逻辑
      API.addMallCollectionAgain({
        createId: this.certificationId,
        productId: this.$route.params.id,
        collectDirId: this.detail.collectDirId,
        tokenId: this.detail.tokenId,
        price: this.onlinePrice,
        tradeHash: hash,
        fee: this.fee,
        coinType: this.coinAddress,
        signatureLeft: signature,
        orderLeft: JSON.stringify(left),
        remark: window.localStorage.getItem("currNetwork"),
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
    },
    enc(token, tokenId) {
      if (tokenId) {
        return this.web3.eth.abi.encodeParameters(
            ["address", "uint256"],
            [token, tokenId]
        );
      }
      if (token == "0x") {
        return token;
      }
      return this.web3.eth.abi.encodeParameter("address", token);
    },

    async approve(ctsignTokencontractAddress, walletAddress, tokenId) {
      //上架  true
      // alert(ctsignTokencontractAddress);
      let ownerProxy = await dAPI.getApprovedByAddressAndForAddress(
          ctsignTokencontractAddress,
          this.detail.tokenId,
          this.web3.eth
      );
      this.ownerProxy = ownerProxy;
      if (
          ownerProxy &&
          ownerProxy.toLowerCase() == constractAddress.transferProxy.toLowerCase()
      ) {
        this.toTwiceFixPrice(
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        );
      } else {
        dAPI.approveByAddressAndForAddress(
            ctsignTokencontractAddress,
            constractAddress.transferProxy,
            tokenId,
            this.web3.eth,
            this.setApprovalForAll_cb
        );
      }
    },
    async approveJudge(ctsignTokencontractAddress, tokenId) {
      //上架  true
      // alert(ctsignTokencontractAddress);
      let ownerProxy;

      if (this.isMint == false) {
        let isApprove = await dAPI.isApprovedForAllLazy(
            this.web3.eth,
            this.owner,
            ctsignTokencontractAddress
        );
        console.log("isApprove:", isApprove)
        if (isApprove == true) {
          ownerProxy = constractAddress.erc721LazyMinttransProxyAddress;
        } else {
          ownerProxy = ZERO;
        }
      } else {
        ownerProxy = await dAPI.getApprovedByAddressAndForAddress(
            ctsignTokencontractAddress,
            this.detail.tokenId,
            this.web3.eth
        );
      }

      this.ownerProxy = ownerProxy;
      console.log("ownerProxy:", ownerProxy);

      this.loading = false;
      this.canRevoke();
      this.canReOnSale();
      this.onlyDisplay();
      this.isShowFoot();
    },
    async getSignature(order, exchangeV2Address) {
      const signer = window.localStorage.getItem("walletAddress");
      return await Ordersign(this.web3.eth, order, signer, exchangeV2Address);
    },
    setApprovalForAll(ctsignTokencontractAddress, privateKey, walletAddress) {
      //上架  true
      const collection = new this.web3.eth.Contract(abiSing);
      let data = collection.methods
          .setApprovalForAll(this.NftTokenAddress.transferProxy, true)
          .encodeABI();
    },

    async setApprovalForAll_cb(err, hash) {
      if (err != null) {
        this.common.notification(this, err.message, 3);
        this.loading = false;
        return;
      }
      console.log("tradHash：" + hash);
      let provider = this.$store.state.wallet.provider;
      const result = await provider.waitForTransaction(hash);
      console.log("err:", err);
      console.log("hash:", hash);

      if (result.status === TRANSACTION_RECEIPT_STATUS.REVERTED) {
        throw "Transaction Reverted";
      }

      this.toTwiceFixPrice(hash);
    },

    random(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    // 藏品详情
    initDetail() {
      this.loading = true;
      API.getMallCollectionInfo({
        certificationId: this.certificationId,
        productId: this.$route.params.id,
      }).then(async (result) => {
        // console.log("藏品详情：" + JSON.stringify(result));
        if (result.code !== 200) {
          this.common.notification(this, "Data loading failure", 3);
          return;
        }
        if (this.data !== null) {
          this.detail = result.data;
          this.orderLeftJson = JSON.parse(this.detail.orderLeft);
          if (this.web3 != null && this.web3 != undefined) {
            await this.initOwner();
          } else {
            this.loading = false;
            this.canRevoke();
            this.canReOnSale();
            this.onlyDisplay();
            this.isShowFoot();
          }
          // let orderLeft = result.data.orderLeft;
          // if (orderLeft && orderLeft != "") {
          //   let jsonOrderLeft = JSON.parse(orderLeft);
          //   // this.signOwner = jsonOrderLeft.maker;
          // }
          console.log("result.data", result.data);
          if (result.data.coinType != ZERO) {
            // 如果是erc20 查询approve情况
            dAPI.erc20allowance(
                window.localStorage.getItem("walletAddress"),
                result.data.coinType,
                constractAddress.erc20transferProxy,
                this.erc20allowance
            );
          } else {
            this.isEnoughApprove = true;
          }
          this.$refs.PayBoxContent.calPayInfo(
              result.data,
              this.buyerFee,
              this.balance
          );
          this.productStatus = result.data.status;
          this.tradeStatus = result.data.tradeStatus;
          this.invitorAddress = result.data.invitorAddress;
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
      });
    },
    // 查询同类型或者同作者藏品列表
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
  background: #ffffff;

  background-size: 100% 79%;
  @media screen and (max-width: 800px) {
    padding: 0.33rem 0.15rem 0.24rem;
    background: #ffffff;
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
  //background: rgba(255, 255, 255, 0.1)
  //  url("../assets/images/newTheme/detail_bg_in.png") no-repeat center;
  //background-size: cover;
  border: 1px solid #999999;
  padding: 10px;
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
  color: #000000;
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
  color: #000;
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
    color: #707070;
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

.btnInquiry {
  padding: 0.16rem 0.64rem;
  background: #909399;
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
