<template>
  <div
    class="balanceCard"
    v-loading.fullscreen.lock="loading"
    :element-loading-text="loadingText"
  >
    <div>
      <div class="header">
        <span class="cardName">Balance</span>
      </div>
      <div class="content">
        <span class="amount"
          ><i class="iconMony">HK$</i
          ><b style="color: #ffc921">{{ balance }}</b></span
        >
      </div>
    </div>
    <!-- <div class="btns">
			<el-button type="info" round size="small" plain class="btnwithDraw" @click="linkWithdraw">提现</el-button>
			<el-button type="primary" round size="small" class="btnCharge" @click="toCharge">充值</el-button>
		</div> -->
    <MTipModal
      :visible.sync="tipVisible"
      title="Tips"
      :content="content"
      cancelTxt="cancel"
      :confirmTxt="confirmTxt"
      @close="tipVisible = false"
      @ok="toConfirm"
    />
    <el-dialog
      title="Add or change bank card"
      :visible.sync="dialogVisible"
      width="91%"
      :before-close="handleClose"
    >
      <!-- <addBankcard /> -->
    </el-dialog>
    <el-dialog
      title="The balance of prepaid phone"
      :visible.sync="chargeDialog"
      width="91%"
      :before-close="handleClose"
    >
      <Charge />
    </el-dialog>
  </div>
</template>

<script>
import MTipModal from "@/components/MTipModal";
import addBankcard from "@/views/AddBankCard";
import Charge from "@/components/mCharge";
import API from "@/service/index";
import { re } from "mathjs";
import Web3 from "web3";

var web3;
if (typeof web3 !== "undefined") {
  if (web3.currentProvider.isMateMask) {
    new Web3.providers.HttpProvider(API.getNetWorkUrl());
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(API.getNetWorkUrl()));
  }
} else {
  //https://mainnet.infura.io/mew  http://47.74.44.123:7575   新的 http://47.74.39.49:7575
  web3 = new Web3(new Web3.providers.HttpProvider(API.getNetWorkUrl()));
}

export default {
  components: {
    addBankcard,
    MTipModal,
    Charge,
  },
  data() {
    return {
      tipVisible: false,
      content: "",
      confirmTxt: "",
      bankConfigList: [],
      clientWidth: 750,
      dialogVisible: false,
      chargeDialog: false,
      loading: false,
      loadingText: "Please wait for a moment",
      orderId: "",
      isCallBack: null,
      attemptCount: 10,
      timer: null,
    };
  },
  props: {
    balance: [String, Number],
    userStatus: Number,
  },
  mounted() {this.getCurrentUser();
    this.$nextTick(() => {
      this.clientWidth = document.documentElement.clientWidth;
    });
    // 提现配置信息
    // this.getWithdrawConfig();
    // 银行卡信息
    this.getCertificationBank();
    this.orderId = this.$route.query.out_trade_no;
    this.isCallBack = sessionStorage.getItem(this.orderId + "");
    if (this.orderId) {
      this.setTimer(2000);
    } else {
      this.orderId = sessionStorage.getItem("wxChargeOrderNo");
      this.isCallBack = sessionStorage.getItem(this.orderId + "");
      if (this.orderId && this.orderId != "null") {
        this.setTimer(2000);
      }
    }
  },
  beforeRouteLeave(to, form, next) {
    if (this.orderId) {
      sessionStorage.setItem(this.orderId + "", null);
      sessionStorage.setItem("wxChargeOrderNo", null);
    }
    next();
  },
  methods: {
    handleClose(done) {
      done();
      // this.$confirm('Confirm the shut down？')
      // 	.then(_ => {
      // 		done();
      // 	})
      // 	.catch(_ => {});
    },
    handlePcConfirm() {
      this.$confirm(this.content, "Tips", {
        confirmButtonText: this.confirmTxt,
        cancelButtonText: "cancel",
        type: "warning",
      }).then(() => {
        this.toConfirm();
      });
    },
    linkWithdraw() {
      if (this.userStatus !== 1) {
        this.content =
          "Please complete the KYC process before adding your bank account information to receive the fund.";
        this.confirmTxt = "confirm";
        if (this.clientWidth < 800) {
          this.tipVisible = true;
        } else {
          this.handlePcConfirm();
        }
        return;
      }
      if (this.bankConfigList.length == 0) {
        this.content =
          "Please complete the KYC process before adding your bank account information to receive the fund.";
        this.confirmTxt = "To set up";
        if (this.clientWidth < 800) {
          this.tipVisible = true;
        } else {
          this.handlePcConfirm();
        }
        return;
      }
      this.$router.push({
        path: "/withdraw",
      });
    },

    linktoRealname() {
      this.$router.push({
        path: "/realname",
      });
    },
    //Go to prepaid phone
    toCharge() {
      this.chargeDialog = true;
    },
    // 去确认跳转
    toConfirm() {
      if (this.userStatus !== 1) {
        this.linktoRealname();
        return;
      }
      if (this.bankConfigList.length == 0) {
        this.dialogVisible = true;
      }
    },
    // 查询用户提现配置信息
    getWithdrawConfig() {
      API.getWithdrawConfig({
        certificationId: window.localStorage.getItem("loginId"),
        type: 3,
      }).then((result) => {
        console.log("提现配置信息：" + JSON.stringify(result));
        if (result.code !== 200) {
          this.common.notification(this, "Data loading failure", 3);
          return;
        }
        if (result.data !== null) {
          this.bankConfigList = result.data;
        }
      });
    },
    // 查询用户银行卡信息
    getCertificationBank() {
      API.getCertificationBank({
        certificationId: window.localStorage.getItem("loginId"),
      }).then((result) => {
        console.log("银行卡信息：" + JSON.stringify(result));
        if (result.code !== 200) {
          this.common.notification(this, "Data loading failure", 3);
          return;
        }
        if (result.data !== null) {
          this.bankConfigList = result.data;
        }
      });
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
    // 查询充值详情
    async getChargeByOrderId() {
      API.getChargeByOrderId({ orderId: this.orderId }).then((result) => {
        console.log("Transaction Details :" + JSON.stringify(result));
        if (result.code !== 200) {
          this.common.notification(this, result.msg, 3);
          return;
        }

        if (!this.isCallBack) {
          this.loading = true;
          this.loadingText = "Loading, please wait";
        }

        if (result.data.status !== 0) {
          var chargeTitle =
            result.data.status === 1
              ? "be recharged successfully"
              : "Top-up failure";
          var type = result.data.status === 1 ? 1 : 3;
          this.destoryed();
          if (type == 3) {
            if (!this.isCallBack) {
              this.common.notification(this, chargeTitle, type);
            }
            this.loading = false;
            return;
          }

          // 刷新用户余额信息
          let that = this;
          that.time = window.setInterval(async () => {
            var newBalance = await web3.eth
              .getBalance(window.localStorage.getItem("walletAddress"))
              .then((result) => {
                var newBalanceCurr = web3.utils.fromWei(result, "ether");
                console.log("newBalanceCurr：" + newBalanceCurr);
                return parseFloat(newBalanceCurr).toFixed(2);
              });
            that.attemptCount--;
            if (newBalance != that.balance || that.attemptCount <= 0) {
              window.clearInterval(that.time);
              that.loading = false;
              that.attemptCount = 10;
              sessionStorage.setItem("wxChargeOrderNo", null);
              that.getUserBalance();
              if (!that.isCallBack) {
                that.common.notification(that, chargeTitle, type);
              }
            }
          }, 2000);
        } else {
          this.attemptCount--;
          if (this.attemptCount <= 0) {
            window.clearInterval(this.time);
            this.loading = false;
            this.attemptCount = 10;
            sessionStorage.setItem("wxChargeOrderNo", null);
            this.getUserBalance();
          }
        }
        sessionStorage.setItem(this.orderId + "", 1);
      });
    },
    // 轮询查询
    setTimer(initMilliecond) {
      this.destoryed();

      this.timer = setInterval(() => {
        this.getChargeByOrderId();
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
.balanceCard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  //background: linear-gradient(48deg, #292942 0%, #1a1b33 100%);
  border: 1px solid #000000;
  border-radius: 0.16rem;
  position: relative;
  padding: 0.3rem 0 0.3rem 0.2rem;
  &:after {
    content: "";
    position: absolute;
    top: -0.06rem;
    bottom: -0.06rem;
    left: -0.06rem;
    right: -0.06rem;
    //background: linear-gradient(28deg, #50516a 0%, #1e2035 30%, #1a1b33 100%);
    border-radius: 0.18rem;
    content: "";
    z-index: -1;
  }
  /deep/ .el-dialog {
    background: #ffffff;
    .el-dialog__header {
      border-bottom: 1px solid #464656;
      padding: 0.2rem;
      padding-bottom: 0.2rem;
    }
    .el-dialog__title {
      color: #000000;
      font-size: 0.16rem;
    }
    .el-icon-close {
      font-size: 0.25rem;
    }
    .el-dialog__body {
      padding: 0.3rem 0.16rem;
    }
  }
}

.cardName {
  color: #000000;
}
.header {
  margin-bottom: 0.3rem;
  .cardName {
    font-size: 0.14rem;
    font-weight: 500;
  }
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .amount {
    font-size: 0.24rem;
  }
}

.btnwithDraw {
  background: #c6c6c6;
  border: none;
  color: #494949;
}

.iconMony {
  margin-right: 0.05rem;
  font-size: 0.16rem;
}

/deep/ .el-button.is-round {
  border-radius: 0.2rem;
  padding: 0.1rem 0.2rem;
  font-size: 0.12rem;
  span {
    font-size: 0.12rem;
  }
}
</style>
<style scoped>
.el-message-box {
  width: 91%;
}
</style>
