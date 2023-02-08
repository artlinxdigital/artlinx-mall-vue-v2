<template>
  <div
    class="paySuccess"
    v-loading.fullscreen.lock="loading"
    :element-loading-text="loadingText"
  >
    <PcPageHeader />
    <div class="tipContainer">
      <i :class="iconClass"></i>
      <span class="subTxt">{{ payRemindMsg }}</span>
      <span class="mony">{{ coin_type }}: {{ totalAmount }}</span>
      <div class="btnRow">
        <el-button
          type="primary"
          class="btnCompelete"
          @click="$router.push('/')"
          :loading="payLoading"
          >{{ payLoadingInfo }}</el-button
        >
        <el-button class="btnHome" @click="backToOrder" v-if="!payLoading"
          >View transaction</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import PcPageHeader from "@/components/PcPageHeader";
import API from "@/service";
import { constractAddress, config, coinMap } from "@/const/const";
export default {
  components: {
    PcPageHeader,
  },
  data() {
    return {
      totalAmount: 0,
      loading: false,
      loadingText: "Loading, please wait",
      orderId: "",
      trade_hash: "",
      payRemindMsg: "querying,please wait......",
      payLoading: true,
      payLoadingInfo: "querying...",
      iconClass: "iconSuccess",
      payStatus: "paying",
      countNum: 0,
      coin_type: "",
      coinMap: {},
    };
  },
  mounted() {
    this.getCurrentUser();
    this.orderId = this.$route.query.out_trade_no;

    this.coin_type = coinMap[this.$route.query.coin_type];
    this.trade_hash = this.$route.query.trade_hash;
    console.log("订单编号：" + this.orderId);
    if (
      this.orderId != null &&
      this.orderId != "" &&
      this.orderId != undefined
    ) {
      this.iconClass = "iconWaitTime";
      this.countNum = 5;
      this.setTimer(2000);
    } else {
      // this.backToOrder();
    }
  },
  methods: {
    // 返回订单列表
    backToOrder() {
      window.open("https://polygonscan.com/tx/" + this.trade_hash);
      return;
    },
    // 查询订单支付状态
    async getTradePayStatus() {
      API.getTradePayStatus({
        tradeId: this.orderId,
        tradeHash: this.trade_hash,
      }).then((result) => {
        console.log("Transaction Details :" + JSON.stringify(result));
        if (result.code !== 200 || result.data == null) {
          this.common.notification(this, result.msg, 3);
          return;
        }
        this.loading = true;
        this.loadingText = "Loading, please wait";

        this.totalAmount = result.data.payAmount.toFixed(2);
        this.payStatus = result.data.payStatus;

        if (this.payStatus == "payed") {
          this.destoryed();
          this.loading = false;
          this.iconClass = "iconSuccess";
          this.payRemindMsg = "Transaction success";
          this.payLoading = false;
          this.payLoadingInfo = "Transaction complete";
          return;
        }
        if (this.payStatus == "cancelPay") {
          this.destoryed();
          this.loading = false;
          this.payRemindMsg = "Transaction cancelled ";
          this.payLoading = false;
          this.payLoadingInfo = "Back to Home";
          return;
        }
        if (this.payStatus == "paying") {
          if (this.countNum == 0) {
            this.destoryed();
            this.loading = false;
            this.$router.push({
              path: "/order",
            });
            return;
          } else {
            this.countNum--;
          }
          return;
        }
      });
    },
    // 轮询查询
    setTimer(initMilliecond) {
      this.destoryed();

      this.timer = setInterval(() => {
        this.getTradePayStatus();
      }, initMilliecond);
    },
    // 销毁定时任务
    destoryed() {
      var _this = this;
      window.clearInterval(_this.timer);
    },
  },
};
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
  background: url("../assets/images/ok@2x.png") no-repeat center;
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
  background: url("../assets/images/wait_time@2x.png") no-repeat center;
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
