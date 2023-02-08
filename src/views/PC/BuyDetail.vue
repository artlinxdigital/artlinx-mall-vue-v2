<template>
  <div class="container">
    <PcPageHeader />
    <div class="content">
      <OrderInfo ref="payContent" />
    </div>
  </div>
</template>

<script>
import PcPageHeader from "@/components/PcPageHeader";
import OrderInfo from '@/components/OrderInfo';
import API from "@/service";
let Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider(API.getNetWorkUrl()));

export default {
  components: {
    PcPageHeader,
    OrderInfo
  },
  data () {
    return {
      loading: false,
      buyerFee: 0,
    }
  },
  mounted() {this.getCurrentUser();
    //获取合约配置
    this.$API.getContractConfig().then(result => {
      if (result.code !== 200) {
        this.common.notification(this, result.msg, 3);
        return;
      } else {
        this.buyerFee = (result.data.buyerFee) / 100;
        // 查询余额
        this.getUserBalance();
        //获取藏品详情
        this.initDetail();
      }
    });
  },
  methods: {
    // 查询地址余额
    getUserBalance() {
      web3.eth.getBalance(window.localStorage.getItem("walletAddress")).then(result => {
        var balanceCurr = web3.utils.fromWei(result, 'ether');
        this.balance = parseFloat(balanceCurr).toFixed(2);
      });
    },
    initDetail() {
      this.loading = true;
      this.$API.getMallCollectionInfo({
        certificationId: window.localStorage.getItem("loginId"),
        productId: this.$route.params.id
      }).then(result => {
        if (result.code !== 200) {
          this.common.notification(this, "Data loading failure", 3);
          return;
        }
        if (result.data !== null) {
          this.$refs.payContent.calPayInfo(result.data, this.buyerFee, this.balance);
        }
        this.loading = false;
      });
    },
  }

}
</script>

<style lang="less" scoped>
.container {
  min-height: 100vh;
  padding-top: 0.87rem;
  background: #f7f7f7;
  .content {
    max-width: 70%;
    min-height: 80vh;
    margin: 0 auto;
    padding: 0.66rem 10%;
    background: #fff;
  }
}

</style>
