<template>
  <el-drawer
    title=""
    :visible="visible"
    direction="btt"
    :before-close="handleCloseBuyDrawer"
    custom-class="emptyDrawer"
    size="100%"
    :show-close="false"
    destroy-on-close
  >
    <PcPageHeader @search="searchList" />
    <div class="drawerContain">
      <Bread :productCategoryName="categoryName" :productName="productName" />
      <div class="orderInfo">
        <div class="topCard">
          <div class="simpleInfo">
            <div class="simpleInfoImg">
              <el-image
                class="fillImg"
                v-if="productImage"
                :src="'https://imagedelivery.net/SynVCJ8TRAd-vPjFeKYdCQ/' +  productImage + '/public'"
                fit="cover"
              >
                <div slot="error" style="height: 100%">
                  <el-image
                    class="fillImg"
                    :src="errImg"
                    fit="cover"
                  ></el-image>
                </div>
              </el-image>
            </div>
            <div class="simpleInfoRt">
              <h3 class="simpleName">{{ productName }}</h3>
              <!-- <div class="num-rt">1 a</div> -->
              <div class="price-info">
                <span class="simpleType">type：{{ categoryName }}&nbsp;</span>
                <span class="simpleNum">x1 &nbsp;</span>
                <span class="simplePrice"
                  >{{ coinMap[detail.coinType] }}:{{
                    price.toFixed(2)
                  }}&nbsp;</span
                >
              </div>
              <span class="author"
                >by&nbsp;{{ productCreatorNickName }}&nbsp;offered</span
              >
            </div>
          </div>
          <div class="priceDetail">
            <div class="priceItem servicePriceItem" v-if="serviceRate > 0">
              <span class="label">service fee： </span>
              <span class="price">
                <i class="icMony">{{ coinMap[detail.coinType] }}: </i>
                <span class="amountService">{{
                  serviceAmount.toFixed(2)
                }}</span>
              </span>
            </div>

            <div class="total">
              <div class="buyer">
                <span class="labelTxtRht">To purchase</span>
                <div class="buyerInfo">
                  <div class="buyerImg">
                    {{ userName && userName.split("")[0] }}
                  </div>
                  <span class="buyerName">{{ userName }}</span>
                </div>
              </div>
              <div class="mPriceItem">
                <span class="label">price </span>
                <span class="price">
                  <i class="icMony">{{ coinMap[detail.coinType] }}: </i>
                  <span class="amountService">{{ price.toFixed(2) }}</span>
                </span>
              </div>
              <div class="mPriceItem" v-if="serviceRate > 0">
                <span class="label">service fee </span>
                <span class="price">
                  <i class="icMony">{{ coinMap[detail.coinType] }}: </i>
                  <span class="amountService">{{
                    serviceAmount.toFixed(2)
                  }}</span>
                </span>
              </div>
              <div class="totalAmount">
                <span class="totalLabel">total：</span>
                <span class="icMony">{{ coinMap[detail.coinType] }}: </span>
                <span class="amountTotal">{{ totalAmount.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="payWay">
          <div class="title">Payment</div>
          <div
            class="payWayItem"
            :class="{ activePay: item.id === selectWayId }"
            v-for="item in payWay"
            :key="item.id"
            @click="selectWayId = item.id"
          >
            <span
              class="wayName"
              :class="[item.id, { active: item.id === selectWayId }]"
              >{{ item.name }}
            </span>
            <i
              class="el-icon-success icCheck"
              v-show="item.id === selectWayId"
            ></i>
          </div>
        </div> -->
        <p class="serviceTip">Wallet Balance:{{ walletBalance }}</p>
        <p class="serviceTip" v-if="serviceRate > 0">
          *The platform will charge {{ serviceRate }}% service fee
        </p>
      </div>

      <div class="fixBtn">
        <el-button @click="backToDetail" class="btnBack">Go back</el-button>
        <el-button type="primary" @click="goPay" class="btnGoPay"
          >Pay now</el-button
        >
      </div>
    </div>
  </el-drawer>
</template>

<script>
import PcPageHeader from "@/components/PcPageHeader";
import Bread from "@/components/CollectionDetail/Bread";
import { coinMap, coinDec } from "@/const/const";
const ZERO = "0x0000000000000000000000000000000000000000";
import contractAPI from "@/wallet_nc/contract/contractAPI";
import { ethers } from "ethers";
let dAPI = new contractAPI();
export default {
  components: {
    PcPageHeader,
    Bread,
  },
  props: {
    visible: Boolean,
    clientWidth: Number,
    userName: String,
    detail: Object,
  },
  filters: {
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
  data() {
    return {
      payWay: [
        // {
        //   id: "alipay",
        //   name: "Alipay",
        // },
        // {
        //   id: "wepay",
        //   name: "WeChat Pay",
        // },
        {
          id: "balance",
          name: "Wallet pay",
        },
      ],
      selectWayId: "balance",
      price: 0,
      serviceRate: 2,
      serviceAmount: 0,
      totalAmount: 0,
      productName: "",
      categoryName: "",
      balance: 0,
      payType: 0,
      productImage: "",
      produtAuthor: "",
      productCreatorNickName: "",
      errImg: require("@/assets/images/load_err.jpg"),
      coinMap: {},
      walletBalance: 0,
    };
  },

  watch: {
    "detail.coinType": {
      handler(newName, oldName) {
        console.log("coinType:", newName);
        console.log("coinType:", oldName);
        // Connected 登录
        if (newName != undefined) {
          // 可以直接到首页
          //查询钱包余额
          this.queryBalance(this.detail.coinType);
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true,
    },
  },
  mounted() {
    this.getCurrentUser();
    this.coinMap = coinMap;
  },
  methods: {
    async queryBalance(coinType) {
      let web3 = this.$store.getters["wallet/web3"];
      let provider = this.$store.state.wallet.provider;
      if (provider == null) {
        return;
      }
      let walletAddress = window.localStorage.getItem("walletAddress");
      switch (coinType) {
        case ZERO:
          const ethBalance = await provider
            .getBalance(walletAddress)
            .then((balance) => {
              return ethers.utils.formatEther(balance);
            })
            .catch((err) => {
              console.error(err);
              return null;
            });
          console.log("ethBalance:", ethBalance);
          this.walletBalance = ethBalance;
          break;

        default:
          console.log("coinType:", coinType);
          let ethBalance1 = await dAPI.BalanceOf(
            web3.eth,
            coinType,
            walletAddress
          );
          console.log("ethBalance1:", ethBalance1);
          ethBalance1 = ethers.utils.formatUnits(
            ethBalance1,
            coinDec[coinType]
          );
          this.walletBalance = ethBalance1;
      }
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
    // 弹框支付信息
    calPayInfo(data, buyerFee, balance) {
      console.log(
        "price: " +
          data.price +
          " serviceRate：" +
          buyerFee +
          " balance：" +
          balance
      );
      this.price = data.price;
      this.serviceRate = data.serviceRate;
      this.serviceAmount = data.price * (data.serviceRate / 100);
      this.totalAmount = data.price;
      this.productName = data.productName;
      this.categoryName = data.productCategoryName;
      this.balance = balance;
      const imgMap = {
        // 3: require("@/assets/images/newTheme/shipin@2x.jpg"),
        3: data.coverImage,
        2: require("@/assets/images/newTheme/yinpin@2x.jpg"),
        1: data.coverImage,
      };
      this.productImage = imgMap[data.productType];
      this.produtAuthor = data.productAuthor;
      this.productCreatorNickName = data.productCreatorNickName;
    },
    goPay() {
      if (this.selectWayId === "wepay") {
        this.payType = 1;
      }
      if (this.selectWayId === "alipay") {
        this.payType = 2;
      }
      if (this.selectWayId === "balance") {
        this.payType = 3;
      }
      this.$emit("bopPay", this.totalAmount, this.payType);
    },
    handleCloseBuyDrawer() {
      this.$emit("update:visible", false);
    },
    // Go back for details
    backToDetail() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="less" scoped>
@import url("../../assets/less/varible.less");

.drawerContain {
  padding: 0 0.22rem 1.6rem;
  @media screen and (min-width: 800px) {
    max-width: @maxWidthWrap;
    margin: 0.1rem auto 0;
    padding: 0 0.16rem;
  }
}
.orderInfo {
  margin-top: 0.24rem;
  padding: 0.28rem 0.32rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 0.16rem;
  backdrop-filter: blur(0.18rem);
  @media screen and (max-width: 800px) {
    padding: 0;
    background: none;
  }
}

.simpleInfo {
  display: flex;
  margin-bottom: 0.8rem;
  @media screen and (max-width: 800px) {
    margin-bottom: 0;
  }
}
.simpleInfoImg {
  width: 1.32rem;
  height: 1.32rem;
  margin-right: 0.32rem;
  border-radius: 0.16rem;
  @media screen and (max-width: 800px) {
    margin-right: 0.16rem;
  }
  .fillImg {
    border-radius: 0.16rem;
  }
}
.priceDetail {
  margin-top: 0.65rem;
  @media screen and (max-width: 800px) {
    margin-top: 0.38rem;
    .total {
      display: flex;
      flex-direction: column;
      align-items: baseline;
    }
  }
}
.price-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #000000;
  @media screen and (max-width: 800px) {
    flex-direction: column;
    align-items: baseline;
    .simplePrice {
      display: none;
    }
  }
  .simpleType {
    line-height: 1;
    font-size: 0.14rem;
    @media screen and (max-width: 800px) {
      margin-bottom: 0.23rem;
    }
  }
  .simplePrice {
    font-size: 0.14rem;
    font-weight: 500;
  }
  .simpleNum {
    @media screen and (max-width: 800px) {
      margin-bottom: 0.17rem;
      font-size: 0.14rem;
    }
  }
}
.simpleInfoRt {
  display: flex;
  flex-direction: column;
  flex: 1;
  .simpleName {
    margin-bottom: 0.17rem;
    font-weight: 500;
    font-family: "NotoSansCJK", "SourceHanSansCN-Medium", "SourceHanSansCN";
    font-size: 0.18rem;
    color: #000000;
  }
  .author {
    margin-top: 0.24rem;
    font-size: 0.14rem;
    color: #7f7f7f;
    @media screen and (max-width: 800px) {
      margin-top: 0;
    }
  }
}
.priceItem {
  display: flex;
  align-items: center;
  margin-bottom: 0.2rem;
  justify-content: flex-end;
  .label {
    font-size: 0.14rem;
    color: #000000;
    font-weight: 500;
  }
  .price {
    font-size: 0.24rem;
    text-align: right;
    color: #ffc921;
  }
  .icMony {
    font-size: 0.16rem;
  }
  .amountService {
    font-size: 0.24rem;
  }
}
.servicePriceItem {
  @media screen and (max-width: 800px) {
    display: none;
  }
}
.mPriceItem {
  display: none;
  @media screen and (max-width: 800px) {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.47rem;
    .label {
      font-size: 0.14rem;
    }
    .price {
      i,
      span {
        font-size: 0.14rem;
      }
    }
  }
}
.total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.43rem;
  font-size: 0.14rem;
  font-weight: bold;
  color: #000000;
  text-align: right;
}
.buyer {
  display: flex;
  align-items: center;
  @media screen and (max-width: 800px) {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 0.39rem;
  }
  .labelTxtRht {
    width: 0.8rem;
    margin-right: 0.32rem;
    text-align: right;
    font-size: 0.14rem;
    @media screen and (max-width: 800px) {
      text-align: left;
    }
  }
}
.buyerInfo {
  display: flex;
  align-items: center;
  .buyerImg {
    width: 0.32rem;
    height: 0.32rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.12rem;
    border-radius: 100%;
    font-size: 0.14rem;
    background-color: rgba(255, 255, 255, 0.06);
    .fillImg {
      width: 100%;
      height: 100%;
    }
  }
  .buyerName {
    font-size: 0.14rem;
  }
}
.totalAmount {
  @media screen and (max-width: 800px) {
    width: 100%;
    text-align: right;
  }
  .totalLabel {
    font-size: 0.14rem;
    color: #000000;
  }
  .icMony {
    font-size: 0.16rem;
    color: #ffc921;
  }
  .amountTotal {
    font-size: 0.24rem;
    color: #ffc921;
  }
}
.payWay {
  display: flex;
  align-items: center;
  @media screen and(max-width: 800px) {
    flex-direction: column;
    align-items: baseline;
  }
  .title {
    margin-right: 0.32rem;
    font-size: 0.14rem;
    color: #000000;
    @media screen and(max-width: 800px) {
      font-size: 0.2rem;
      margin-bottom: 0.2rem;
    }
  }
}
.payWayItem {
  position: relative;
  margin-right: 0.32rem;
  border-radius: 0.1rem;
  font-size: 0.16rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: #000000;
  // filter: blur(0.18rem) brightness(100%);
  // backdrop-filter: blur(0.18rem);
  &.activePay {
    border: 1px solid #707070;
  }
  @media screen and(max-width: 800px) {
    width: 100%;
    height: 0.64rem;
    display: flex;
    align-items: center;
    margin-bottom: 0.2rem;
    padding: 0 0.24rem;
  }
  @media screen and (min-width: 800px) {
    padding: 0.12rem;
    margin-right: 0.35rem;
    border: 1px solid rgba(255, 255, 255, 0.06);
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
  }
  .wayName {
    font-size: 0.16rem;
  }
  .icCheck {
    display: none;
    position: absolute;
    font-size: 0.26rem;
    color: #000000;
    right: 0;
    bottom: 0.14rem;
  }
  .alipay {
    display: flex;
    align-items: center;
    &::before {
      content: "";
      width: 0.26rem;
      height: 0.26rem;
      margin-right: 0.12rem;
      background: url("../../assets/images/newTheme/icon_zfb@2x.png") no-repeat
        center;
      background-size: 0.26rem 0.26rem;
    }
  }
  .wepay {
    display: flex;
    align-items: center;
    &::before {
      content: "";
      width: 0.24rem;
      height: 0.24rem;
      margin-right: 0.12rem;
      background: url("../../assets/images/newTheme/icon_wx@2x.png") no-repeat
        center;
      background-size: 0.24rem 0.24rem;
    }
  }
  .balance {
    display: flex;
    align-items: center;
    &::before {
      content: "";
      width: 0.24rem;
      height: 0.24rem;
      margin-right: 0.12rem;
      background: url("../../assets/images/newTheme/icon_yu@2x.png") no-repeat
        center;
      background-size: 0.24rem 0.24rem;
    }
  }
}
.mBtn {
  width: 46%;
  height: 0.4rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fixBtn {
  position: fixed;
  padding: 0.44rem 0.26rem 0.45rem;
  bottom: 0;
  left: 0;
  right: 0;
  position: relative;
  text-align: center;
  z-index: 3;
  @media screen and (max-width: 800px) {
    display: flex;
    justify-content: space-between;
    padding: 0.17rem 0;
  }
  .btnGoPay {
    width: 1.6rem;
    margin-left: 0;
    &:hover {
      background-color: #000000;
    }
    @media screen and (max-width: 800px) {
      .mBtn();
      /deep/ span {
        font-size: 0.16rem;
      }
    }
  }
  .btnBack {
    width: 1.6rem;
    margin-right: 0.16rem;
    background: #ffffff;
    border: 1px solid #000000;
    color: #000000;

    @media screen and (max-width: 800px) {
      .mBtn();
      /deep/ span {
        font-size: 0.16rem;
        color: #494949;
      }
    }
  }
}
.serviceTip {
  font-size: 0.22rem;
  color: #000000;
  @media screen and (min-width: 800px) {
    margin-top: 0.23rem;
    font-size: 0.16rem;
    color: #000000;
  }
}
.num-rt {
  margin-bottom: 0.14rem;
  text-align: right;
  font-size: 0.16rem;
  color: #333;
}
.topCard {
  @media screen and (max-width: 800px) {
    padding: 0.24rem 0.17rem;
    margin-bottom: 0.37rem;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    backdrop-filter: blur(0.18rem);
  }
}
</style>

<style lang="less">
.emptyDrawer {
  background: #ffffff;
  .el-drawer__header {
    display: none;
  }
}
</style>
