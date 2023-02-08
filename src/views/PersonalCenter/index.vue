<template>
  <div class="userCenter">
    <MPersonalCenterLayout>
      <div class="pcPageCont">

        <MPersonInfo />
      </div>
    </MPersonalCenterLayout>
    <Footer/>
  </div>
</template>

<script>
import Vue from "vue";
import Footer from "@/views/HomeFooter";
import AccountBankCard from "./AcountBalanceCard";
import AuthAndRecomend from "./AuthAndRecomend";
// import ActionSheet from "./ActionSheet";
import MPersonInfo from "./MPersonInfo";
import API from "@/service/index";
import Web3 from "web3";
import MPersonalCenterLayout from "@/components/MPersonalCenterLayout";

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
    AccountBankCard,
    AuthAndRecomend,
    Footer,
    MPersonalCenterLayout,
    MPersonInfo,

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
.userCenter{position: relative;}
.pcPageCont {
  color: #000000;
}
.partTitle {
  font-size:24px;
  font-weight: bold;
  margin-bottom:40px ;
}
</style>
