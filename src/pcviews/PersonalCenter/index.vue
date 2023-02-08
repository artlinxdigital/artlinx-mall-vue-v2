<template>
  <div class="userCenter">
    <PersonalCenterLayout>
      <div class="pcPageCont">
        <h5 class="partTitle">Account Information Setting</h5>
        <PcPersonInfo />
      </div>
    </PersonalCenterLayout>
  </div>
</template>

<script>
import Vue from "vue";
import MPageHeader from "@/components/MPageHeader";
import AccountBankCard from "./AcountBalanceCard";
import AuthAndRecomend from "./AuthAndRecomend";
// import ActionSheet from "./ActionSheet";
import PcPersonInfo from "./PcPersonInfo";
import API from "@/service/index";
import Web3 from "web3";
import PersonalCenterLayout from "@/components/PersonalCenterLayout";

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
    MPageHeader,
    AccountBankCard,
    AuthAndRecomend,
    // ActionSheet,
    PersonalCenterLayout,
    PcPersonInfo,

  },

  data() {
    return {
      chainModal: false,
      teamCount: 0,
      applyStatus: -1,
      clientWidth: 750,
      recoVisible: false,
    };
  },
  mounted() {this.getCurrentUser();
    this.$nextTick(() => {
      this.clientWidth = document.documentElement.clientWidth;
    });
  },
  methods: {
    handleLToRecomend() {
      this.recoVisible = true;
    },
    linkToUrl(path) {
      this.$router.push({
        path,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.pcPageCont {
  color: #000000;
}
.partTitle {
  font-size:24px;
  font-weight: bold;
  margin-bottom:40px ;
}

</style>
