<template>
  <div class="pageContainer setting">
    <MPageHeader title="set" />
    <ul class="settingList">
      <li class="settingLi" @click="$router.push('/change-pwd')">
        <span class="liLt">Change password</span>
        <span class="liRt">
          <i class="el-icon-arrow-right"></i>
        </span>
      </li>
      <!-- <li class="settingLi">
        <span class="liLt">APP版本</span>
        <span class="liRt">V1.0</span>
      </li> -->
    </ul>

    <div class="btnLogout" @click="handleLogout">Logout</div>
    <MTipModal
        :visible.sync="tipVisible"
        title="Tips"
        content="Are you sure logout?"
        cancelTxt="cancel"
        confirmTxt="confirm"
        style="text-align: center;"
        @close="tipVisible = false"
        @ok="toQuit"
    />
  </div>
</template>

<script>
import MPageHeader from "@/components/MPageHeader";
import MTipModal from "@/components/MTipModal";

export default {
  components: {
    MPageHeader,
    MTipModal
  },
  data() {
    return {
      tipVisible: false
    };
  },
  methods: {
    // 退出登录对话框
    handleLogout () {
      this.tipVisible = true;
    },
    // 退出登录
    toQuit() {
      // 清除数据
      localStorage.clear();
      sessionStorage.clear();
      // 跳转登录页面
      this.$router.push({
        path: '/login'
      });
    }
  }
}
</script>

<style lang="less" scoped>
.setting {
  height: 100vh;
  background: #F9F9F9;
}
.settingList {
  margin-top: 0.18rem;
  background: #fff;
}
.settingLi {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.37rem 0.31rem 0.37rem 0.33rem;
  border-bottom: 0.01rem solid #F4F4F4;
  &:last-child {
    border-bottom: 0;
  }
  .liLt {
    font-size: 0.28rem;
    font-weight: 500;
    color: #333;
  }
  .liRt {
    font-size: 0.24rem;
    font-weight: 500;
    color: rgba(35, 35, 35, 0.6);
    i {
      font-size: 0.26rem;
    }
  }
}
.btnLogout {
  margin-top: 0.27rem;
  padding: 0.31rem 0;
  font-size: 0.3rem;
  color: #333;
  background: #fff;
  text-align: center;
}
</style>
