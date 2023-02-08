<template>
  <div class="pageContainer authSuccess">
    <PcPageHeader />
    <div class="authSuccessWrap">
      <div class="successIco"></div>
      <p class="successTxt">Authentication failure！</p>
      <div class="subTitle">
        <p>Your authentication failed, please re-authenticate.</p>
      </div>
      <div class="fixedBtn">
        <el-button type="primary" class="btnFlex" @click="toContinueAuth"
          >reauthentication</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import PcPageHeader from "@/components/PcPageHeader";

export default {
  components: {
    PcPageHeader,
  },
  methods: {
    toContinueAuth() {
      const walletAddress = window.localStorage.getItem("walletAddress");
      if (walletAddress == "") {
        this.$router.push({
          path: "/login",
        });
        return;
      }
      this.$router.push({
        path: "/realname",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.authSuccessWrap {
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 0.16rem;
  backdrop-filter: blur(0.18rem);
  @media screen and (max-width: 800px) {
    width: auto;
    margin: 0 0.16rem;
    padding: 0 0.16rem 0.4rem;
  }
}
.authSuccess {
  text-align: center;
}
.successIco {
  width: 2.4rem;
  height: 1.6rem;
  margin: 1.5rem auto 0.6rem;
  background: url("../assets/images/auth_shibai@2x.png") no-repeat center;
  background-size: cover;
}
.successTxt {
  margin-bottom: 0.24rem;
  font-size: 0.24rem;
  color: #000000;
  font-weight: 500;
}
.subTitle {
  span,
  p {
    font-size: 0.16rem;
    line-height: 0.32rem;
    color: #000000;
  }
}
.fixedBtn {
  margin: 0.3rem auto 0.8rem;
  .btnFlex {
    // width: 100%;
  }
}
</style>
