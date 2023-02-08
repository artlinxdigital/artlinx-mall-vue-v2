<template>
  <div
    class="withdrawContain"
    v-loading.fullscreen.lock="loading"
    :element-loading-text="loadingText"
  >
    <PersonalCenterLayout activeKey="2-1">
      <div class="withdrawContent">
        <h3 class="pageTitle">The balance of withdrawal</h3>
        <el-form class="withdrawForm" label-position="top">
          <el-form-item label="Withdrawal Amount (YUAN)">
            <el-input v-model="balance" readonly>
              <i slot="prefix" class="el-input__icon">HK$</i>
            </el-input>
          </el-form-item>
          <el-form-item label="cash withdrawal amount">
            <el-input
              v-model.trim="amount"
              onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
              onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
            >
              <i slot="prefix" class="el-input__icon">HK$</i>
              <el-button slot="suffix" type="text" @click="allWithdraw"
                >All withdrawal</el-button
              >
            </el-input>
          </el-form-item>
          <el-form-item label="Withdrawal to">
            <el-select
              v-model="bankConfig.withdrawConfigId"
              placeholder="please"
              style="width: 100%"
            >
              <el-option
                v-for="item in bankConfigList"
                :key="item.value"
                :label="`${item.accountBank}`"
                :value="item.withdrawConfigId"
              >
                <div class="optionBox">
                  <span class="bankIcon" :class="item.bankStyle"></span>
                  <span
                    >{{ item.accountBank }}({{
                      item.bankCard | ellipsisBankCard
                    }})</span
                  >
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="blockBtn">
          <el-button type="primary" round class="flexBtn" @click="isToTransfer"
            >withdraw</el-button
          >
          <el-button
            @click="$router.go(-1)"
            type="info"
            round
            style="margin-right: 0.3rem"
            >go back</el-button
          >
        </div>
      </div>
    </PersonalCenterLayout>
    <MTipModal
      :visible.sync="tipVisible"
      title="Tips"
      :content="content"
      cancelTxt="cancel"
      :confirmTxt="confirmTxt"
      @close="tipVisible = false"
      @ok="toConfirm"
    />
  </div>
</template>

<script>
import PersonalCenterLayout from "@/components/PersonalCenterLayout";
import Web3 from "web3";
import API from "@/service/index";
import MTipModal from "@/pcviews/MTipModal";

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

var Tx = require("ethereumjs-tx");

export default {
  components: {
    PersonalCenterLayout,
    MTipModal,
  },
  inject: ["reload"],
  data() {
    return {
      amount: "",
      bankCardDrawer: false,
      balance: 0,
      userStatus: 1,
      bankConfig: {},
      bankConfigList: [],
      timer: null,
      loading: false,
      loadingText:
        "Please wait for a moment while the withdrawal request is being submitted",
      tipVisible: false,
      content: "",
      confirmTxt: "",
    };
  },
  mounted() {this.getCurrentUser();
    // 查询地址余额
    this.getUserBalance();
    // 查询用户信息
    this.getUserInfo();
    // 查询提现配置信息
    this.getWithdrawConfig();
  },
  methods: {
    // 选中提现账号
    selectCard(withdrawConfigId) {
      this.bankCardDrawer = false;
      console.log("withdrawConfigId：" + withdrawConfigId);
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
      this.$API
        .getUserInfo({
          certificationId: window.localStorage.getItem("loginId"),
        })
        .then((result) => {
          if (result.code !== 200) {
            this.common.notification(this, "Data loading failure", 3);
            return;
          }
          // console.log("用户信息：" + JSON.stringify(result));
          // this.balance = result.data.balance;
          this.userStatus = result.data.status;
        });
    },
    // 查询用户提现配置信息
    getWithdrawConfig() {
      this.$API
        .getWithdrawConfig({
          certificationId: window.localStorage.getItem("loginId"),
          type: 3,
        })
        .then((result) => {
          console.log("提现配置信息：" + JSON.stringify(result));
          if (result.code !== 200) {
            this.common.notification(this, "Data loading failure", 3);
            return;
          }
          if (result.data !== null) {
            this.bankConfigList = result.data;
            if (this.bankConfigList.length == 0) {
              this.common.notification(this, "Please set withdrawal method", 2);
              return;
            }
            this.bankConfig = this.bankConfigList[0];
          }
        });
    },
    // 全部提现
    allWithdraw() {
      this.amount = this.balance;
    },
    // 申请提现
    applyWithdraw() {
      if (!this.amount) {
        this.common.notification(this, "Please enter the withdrawal amount", 3);
        return;
      }
      if (this.amount > Number(this.balance)) {
        this.common.notification(
          this,
          "The withdrawal amount cannot exceed the maximum available balance",
          3
        );
        return;
      }
      this.$API
        .addWithdraw({
          certificationId: window.localStorage.getItem("loginId"),
          walletAddress: window.localStorage.getItem("walletAddress"),
          withdrawAmount: parseInt(this.amount),
          withdrawType: 3,
          withdrawConfigId: this.bankConfig.withdrawConfigId,
        })
        .then((result) => {
          if (result.code !== 200) {
            this.common.notification(this, "Failed to apply for withdrawal", 3);
            return;
          }
          this.getUserInfo();
          this.common.notification(
            this,
            "The withdrawal request has been submitted",
            1
          );
        });
    },
    // 是否转账
    isToTransfer() {
      var that = this;
      if (!that.amount) {
        that.common.notification(that, "Please enter the withdrawal amount", 3);
        return;
      }
      if (parseFloat(that.amount) > parseFloat(that.balance)) {
        that.common.notification(
          that,
          "The withdrawal amount cannot exceed the maximum available balance",
          3
        );
        return;
      }
      that.tipVisible = true;
      that.content =
        "It takes about two hours to withdraw money a chain service fee 0.06RMB About, whether to continue?";
      that.confirmTxt = "go on";
    },
    // 转账
    transfer() {
      var that = this;
      if (!that.amount) {
        that.common.notification(that, "Please enter the withdrawal amount", 3);
        return;
      }
      if (parseFloat(that.amount) > parseFloat(that.balance)) {
        that.common.notification(
          that,
          "The withdrawal amount cannot exceed the maximum available balance",
          3
        );
        return;
      }
      API.getGasPrice({}).then((result) => {
        // debugger;
        if (result.code !== 200) {
          that.common.notification(
            that,
            "Failed to apply for withdrawal, Please wait for a moment",
            3
          );
          return;
        }
        that.loading = true;
        let gasPrice = result.data;
        let fromAddress = window.localStorage.getItem("walletAddress");
        let toAddress = "0x6f4d87a303c09ea52bd5ef5d27cd020489dae503";
        let amount = web3.utils.toWei(that.amount, "ether");
        web3.eth
          .getTransactionCount(fromAddress, web3.eth.defaultBlock.pending)
          .then(function (nonce) {
            // 获取交易数据
            var txData = {
              // nonce每次++，以免覆盖之前pending中的交易
              nonce: web3.utils.toHex(nonce++),
              // 设置gasLimit和gasPrice
              gasLimit: web3.utils.toHex(21000),
              gasPrice: web3.utils.toHex(gasPrice),
              // 要转账的哪个账号
              to: toAddress,
              // 从哪个账号转
              from: fromAddress,
              // 0.001 以太币
              value: web3.utils.toHex(amount),
              data: "",
              chainId: 9,
            };

            web3.eth.estimateGas(txData).then(function (result) {
              console.log(result);
            });

            var tx = new Tx(txData);

            // 引入私钥，并转换为16进制
            const privateKey = new Buffer(this.getPrivateKey(), "hex");

            // 用私钥签署交易
            tx.sign(privateKey);

            // 序列化
            var serializedTx = tx.serialize().toString("hex");

            var _this = that;
            web3.eth.sendSignedTransaction(
              "0x" + serializedTx.toString("hex"),
              function (err, hash) {
                if (!err) {
                  console.log("提现交易hash：" + hash);
                  if (hash) {
                    _this.getTransByHash(hash);
                  }
                  _this.timer = window.setInterval(function () {
                    _this.getTransByHash(hash);
                  }, 1000);
                } else {
                  console.error("提现Transaction Failure：" + err);
                  _this.loading = false;
                  _this.common.notification(
                    this,
                    "Failed to apply for withdrawal, Please wait for a moment",
                    3
                  );
                }
              }
            );
          });
      });
    },
    // 根据交易哈希查询交易结果
    getTransByHash(hash) {
      var _this = this;
      web3.eth
        .getTransaction(hash)
        .then((response) => {
          var blockNumber = response.blockNumber;
          if (blockNumber != null) {
            window.clearTimeout(_this.timer);
            API.addWithdraw({
              certificationId: window.localStorage.getItem("loginId"),
              walletAddress: window.localStorage.getItem("walletAddress"),
              withdrawAmount: parseInt(_this.amount),
              withdrawType: 3,
              withdrawConfigId: _this.bankConfig.withdrawConfigId,
              fee: 0.06,
            }).then((result) => {
              console.log("提现申请：" + JSON.stringify(result));
              if (result.code !== 200) {
                this.common.notification(
                  this,
                  "Failed to apply for withdrawal",
                  3
                );
                return;
              }
              _this.loading = false;
              _this.reload();
              _this.common.notification(
                _this,
                "The withdrawal request has been submitted",
                1
              );
            });
          }
        })
        .catch((error) => {
          console.log(error, null);
        });
    },
    // 确认go on提现
    toConfirm() {
      this.tipVisible = false;
      this.transfer();
    },
    handleCloseBankCardDrawer() {
      this.bankCardDrawer = false;
    },
  },
  filters: {
    ellipsisBankCard(value) {
      if (!value) return "";
      if (value.length > 10) {
        return `${value.substring(0, 4)}************${value.substring(
          value.length - 4
        )}`;
      }
      return value;
    },
  },
};
</script>

<style lang="less" scoped>
@bgsize:25px 25px;
.withdrawContain {
  min-height: 100vh;
  /deep/ .el-input__inner {
    background: rgba(255, 255, 255, 0.08);
    width: 520px;
    color: #ffffff;
    box-shadow: 0px 2px 8px 0px rgba(22, 21, 54, 0.5);
    border: none;
    border-radius: 8px;
  }
  /deep/ .el-input__suffix-inner {
    height: 40px;
    line-height: 40px;
  }
  /deep/ .el-form-item__label {
    font-size: 14px;
    color: #000000;
  }
  /deep/.el-button.el-button--text {
    line-height: 40px;
    padding: 0;
  }
}

.withdrawContent {
  width: 520px;
}

.pageTitle {
  margin-bottom: 40px;
  font-size: 24px;
  font-weight: bold;
}

.blockBtn {
  margin-top: 100px;
  text-align: center;
}

.optionBox {
  display: flex;
  align-items: center;
}

.bankIcon {
  width: 30px;
  height: 30px;
  margin-right: 5px;
  border: 1px solid #e1e1e1;
  border-radius: 15px;
  &.gongshang {
    background: #fff
      url("../assets/images/bank/zhongguogongshangyinhang@2x.png") no-repeat
      center;
    background-size: @bgsize;
  }
  &.jianshe {
    background: #fff url("../assets/images/bank/zhongguojiansheyinhang@2x.png")
      no-repeat center;
    background-size: @bgsize;
  }
  &.zhonguo {
    background: #fff url("../assets/images/bank/zhongguoyinhang@2x.png")
      no-repeat center;
    background-size: @bgsize;
  }
  &.youzheng {
    background: #fff
      url("../assets/images/bank/zhongguoyouzhengchuxuyinhang@2x.png") no-repeat
      center;
    background-size: @bgsize;
  }
  &.nongye {
    background: #fff url("../assets/images/bank/nongyeyinhang@2x.png") no-repeat
      center;
    background-size: @bgsize;
  }
  &.jiaotong {
    background: #fff url("../assets/images/bank/jiaotongyinhang@2x.png")
      no-repeat center;
    background-size: @bgsize;
  }
  &.zhaoshang {
    background: #fff url("../assets/images/bank/zhaoshangyinhang@2x.png")
      no-repeat center;
    background-size: @bgsize;
  }
  &.pufa {
    background: #fff url("../assets/images/bank/pufayinhang@2x.png") no-repeat
      center;
    background-size: @bgsize;
  }
  &.pingan {
    background: #fff url("../assets/images/bank/zhongguopingan@2x.png")
      no-repeat center;
    background-size: @bgsize;
  }
}
</style>
