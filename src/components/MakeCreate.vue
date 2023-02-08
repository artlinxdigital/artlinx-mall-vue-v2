<template>
  <div style="display: flex">
    <div class="btnMakeCreate" @click.prevent="toCreateCollection">Mint</div>
    <div class="btnMakeCreate" @click.prevent="toImportCollection">Import</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userStatus: 1,
      applyStatus: -1,
    };
  },
  mounted() {
    this.getCurrentUser();
    this.getUserInfo();
  },
  methods: {
    // 查询用户信息
    getUserInfo() {
      const walletAddress = window.localStorage.getItem("walletAddress");
      if (walletAddress == "" || window.localStorage.getItem("loginId") == "") {
        return;
      }
      this.$API
        .getUserInfo({
          certificationId: window.localStorage.getItem("loginId"),
        })
        .then((result) => {
          if (result.code !== 200) {
            this.common.notification(this, "Data loading failure", 3);
            console.log("Description Failed to query user information");
            return;
          }
          this.applyStatus = result.data.applyStatus;
        });
    },
    // 跳转藏品铸造页面
    toCreateCollection() {
      const walletAddress = window.localStorage.getItem("walletAddress");
      if (walletAddress == "") {
        this.$router.push({
          path: "/login",
        });
        return;
      }

      this.$router.push({
        path: "/casting",
      });
    },
    // 导入藏品
    toImportCollection() {
      const walletAddress = window.localStorage.getItem("walletAddress");
      if (walletAddress == "") {
        this.$router.push({
          path: "/login",
        });
        return;
      }
      this.$router.push({
        path: "/importMolding",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.btnMakeCreate {
  height: 32px;
  line-height: 32px;
  color: #ffffff;
  cursor: pointer;
  padding: 0 20px;
  margin: 0 5px;
  border: none;
  font-weight: 400;
  background: #2a513f;
  border-radius: 16px;
  /deep/ span {
    font-size: 14px;
  }
  @media screen and (max-width: 800px) {
    height: 0.6rem;
    line-height: 0.6rem;
    margin-right: 0.3rem;
    border-radius: 0.3rem;
    /deep/ span {
      font-size: 0.3rem;
    }
  }
}
</style>
