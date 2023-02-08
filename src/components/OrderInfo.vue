<template>
  <div class="drawerContain">
    <div class="simpleInfo">
      <div class="simpleInfoImg">
        <el-image
          class="fillImg"
          :src="productImage"
          v-if="productImage"
          fit="cover"
        ></el-image>
      </div>
      <div class="simpleInfoRt">
        <h3 class="simpleName">{{ productName }}</h3>
        <span class="simpleType">{{ categoryName }}</span>
        <span class="simplePrice">HK${{ price.toFixed(2) }}</span>
      </div>
    </div>
    <div class="priceDetail">
      <div class="priceItem">
        <span class="label">price</span>
        <span class="price">HK${{ price.toFixed(2) }}</span>
      </div>
      <div class="priceItem" v-if="serviceRate > 0">
        <span class="label">service fee</span>
        <span class="price">HK${{ serviceAmount.toFixed(2) }}</span>
      </div>
      <div class="total">total：HK${{ totalAmount.toFixed(2) }}</div>
    </div>
    <div class="payWay">
      <div class="title">Please select payment method</div>
      <div class="payWayList">
        <div
          class="payWayItem"
          :class="{ activeItem: item.id === selectWayId }"
          v-for="item in payWay"
          :key="item.id"
          @click="selectWayId = item.id"
        >
          <span
            class="wayName"
            :class="[item.id, { active: item.id === selectWayId }]"
            >{{ item.name }}
            {{ item.id === "balance" ? "HK$" + balance : "" }}</span
          >
          <i
            class="el-icon-success icCheck"
            v-show="item.id === selectWayId"
          ></i>
        </div>
      </div>
    </div>
    <p class="serviceTip" v-if="serviceRate > 0">
      *The platform will charge{{ serviceRate }}% service fee
    </p>
    <div class="fixBtn">
      <el-button type="primary" @click="goPay" class="btnGoPay"
        >To pay for</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
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
      selectWayId: "alipay",
      price: 0,
      serviceRate: 2,
      serviceAmount: 0,
      totalAmount: 0,
      productName: "",
      categoryName: "",
      balance: 0,
      payType: 0,
      productImage: "",
    };
  },
  methods: {
    // 弹框支付信息
    calPayInfo(data, buyerFee, balance) {
      // console.log("price: " + data.price + " serviceRate：" + buyerFee + " balance：" + balance);
      this.price = data.price;
      this.serviceRate = buyerFee;
      this.serviceAmount = data.price * (buyerFee / 100);
      this.totalAmount = data.price + this.serviceAmount;
      this.productName = data.productName;
      this.categoryName = data.categoryName;
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
      this.$emit(
        "navBuy",
        privateKey,
        walletAddress,
        this.totalAmount,
        this.payType
      );
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
}
.simpleInfo {
  display: flex;
  margin-bottom: 0.8rem;
}
.simpleInfoImg {
  width: 1.56rem;
  height: 1.56rem;
  margin-right: 0.36rem;
  border-radius: 0.2rem;
  .fillImg {
    border-radius: 0.2rem;
  }
}
.simpleInfoRt {
  display: flex;
  flex-direction: column;
  .simpleName {
    margin-bottom: 0.19rem;
    font-size: 0.28rem;
    color: #333;
  }
  .simpleType {
    margin-bottom: 0.25rem;
    font-size: 0.24rem;
    color: #707070;
  }
  .simplePrice {
    font-size: 0.3rem;
    font-weight: bold;
    color: #2fadc3;
  }
}
.priceItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.2rem;
  .label {
    font-size: 0.24rem;
    color: #333;
    font-weight: 500;
  }
  .price {
    font-size: 0.24rem;
  }
}
.total {
  padding-bottom: 0.27rem;
  font-size: 0.26rem;
  color: #333;
  text-align: right;
  border-bottom: 1px solid #eee;
}
.payWay {
  .title {
    margin-top: 0.39rem;
    margin-bottom: 0.51rem;
  }
}
.payWayItem {
  position: relative;
  padding-bottom: 0.14rem;
  margin-bottom: 0.37rem;
  border-bottom: 1px solid #eee;
  .icCheck {
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
      width: 0.36rem;
      height: 0.36rem;
      margin-right: 0.17rem;
      background: url("../assets/images/icon_zfb@2x.png") no-repeat center;
      background-size: 0.36rem 0.36rem;
    }
  }
  .wepay {
    display: flex;
    align-items: center;
    &::before {
      content: "";
      width: 0.36rem;
      height: 0.36rem;
      margin-right: 0.17rem;
      background: url("../assets/images/icon_wx@2x.png") no-repeat center;
      background-size: 0.36rem 0.36rem;
    }
  }
  .balance {
    display: flex;
    align-items: center;
    &::before {
      content: "";
      width: 0.36rem;
      height: 0.36rem;
      margin-right: 0.17rem;
      background: url("../assets/images/icon_yu@2x.png") no-repeat center;
      background-size: 0.36rem 0.36rem;
    }
  }
}
.fixBtn {
  @media screen and (min-width: 800px) {
    margin-top: 0.87rem;
  }
  @media screen and (max-width: 800px) {
    position: fixed;
    padding: 0.2rem 0.26rem 0.45rem;
    background: #fff;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
  }
  .btnGoPay {
    @media screen and (max-width: 800px) {
      width: 100%;
    }
  }
}
.serviceTip {
  font-size: 0.22rem;
  color: #999;
}
.payWayList {
  @media screen and (min-width: 800px) {
    display: flex;
    .payWayItem {
      flex: 1;
      height: 0.6rem;
      padding: 0.13rem 0.3rem;
      margin-right: 0.35rem;
      border: 1px solid #eee;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      .icCheck {
        right: 0.3rem;
      }
      &.activeItem {
        border-color: #2fbec0;
      }
    }
  }
}
</style>
