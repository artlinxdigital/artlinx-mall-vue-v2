<template>
  <div class="pageContainer authSuccess">
    <div class="successIco"></div>
    <p class="successTxt">Authentication failure！</p>
    <div class="subTitle">
      <p>Your authentication failed, please re-authenticate.</p>
      <p>failure reasons：{{auditContent}}</p>
    </div>
    <div class="fixedBtn">
      <el-button type="primary"  round class="btnFlex" @click="toContinueAuth">Re-apply</el-button>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    auditContent: String
  },
  methods: {
    toContinueAuth() {
      // this.$router.replace({
      //   path: '/realname',
      // });
      this.$emit("toContinue");
    },
  }
}
</script>

<style lang="less" scoped>
.authSuccess {
  text-align: center;
}
.successIco {
  width: 1.56rem;
  height: 1.06rem;
  margin: 0.8rem auto 0.36rem;
  background: url('../../assets/images/auth_shibai@2x.png') no-repeat center;
  background-size: contain;
}
.successTxt {
  margin-bottom: 0.21rem;
  font-size:0.2rem;
  color: #000000;
  font-weight: 500;
}
.subTitle {
  margin-bottom: 0.6rem;
  span, p {
    font-size: 0.16rem;
    font-weight: 500;
    line-height: 0.35rem;
    color: #000000;
  }
}
.fixedBtn {
  margin-top: 0.35rem;
}
</style>
