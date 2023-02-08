<template>
  <div class="payFail">
    <PcPageHeader />
    <div class="tipContainer">
      <i class="iconFail"></i>
      <span class="subTxt">Payment Failed</span>
      <span class="subTip">Please check your network connectionpaid</span>
      <div class="btnRow">
        <el-button type="primary" class="btnCompelete" @click="payAgain">pay again</el-button>
        <el-button class="btnHome" @click="$router.push('/')">Go back home</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import PcPageHeader from "@/components/PcPageHeader";
import API from "@/service";

export default {
  components: {
    PcPageHeader
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
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 0.16rem;
  backdrop-filter: blur(0.18rem);
}
.tipContainer {
  display: flex;
  flex-direction: column;
  width: 70%;
  max-width: 1186px;
  margin: 0 auto;
  padding: 0 1rem 0.4rem;
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
    margin-bottom: 0.1rem;
    font-size: 0.28rem;
    color: #000000;
  }
  .subTip {
    margin-bottom: 0.8rem;
    font-size: 0.25rem;
    font-weight: 500;
    color: #000000;
    @media screen and (max-width: 800px) {
      margin-bottom: 0.6rem;
    }
  }
}
.iconFail {
  width: 1rem;
  height: 1rem;
  margin: 1.5rem auto 0.26rem;
  background: url('../assets/images/shibai@2x.png') no-repeat center;
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
