<template>
  <div class="pageContainer authSuccess">
    <div class="successIco"></div>
    <p class="successTxt">Under authentication...</p>
    <div class="subTitle">
      <p>Please be patient while your certification application is being reviewed by the administrator...</p>
    </div>
    <div class="fixedBtn">
      <el-button type="primary"  round class="btnFlex" @click="toHome">back home</el-button>
    </div>
  </div>
</template>

<script>

export default {

  methods: {
    toHome() {
      this.$router.replace({
        path: '/',
      });
    }
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
  background: url('../../assets/images/auth_audit@2x.png') no-repeat center;
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
    color: rgba(255, 255, 255, 0.8);
  }
}
.fixedBtn {
  margin-top: 0.35rem;
}
</style>
