<template>
  <div>
    <el-row :gutter="20" style="margin-bottom: 0.3rem">
      <el-col :xs="24" :sm="12" :md="8" v-for="item in banks" :key="item.id">
        <div class="card" :class="item.bankStyle">
          <div class="bankLogo">
            <!-- <img src="../../assets/images/bank/zhongguogongshangyinhang@2x.png" alt=""> -->
          </div>
          <div class="bankInfo">
            <span class="bankName">{{ item.accountBank }}</span>
            <span class="cardType">{{ item.bankType }}</span>
            <span class="cardNum">{{ item.bankCard | ellipsisBankCard }}</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" v-if="banks.length == 0">
        <div class="card addBankCard" @click="toAdd">
          <div class="addCard">
            <i class="el-icon-circle-plus-outline"></i>
            <p>Add or change bank card</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="Add or change bank card"
      :visible.sync="dialogVisible"
      width="560px"
      :before-close="handleClose"
      class="pcPage"
    >
      <addBankcard />
    </el-dialog>
    <el-dialog
      title="Add or change bank card"
      :visible.sync="mDialogVisible"
      width="92%"
      :before-close="handleClose"
      class="mPage"
    >
      <addMBankcard />
    </el-dialog>
  </div>
</template>

<script>
import addBankcard from "@/pcviews/AddBankCard";
import addMBankcard from "@/views/AddBankCard";
import MTipModal from "@/components/MTipModal";
import API from "@/service/index";
export default {
  components: {
    addBankcard,
    addMBankcard,
    MTipModal,
  },
  data() {
    return {
      banks: [],
      dialogVisible: false,
      mDialogVisible: false,
      tipVisible: false,
    };
  },
  mounted() {
    this.getCurrentUser();
    this.getWithdrawConfig();
  },
  methods: {
    handleClose(done) {
      this.$confirm("Confirm the shut down？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 查询用户提现配置信息
    getWithdrawConfig() {
      this.$API
        .getWithdrawConfig({
          certificationId: window.localStorage.getItem("loginId"),
          type: 3,
        })
        .then((result) => {
          if (result.code !== 200) {
            this.common.notification(this, "Data loading failure", 3);
            return;
          }
          if (result.data !== null) {
            this.banks = result.data;
          }
        });
    },
    //添加bank card

    toAdd() {
      this.$API
        .getWithdrawConfig({
          certificationId: window.localStorage.getItem("loginId"),
          type: 3,
        })
        .then((result) => {
          if (result.code == 200 && result.data !== null) {
            this.bankStatus = result.data.length;
            if (result.data.length !== 0) {
              this.common.notification(
                this,
                "The bank card information already exists",
                2
              );
              return;
            } else {
              API.getUserInfo({
                certificationId: window.localStorage.getItem("loginId"),
              }).then((result) => {
                if (result.code !== 200) {
                  this.common.notification(this, "Data loading failure", 3);
                  return;
                }
                let clientWidth = document.documentElement.clientWidth;
                if (result.data !== null) {
                  if (result.data.status !== 1) {
                    if (clientWidth < 800) {
                      this.tipVisible = true;
                      return;
                    } else {
                      this.$confirm(
                        "Please complete the KYC process before adding your bank account information to receive the fund.",
                        "Tips",
                        {
                          confirmButtonText: "confirm",
                          cancelButtonText: "cancel",
                          type: "warning",
                        }
                      ).then(() => {
                        this.$router.push({
                          path: "/realname",
                        });
                      });
                      return;
                    }
                  }
                }
                if (clientWidth < 800) {
                  this.mDialogVisible = true;
                } else {
                  this.dialogVisible = true;
                }
              });
            }
          }
        });
      // let clientWidth = document.documentElement.clientWidth;
      // if(clientWidth < 800) {
      // 	this.mDialogVisible = true;
      // } else {
      // 	this.dialogVisible = true;
      // }
    },
    toAuth() {
      this.$router.push({
        path: "/realname",
      });
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
.bankLogo {
  width: 25px;
  height: 25px;
  padding: 6px;
  background: #d0dff0;
  border-radius: 100%;
  position: relative;
  left: 3px;
  top: 3px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
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

.card.addBankCard {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.06);
  text-align: center;
  border: 1px dotted #999999;
  i {
    font-size: 30px;
  }
  p {
    font-size: 14px;
    margin-top: 10px;
  }
  .addCard {
    margin: 10px auto 0;
  }
}

.card {
  display: flex;
  width: 80%;
  height: 80px;
  //padding: 25px 15px 5px;
  margin-bottom: 19px;
  border-radius: 16px;
  border: 1px solid #000000;
  @media screen and (max-width: 800px) {
    height: 80px;
  }
  &.jianshe {
    background-color: #2e65a5;
    .cardType {
      color: #a1bfd8;
    }
  }
  &.gongshang {
    position: relative;
    background-color: #c15356;
    .cardType {
      color: #f4c8c9;
    }
    .bankLogo {
      background: #d0dff0
        url("../../assets/images/bank/zhongguogongshangyinhang@2x.png")
        no-repeat center;
      background-size: 25px 25px;
    }
  }
  &.jianshe {
    background-color: #2e65a5;
    .cardType {
      color: #a1bfd8;
    }
    .bankLogo {
      background: #d0dff0
        url("../../assets/images/bank/zhongguojiansheyinhang@2x.png") no-repeat
        center;
      background-size: 25px 25px;
    }
  }
  &.zhonguo {
    background-color: rgba(158, 51, 58, 1);
    .cardType {
      color: rgba(255, 255, 255, 0.5);
    }
    .bankLogo {
      background: #d0dff0 url("../../assets/images/bank/zhongguoyinhang@2x.png")
        no-repeat center;
      background-size: 25px 25px;
    }
  }
  &.youzheng {
    background-color: #22944b;
    .cardType {
      color: rgba(255, 255, 255, 0.5);
    }
    .bankLogo {
      background: #d0dff0
        url("../../assets/images/bank/zhongguoyouzhengchuxuyinhang@2x.png")
        no-repeat center;
      background-size: 25px 25px;
    }
  }
  &.nongye {
    background-color: #009174;
    .cardType {
      color: rgba(255, 255, 255, 0.5);
    }
    .bankLogo {
      background: #d0dff0 url("../../assets/images/bank/nongyeyinhang@2x.png")
        no-repeat center;
      background-size: 25px 25px;
    }
  }
  &.jiaotong {
    background-color: #00367a;
    .cardType {
      color: rgba(255, 255, 255, 0.5);
    }
    .bankLogo {
      background: #d0dff0 url("../../assets/images/bank/jiaotongyinhang@2x.png")
        no-repeat center;
      background-size: 25px 25px;
    }
  }
  &.zhaoshang {
    background-color: #9e2225;
    .cardType {
      color: rgba(255, 255, 255, 0.5);
    }
    .bankLogo {
      background: #d0dff0
        url("../../assets/images/bank/zhaoshangyinhang@2x.png") no-repeat center;
      background-size: 25px 25px;
    }
  }
  &.pufa {
    background-color: #1d207c;
    .cardType {
      color: rgba(255, 255, 255, 0.5);
    }
    .bankLogo {
      background: #d0dff0 url("../../assets/images/bank/pufayinhang@2x.png")
        no-repeat center;
      background-size: 25px 25px;
    }
  }
  &.pingan {
    background-color: #ed6927;
    .cardType {
      color: rgba(255, 255, 255, 0.5);
    }
    .bankLogo {
      background: #d0dff0 url("../../assets/images/bank/zhongguopingan@2x.png")
        no-repeat center;
      background-size: 25px 25px;
    }
  }
}

.bankInfo {
  display: flex;
  flex-direction: column;
  .bankName {
    margin-bottom: 15px;
    font-size: 14px;
    color: #000000;
  }
  .cardType {
    margin-bottom: 20px;
    font-size: 12px;
  }
  .cardNum {
    font-size: 18px;
    color: #000000;
    font-weight: 500;
  }
}
/*/deep/.el-dialog__wrapper{z-index:2009!important ;}*/
</style>
