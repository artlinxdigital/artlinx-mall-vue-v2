<template>
  <div class="operateRow">
    <el-button type="primary" class="btnLogin" @click="$emit('login')">Connect</el-button>
    <!-- <div class="loginRegTip">
      Don’t have an account?
      <router-link class="link" to="/register">Sign up</router-link>
    </div> -->
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.operateRow {
	font-size: 16px;
	@media screen and (max-width: 800px) {
		font-size: 0.16rem;
	}
}
.btnLogin {
   width: 100%;
  height: 40px;
  margin-right:0;
  padding: 0;
  /deep/ span {
    font-size:16px;
     @media screen and (max-width: 800px) {
       font-size: 0.16rem;
     }
  }
  @media screen and (max-width: 800px) {
    height: 0.42rem;
    margin-right: 0;
    margin-bottom:0;
  }
}
.operateRow {
  margin-top:35px;
  @media screen and (max-width: 800px) {
       margin-top: 0.3rem;
    }
}
.loginRegTip {
  color: #999999;
   @media screen and (max-width: 800px) {
       text-align: center;
    }
  span {
    font-size:12px;
    font-weight: 500;
    @media screen and (max-width: 800px) {
      font-size: 0.12rem;
    }
  }
  .link {
    font-size:12px;
    line-height:40px ;
    color: #000000;
    cursor: pointer;
    @media screen and (max-width: 800px) {
      font-size: 0.12rem;
    }
  }
}
</style>
