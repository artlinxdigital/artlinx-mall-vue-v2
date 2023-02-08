<template>
  <div
    class="balanceCard"
    v-loading.fullscreen.lock="loading"
    :element-loading-text="loadingText"
  >
    <div class="header">
      <span class="cardName">Balance</span>
    </div>
    <div class="content">
      <span class="amount"
        ><i class="iconMony">HK$</i>
        <b style="color: #ffc921">{{ balance }}</b></span
      >
      <!-- <div class="btns">
				<el-button type="info" round size="small" plain class="btnwithDraw" @click="linkWithdraw">提现</el-button>
				<el-button type="primary" round size="small" class="btnCharge" @click="toCharge">充值</el-button>
			</div> -->
    </div>
    <MTipModal
      :visible.sync="tipVisible"
      title="ti"
      :content="content"
      cancelTxt="cancel"
      :confirmTxt="confirmTxt"
      @close="tipVisible = false"
      @ok="toConfirm"
    />
    <el-dialog
      title="Add or change bank card"
      :visible.sync="dialogVisible"
      width="560px"
      :before-close="handleClose"
    >
      <!-- <addBankcard /> -->
    </el-dialog>
    <el-dialog
      title="The balance of prepaid phone"
      :visible.sync="chargeDialog"
      width="560px"
      :before-close="handleClose"
    >
      <Charge @payNow="startAliPay" />
    </el-dialog>
    <!-- 支付二维码弹窗 -->
    <PayCodeModal :visible.sync="payCodeVisible" ref="payCodeModal" />
  </div>
</template>

<script>
import MTipModal from "@/components/MTipModal";
import addBankcard from "@/pcviews/AddBankCard";
import Charge from "@/components/pcCharge";
import API from "@/service/index";
import { re } from "mathjs";
import { projectUrl } from "@/service/config";
import PayCodeModal from "@/pcviews/PayCodeModal";
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
    PayCodeModal,
  },
  inject: ["reload"],
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
      payCodeVisible: false,
      payType: 2,
      defineAmount: 50,
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
    // 查询用户提现配置信息
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
    // Alipay支付
    startAliPay(payType, defineAmount) {
      this.chargeDialog = false;
      this.payType = payType;
      this.defineAmount = defineAmount;
      // Alipay充值
      if (this.payType == 2) {
        API.startAliPay({
          address: window.localStorage.getItem("walletAddress"),
          type: 3,
          money: this.defineAmount,
          from: 1,
        }).then((result) => {
          if (result.code !== 200) {
            this.common.notification(this, result.msg, 3);
            return;
          }
          console.log("表单form: " + JSON.stringify(result));
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
        });
      }
      // wechat充值
      if (this.payType == 1) {
        console.log("===>wechat充值");
        this.payCodeVisible = true;
        // this.charge();
        API.startWxPay({
          address: window.localStorage.getItem("walletAddress"),
          subject: "wechat Pay",
          type: 0,
          money: this.defineAmount,
          from: 1,
        }).then((result) => {
          if (result.code !== 200) {
            this.common.notification(this, result.msg, 3);
            return;
          }
          console.log("表单form: " + JSON.stringify(result));
          this.codeUrl = result.data.codeUrl;
          this.orderId = result.data.out_trade_no;
          this.setTimer(2000);
          this.$refs.payCodeModal.payCodeInfo(
            this.payType,
            this.codeUrl,
            this.timer
          );
        });
      }
    },
    // 查询充值详情
    async getChargeByOrderId() {
      API.getChargeByOrderId({ orderId: this.orderId }).then((result) => {
        console.log("Transaction Details :" + JSON.stringify(result));
        if (result.code !== 200) {
          this.common.notification(this, result.msg, 3);
          return;
        }

        if (result.data.status !== 0) {
          var chargeTitle =
            result.data.status === 1
              ? "be recharged successfully"
              : "Top-up failure";
          var type = result.data.status === 1 ? 1 : 3;
          this.destoryed();
          this.payCodeVisible = false;
          if (type == 3) {
            this.common.notification(this, chargeTitle, type);
            return;
          }

          this.loading = true;
          this.loadingText = "刷新中,请稍等";
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
            if (newBalance != this.balance) {
              window.clearInterval(that.time);
              that.loading = false;
              that.reload();
              that.common.notification(this, "be recharged successfully.", 1);
            }
          }, 2000);
        }
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
  background: #ffffff;
  border-radius: 16px;
  position: relative;
  padding: 20px;
  border: 1px solid #000000;
  &:after {
    content: "";
    position: absolute;
    top: -6px;
    bottom: -6px;
    left: -6px;
    right: -6px;
    //background: linear-gradient(28deg, #50516a 0%, #1e2035 30%, #1a1b33 100%);
    border-radius: 18px;
    content: "";
    z-index: -1;
  }
  /deep/ .el-dialog {
    background: #ffffff;
    .el-dialog__header {
      border-bottom: 1px solid #464656;
    }
    .el-dialog__title {
      color: #000000;
    }
  }
}

.cardName {
  color: #000000;
}

.header {
  margin-bottom: 15px;
  .cardName {
    font-size: 14px;
    font-weight: 500;
  }
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .amount {
    font-size: 36px;
  }
}

.btnwithDraw {
  background: #c6c6c6;
  border: none;
  color: #494949;
}

.iconMony {
  margin-right: 5px;
  font-size: 16px;
}
</style>
