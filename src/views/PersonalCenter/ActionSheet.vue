<template>
  <div class="actions">
    <ul class="actionList">
      <li class="actionListItem" @click="linkToUrl('/withdraw-setting')">
        <i class="icTxsz"></i>
        <div class="actionNav">
          <span class="actionName">Withdrawal is set</span>
          <span class="extra"><i class="el-icon-arrow-right"></i></span>
        </div>
      </li>
      <li class="actionListItem" @click="linkToUrl('/my-collections')">
        <i class="icSc"></i>
        <div class="actionNav">
          <span class="actionName">My favorites</span>
          <span class="extra"><i class="el-icon-arrow-right"></i></span>
        </div>
      </li>
      <li class="actionListItem" @click="linkToUrl('/owner')">
        <i class="icNft"></i>
        <div class="actionNav">
          <span class="actionName">My items</span>
          <span class="extra"><i class="el-icon-arrow-right"></i></span>
        </div>
      </li>
      <li class="actionListItem" @click="linkToUrl('/order')">
        <i class="icDd"></i>
        <div class="actionNav">
          <span class="actionName">My trading</span>
          <span class="extra"><i class="el-icon-arrow-right"></i></span>
        </div>
      </li>
      <!-- <li class="actionListItem" @click="linkToUrl('/team')">
        <i class="icTd"></i>
        <div class="actionNav">
          <span class="actionName">My Team</span>
          <span class="extra"
            >{{ teamCount }}<i class="el-icon-arrow-right"></i
          ></span>
        </div>
      </li> -->
      <li class="actionListItem" @click="releaseApply">
        <i class="icSq"></i>
        <div class="actionNav">
          <span class="actionName">{{ applyContext }}</span>
          <span class="extra"
            >{{ applyStatuaDesc }}<i class="el-icon-arrow-right"></i
          ></span>
        </div>
      </li>
      <li class="actionListItem">
        <i class="icGz"></i>
        <div class="actionNav">
          <span class="actionName">Platform incentive rule</span>
          <span class="extra"><i class="el-icon-arrow-right"></i></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import MTipModal from "@/components/MTipModal";
import API from "@/service/index";

export default {
  components: {
    MTipModal,
  },
  props: {
    teamCount: Number,
  },
  inject: ["reload"],
  data() {
    return {
      actions: [],
      tipVisible: false,
      applyStatus: -1,
      applyContext: "Apply to be a foundry",
      applyStatuaDesc: "Apply Now",
      content: "",
      userStatus: 1,
    };
  },
  mounted() {
    this.getCurrentUser();
  },
  methods: {
    // 更新用户状态
    // 更新用户藏品申请状态
    updateUserStatus(status) {},
    // 更新用户藏品申请状态
    updateApplyStatus(status) {
      this.applyStatus = parseInt(status);
      if (this.applyStatus === 0) {
        this.applyStatuaDesc = "Under authentication";
      }
      if (this.applyStatus === 1) {
        this.applyStatuaDesc = "";
        this.applyContext = "Mint";
      }
      if (this.applyStatus === 2) {
        this.applyStatuaDesc = "Apply Now";
      }
    },
    // 申请成为藏品铸造者
    releaseApply() {
      this.$router.push({
        path: "/casting",
      });
    },

    linkToUrl(path) {
      if (path === "/withdraw-setting") {
        if (this.userStatus !== 1) {
          this.content =
            "Please complete the KYC process before adding your bank account information to receive the fund.";
          this.tipVisible = true;
          return;
        }
      }
      this.$router.push({
        path,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.bg(@file, @width, @height) {
  width: @width;
  height: @height;
  background: url("@{file}") no-repeat;
  background-size: 100% 100%;
}
.actions {
  margin: 0 0.24rem 0.4rem;
  background: #ffffff;
  border-radius: 0.2rem;
}
.actionListItem {
  display: flex;
  align-items: center;
  padding: 0 0.23rem 0;
  &:last-child {
    .actionNav {
      border-bottom: 0;
    }
  }
}
.extra {
  font-size: 0.24rem;
  color: #999;
  i {
    font-size: 0.24rem;
    color: #787878;
  }
}
.actionNav {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.29rem 0 0.29rem 0;
  margin-left: 0.17rem;
  // margin: 0 0.17rem 0 0.23rem;
  border-bottom: 1px solid #eee;
}
.actionName {
  font-size: 0.28rem;
  color: #333;
}
</style>
