<template>
  <div class="pageContainer withdrawSet">
    <MPageHeader title="Withdrawal is set" />
    <ul class="bankcards">
      <li class="card" :class="item.bankStyle" v-for="item in banks" :key="item.id">
        <div class="bankLogo">
          <!-- <img src="../assets/images/bank/zhongguogongshangyinhang@2x.png" alt=""> -->
        </div>
        <div class="bankInfo">
          <span class="bankName">{{item.accountBank}}</span>
          <span class="cardType">{{item.bankType}}</span>
          <span class="cardNum">{{item.bankCard | ellipsisBankCard}}</span>
        </div>
      </li>
    </ul>
    <div class="addBankCard" @click="handleLinkAdd">
      <i class="el-icon-plus"></i>
      <span>Add or change bank card</span>
    </div>
    <MTipModal
        :visible.sync="tipVisible"
        title="Tips"
        content="Please complete the KYC process before adding your bank account information to receive the fund."
        cancelTxt="cancel"
        confirmTxt="confirm"
        @close="tipVisible = false"
        @ok="toAuth"
    />
  </div>
</template>

<script>
import MPageHeader from "@/components/MPageHeader";
import MTipModal from "@/components/MTipModal";
import API from '@/service/index';

export default {
  filters: {
    ellipsisBankCard(value) {
        if (!value) return "";
        if (value.length > 10) {
            return `${value.substring(0, 4)}************${value.substring(value.length - 4)}`;
        }
        return value;
    }
  },
  components: {
    MPageHeader,
    MTipModal
  },
  data () {
    return {
      banks: [],
      tipVisible: false,
      status: 0
    }
  },
  mounted() {this.getCurrentUser();
    // 查询提现配置信息
    this.getWithdrawConfig();
  },
  methods: {
    // 查询用户信息
    getUserInfo() {
      API.getUserInfo({ certificationId: window.localStorage.getItem("loginId") }).then(result => {
          if (result.code !== 200) {
            this.common.notification(this, "Data loading failure", 3);
            return;
          }
          if (result.data !== null) {
            this.status = result.data.status;
          }
      });
    },
    // 查询用户提现配置信息
    getWithdrawConfig() {
      API.getWithdrawConfig({ certificationId: window.localStorage.getItem("loginId"), type: 3 }).then(result => {
          if (result.code !== 200) {
            this.common.notification(this, "Data loading failure", 3);
            return;
          }
          if (result.data !== null) {
            this.banks = result.data;
          }
          console.log("提现列表：" + JSON.stringify(result));
      });
    },
    // Certification
    toAuth() {
      this.$router.push({
        path: '/realname'
      });
    },
    handleLinkAdd () {
      this.$router.push({
        path: '/add-bank'
      });
    }
  }
}
</script>

<style lang="less" scoped>
.withdrawSet {
  min-height: 100vh;
  background-color: #F7F7F7;
}
.bankcards {
  padding: 0.27rem 0.24rem;
}
.bankLogo {
  width: 0.6rem;
  height: 0.6rem;
  padding: 0.12rem;
  margin-right: 0.18rem;
  background: #D0DFF0;
  border-radius: 100%;
  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}
.card {
  display: flex;
  width: 100%;
  height: 2.2rem;
  padding: 0.37rem 0.33rem;
  margin-bottom: 0.19rem;
  border-radius: 0.1rem;
  border:1px solid #000000;
  &.jianshe {
    background-color: #2E65A5;
    .cardType {
      color: #A1BFD8;
    }
  }
  &.gongshang {
    position: relative;
    background-color: #C15356;
    .cardType {
      color: #F4C8C9;
    }
    // &::after {
    //   content: '';
    //   position: absolute;
    //   width: 2.63rem;
    //   height: 2.22rem;
    //   opacity: 0.1;
    //   background: url('../assets/images/bank/zhongguogongshangyinhang@2x.png') no-repeat right;
    //   background-size: 2.63rem 2.22rem;
    //   right: 0.53rem;
    //   top: 0;
    // }
    .bankLogo {
      background: #D0DFF0 url('../assets/images/bank/zhongguogongshangyinhang@2x.png') no-repeat center;
      background-size: 0.36rem 0.36rem;
    }
  }
  &.jianshe {
    background-color: #2E65A5;
    .cardType {
      color: #A1BFD8;
    }
    .bankLogo {
      background: #D0DFF0 url('../assets/images/bank/zhongguojiansheyinhang@2x.png') no-repeat center;
      background-size: 0.36rem 0.36rem;
    }
  }
  &.zhonguo {
    background-color: rgba(158, 51, 58, 1);
    .cardType {
      color: rgba(255, 255, 255, 0.5);
    }
    .bankLogo {
      background: #D0DFF0 url('../assets/images/bank/zhongguoyinhang@2x.png') no-repeat center;
      background-size: 0.36rem 0.36rem;
    }
  }
  &.youzheng {
    background-color: #22944b;
    .cardType {
      color: rgba(255, 255, 255, 0.5);
    }
    .bankLogo {
      background: #D0DFF0 url('../assets/images/bank/zhongguoyouzhengchuxuyinhang@2x.png') no-repeat center;
      background-size: 0.36rem 0.36rem;
    }
  }
  &.nongye {
    background-color: #009174;
    .cardType {
      color: rgba(255, 255, 255, 0.5);
    }
    .bankLogo {
      background: #D0DFF0 url('../assets/images/bank/nongyeyinhang@2x.png') no-repeat center;
      background-size: 0.36rem 0.36rem;
    }
  }
  &.jiaotong {
    background-color: #00367a;
    .cardType {
      color: rgba(255, 255, 255, 0.5);
    }
    .bankLogo {
      background: #D0DFF0 url('../assets/images/bank/jiaotongyinhang@2x.png') no-repeat center;
      background-size: 0.36rem 0.36rem;
    }
  }
  &.zhaoshang {
    background-color: #9e2225;
    .cardType {
      color: rgba(255, 255, 255, 0.5);
    }
    .bankLogo {
      background: #D0DFF0 url('../assets/images/bank/zhaoshangyinhang@2x.png') no-repeat center;
      background-size: 0.36rem 0.36rem;
    }
  }
  &.pufa {
    background-color: #1d207c;
    .cardType {
      color: rgba(255, 255, 255, 0.5);
    }
    .bankLogo {
      background: #D0DFF0 url('../assets/images/bank/pufayinhang@2x.png') no-repeat center;
      background-size: 0.36rem 0.36rem;
    }
  }
  &.pingan {
    background-color: #ed6927;
    .cardType {
      color: rgba(255, 255, 255, 0.5);
    }
    .bankLogo {
      background: #D0DFF0 url('../assets/images/bank/zhongguopingan@2x.png') no-repeat center;
      background-size: 0.36rem 0.36rem;
    }
  }
}
.bankInfo {
  display: flex;
  flex-direction: column;
  .bankName {
    margin-bottom: 0.15rem;
    font-size: 0.3rem;
    color: #000000;
  }
  .cardType {
    margin-bottom: 0.47rem;
    font-size: 0.24rem;
  }
  .cardNum {
    font-size: 0.36rem;
    color: #000000;
    font-weight: 500;
  }
}
.addBankCard {
  display: flex;
  align-items: center;
  height: 1.36rem;
  margin: 0 0.33rem;
  padding: 0 0.37rem;
  background: #FFFFFF;
  border-radius: 0.2rem;
  border:1px dotted #999999;
  i {
    margin-right: 0.28rem;
    font-size: 0.44rem;
    color: #666;
  }
  span {
    font-size: 0.32rem;
    color: #333;
    font-weight: 500;
  }
}
</style>
