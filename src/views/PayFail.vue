<template>
  <div class="payFail">
    <MPageHeader title="Payment Failed" />
    <div class="tipContainer">
      <i class="iconFail"></i>
      <span class="subTxt">Payment Failed</span>
      <span class="subTip">Please check your network connectionpaid</span>
      <el-button type="primary" @click="payAgain">pay again</el-button>
      <el-button class="btnHome" @click="$router.push('/')">Go back home</el-button>
    </div>
  </div>
</template>

<script>
import MPageHeader from "@/components/MPageHeader";
import API from "@/service";

export default {
  components: {
    MPageHeader
  },
  data() {
    return {
      productId: 0
    };
  },
  mounted() {this.getCurrentUser();
    this.productId = this.$route.query.productId;
    if (this.productId > 0) {
      this.updateCollectionStatus();
    }
  },
  methods: {
    // 更新藏品状态
    updateCollectionStatus() {
      API.updateCollectionStatus({ productId: this.productId, status: 0 }).then(result => {
          console.log("updateCollectionStatus: " + JSON.stringify(result));
      });
    },
    // go back藏品详情页面pay again
    payAgain() {
      if (this.productId > 0) {
        this.$router.push({
          path: `/collection/${this.productId}`
        });
      } else {
        // go back上一页
        this.$router.go(-1);
      }
    }
  }
}
</script>

<style lang="less" scoped>
.payFail {
  @media screen and (max-width: 800px) {
    padding-top: 0.85rem;
  }
}
.tipContainer {
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  text-align: center;
  .subTxt {
    margin-bottom: 0.34rem;
    font-size: 0.3rem;
    color: #333;
  }
  .subTip {
    margin-bottom: 1.84rem;
    font-size: 0.26rem;
    font-weight: 500;
    color: #999;
  }
}
.iconFail {
  width: 1.3rem;
  height: 1.3rem;
  margin: 1.51rem auto 0.52rem;
  background: url('../assets/images/shibai@2x.png') no-repeat center;
  background-size: 1.3rem 1.3rem;
}
.btnHome {
  margin-left: 0;
  margin-top: 0.41rem;
}
</style>
