<template>
  <el-drawer
    title=""
    :visible="visible"
    direction="btt"
    :before-close="handleCloseBuyDrawer"
    custom-class="radiusDrawerBuy"
    size="100%"
    :show-close="false"
    destroy-on-close
  >
    <PcPageHeader />
    <div class="drawerContain">
      <div class="simpleInfo">
        <div class="simpleInfoImg">
          <el-image
            class="fillImg"
            :src="productImage"
            fit="cover"
          ></el-image>
        </div>
        <div class="simpleInfoRt">
          <h3 class="simpleName">{{productName}}</h3>
          <div class="num-rt">1 a</div>
          <div class="price-info">
            <span class="simpleType">{{categoryName}}</span>
            <span class="simplePrice">HK${{ price.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      <div class="priceDetail">
        <div class="priceItem">
          <span class="label">price</span>
          <span class="price">HK${{ price.toFixed(2) }}</span>
        </div>
        <div class="priceItem" v-if="serviceRate > 0">
          <span class="label">service fee</span>
          <span class="price">HK${{serviceAmount.toFixed(2)}}</span>
        </div>
        <div class="total">total：HK${{totalAmount.toFixed(2)}}</div>
      </div>
      <div class="payWay">
        <div class="title">Please select payment method</div>
        <div
          class="payWayItem"
          :class="{activePay: item.id === selectWayId}"
          v-for="item in payWay"
          :key="item.id"
          @click="selectWayId = item.id"
        >
          <span
            class="wayName"
            :class="[item.id, { active: item.id === selectWayId }]"
            >{{ item.name }} {{ item.id === "balance" ? "HK$" + balance : "" }}</span
          >
          <i
            class="el-icon-success icCheck"
            v-show="item.id === selectWayId"
          ></i>
        </div>
      </div>
      <p class="serviceTip" v-if="serviceRate > 0">*The platform will charge{{serviceRate}}% Service fee</p>
      <div class="fixBtn">
        <el-button @click="$emit('update:visible', false)" style="margin-right: 0.3rem;">Go back for details</el-button>
        <el-button type="primary" @click="goPay" class="btnGoPay">立即支付</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import PcPageHeader from "@/components/PcPageHeader";

export default {
  components: {
    PcPageHeader
  },
  props: {
    visible: Boolean,
    clientWidth: Number
  },
  data() {
    return {
      payWay: [
        {
          id: "alipay",
          name: "Alipay",
        },
        {
          id: "wepay",
          name: "WeChat Pay",
        },
        {
          id: "balance",
          name: "balance paid",
        },
      ],
      selectWayId: "balance",
      price: 0,
      serviceRate: 2,
      serviceAmount: 0,
      totalAmount: 0,
      productName: '',
      categoryName: '',
      balance: 0,
      payType: 0,
      productImage: '',
    };
  },
  methods: {
    // 弹框支付信息
    calPayInfo(data, buyerFee, balance) {
      console.log("price: " + data.price + " serviceRate：" + buyerFee + " balance：" + balance);
      this.price = data.price;
      this.serviceRate = buyerFee;
      this.serviceAmount = data.price * (buyerFee / 100);
      this.totalAmount = data.price + this.serviceAmount;
      this.productName = data.productName;
      this.categoryName = data.productCategoryName;
      this.balance = balance;
      this.productImage = data.coverImage;
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
      let privateKey = this.getPrivateKey();
      let walletAddress = window.localStorage.getItem("walletAddress");
      this.$emit("navBuy", privateKey, walletAddress, this.totalAmount, this.payType);
    },
    handleCloseBuyDrawer() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="less" scoped>
.drawerContain {
  padding: 0 0.22rem 1.6rem;
  @media screen and (min-width: 800px) {
    width: 70%;
    max-width: 1186px;
    margin: 0.87rem auto 0;
    padding: 0.66rem 1.56rem;
    background: #fff;
  }
}
.simpleInfo {
  display: flex;
  margin-bottom: 0.8rem;
}
.simpleInfoImg {
  width: 1.15rem;
  height: 1.15rem;
  margin-right: 0.27rem;
  border-radius: 0.04rem;
  .fillImg {
    border-radius: 0.04rem;
  }
}
.price-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .simpleType {
    padding: 0.09rem 0.1rem;
    line-height: 1;
    border: 1px solid #D2D2D2;
    border-radius: 0.02rem;
    font-size: 0.14rem;
    color: #707070;
  }
  .simplePrice {
    font-size: 0.18rem;
    font-weight: 500;
    color: #333;
  }
}
.simpleInfoRt {
  display: flex;
  flex-direction: column;
  flex: 1;
  .simpleName {
    margin-bottom: 0.03rem;
    font-weight: 500;
    font-size: 0.2rem;
    color: #333;
  }
}
.priceItem {
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
  justify-content: flex-end;
  .label {
    margin-right: 0.05rem;
    font-size: 0.16rem;
    color: #333;
    font-weight: 500;
  }
  .price {
    font-size: 0.16rem;
    min-width: 1.3rem;
    text-align: right;
  }
}
.total {
  padding-bottom: 0.27rem;
  margin-bottom: 0.33rem;
  font-size: 0.16rem;
  font-weight: bold;
  color: #333;
  text-align: right;
  border-bottom: 1px solid #eee;
}
.payWay {
  display: flex;
  align-items: flex-start;
  .title {
    margin-top: 0.39rem;
    margin: 0 0.6rem 0 0;
    font-size: 0.16rem;
    color: #666;
  }
}
.payWayItem {
  position: relative;
  padding-bottom: 0.14rem;
  margin-bottom: 0.37rem;
  border-bottom: 1px solid #eee;
  @media screen and (min-width: 800px) {
    padding: 0.19rem 0.3rem 0.13rem;
    margin-bottom: 0;
    margin-right: 0.35rem;
    border: 1px solid #eee;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
    &.activePay {
      border-color: #2FBEC0;
      // color: #2FBEC0;
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
      width: 0.28rem;
      height: 0.28rem;
      margin-right: 0.14rem;
      background: url("../assets/images/icon_zfb@2x.png") no-repeat center;
      background-size: 0.28rem 0.28rem;
    }
  }
  .wepay {
    display: flex;
    align-items: center;
    &::before {
      content: "";
      width: 0.28rem;
      height: 0.28rem;
      margin-right: 0.14rem;
      background: url("../assets/images/icon_wx@2x.png") no-repeat center;
      background-size: 0.28rem 0.28rem;
    }
  }
  .balance {
    display: flex;
    align-items: center;
    &::before {
      content: "";
      width: 0.28rem;
      height: 0.28rem;
      margin-right: 0.14rem;
      background: url("../assets/images/icon_yu@2x.png") no-repeat center;
      background-size: 0.28rem 0.28rem;
    }
  }
}
.fixBtn {
  position: fixed;
  padding: 0.2rem 0.26rem 0.45rem;
  background: #fff;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  @media screen and (min-width: 800px) {
    padding-top: 0.87rem;
    position: relative;
    text-align: center;
  }
  .btnGoPay {
    width: 100%;
    margin-left: 0;
    @media screen and (min-width: 800px) {
      width: auto;
    }
  }
}
.serviceTip {
  font-size: 0.22rem;
  color: #999;
  @media screen and (min-width: 800px) {
    margin-top: 0.23rem;
    margin-left: 1.76rem;
    font-size: 0.16rem;
    color: #999;
  }
}
.num-rt {
  margin-bottom: 0.14rem;
  text-align: right;
  font-size: 0.16rem;
  color: #333;
}
</style>
