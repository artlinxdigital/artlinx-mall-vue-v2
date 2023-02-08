<template>
  <section class="personLayout">
    <PcPageHeader @search="searchList" />
    <div class="personContentBox fWhite">
      <div class="userLeft">
        <div class="userHeadTop">
          <div class="userAvatar">
            <img :src="avatar" alt="" />
          </div>
          <div class="userInfo">
            <div class="acountInfo">
              <span class="nickname">{{ nickName | ellipsisAccount }}</span>
            </div>
          </div>

          <RecomendCodePc
            :visible.sync="recoVisible"
            @close="recoVisible = false"
            :realName.sync="realName"
            :recommendCode.sync="recommendCode"
          />
        </div>

        <div class="personMenu" v-if="showMenu">
          <ul>
            <li v-for="item in menus" :key="item.key">
              <h2 class="menuHead">{{ item.title }}</h2>
              <ul class="subList">
                <li
                  v-for="subItem in item.subMenus"
                  :key="subItem.key"
                  :class="{ active: subItem.key === activeMenu }"
                  @click="handleClickMenu(subItem)"
                >
                  {{ subItem.title }}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="personContent">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script>
import PcPageHeader from "@/components/PcPageHeader";
import RecomendCodePc from "@/components/RecomendCodePc";
import API from "@/service/index";
import Web3 from "web3";
var web3;
if (typeof web3 !== "undefined") {
  if (web3.currentProvider.isMateMask) {
    new Web3.providers.HttpProvider(API.getNetWorkUrl());
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(API.getNetWorkUrl()));
  }
} else {
  //https://mainnet.infura.io/mew  http://47.74.44.123:7575   新的 http://47.74.39.49:7575
  web3 = new Web3(new Web3.providers.HttpProvider(API.getNetWorkUrl()));
}

export default {
  props: {
    showMenu: {
      type: Boolean,
      required: false,
      default: true,
    },
    /** 选择的菜单key */
    activeKey: String,
  },
  components: {
    PcPageHeader,
    RecomendCodePc,
  },
  filters: {
    ellipsisAccount(value) {
      if (!value) return "";
      if (value.length > 10) {
        return `${value.substring(0, 3)}****${value.substring(
          value.length - 4
        )}`;
      }
      return value;
    },
  },
  data() {
    return {
      activeMenu: "1-1",
      menus: [
        {
          key: "1",
          title: "Setting",
          subMenus: [
            {
              key: "1-1",
              title: "Profile",
            },

            {
              key: "1-4",
              title: "Mint",
            },
            {
              key: "1-5",
              title: "Import",
            },
          ],
        },
        {
          key: "2",
          title: "Transactions",
          subMenus: [
            // {
            //   key: "2-1",
            //   title: "Card setting",
            // },
            {
              key: "3-4",
              title: "Records",
            },
          ],
        },
        {
          key: "3",
          title: "Collection",
          subMenus: [
            {
              key: "3-1",
              title: "Favorites",
            },
            {
              key: "3-2",
              title: "Items",
            },
            // {
            //   key: "3-3",
            //   title: "Team",
            // },
          ],
        },
      ],
      applyContext: "Apply to be a foundry",
      applyStatuaDesc: "Apply Now",
      recoVisible: false,
      balance: "0",
      realName: "",
      account: "",
      introduction: "",
      nickName: "",
      userStatus: 1,
      tokenBalance: 0,
      recommendCode: "",
      applyStatus: -1,
      avatar: API.getDefaultAvatarUrl(),
      auditRemind: "Go KYC",
      userType: 1,
    };
  },
  mounted() {
    this.getCurrentUser();
    if (this.activeKey) {
      this.activeMenu = this.activeKey;
    }
    // 查询地址余额
    this.getUserBalance();
    // 查询用户信息
    this.getUserInfo();
  },
  methods: {
    // 搜索
    searchList(keyword) {
      if (keyword) {
        this.$router.push({
          name: "Home",
          params: {
            keyword: keyword,
          },
        });
      }
    },
    handleLToRecomend() {
      this.recoVisible = true;
    },
    // 更新用户藏品申请状态
    updateApplyStatus(status) {
      const parseStatus = parseInt(status);
      this.applyStatus = parseStatus;
      if (parseStatus === 0) {
        this.applyStatuaDesc = "Under authentication";
      }
      if (parseStatus === 1) {
        this.applyStatuaDesc = "";
        this.menus[0].subMenus[3].title = "Mint";
      }
      if (parseStatus === 2) {
        this.applyStatuaDesc = "Apply Now";
      }
    },
    /**
     * 点击左侧菜单对应的操作
     * @param subItem - menu item信息
     */
    async handleClickMenu(subItem) {
      const key = subItem.key;
      switch (key) {
        case "1-1":
          if (this.$route.path === "/personal") return;
          this.activeMenu = key;
          this.linkPath("/personal");
          break;
        case "1-2":
          if (this.$route.path === "/realname") return;
          this.activeMenu = key;
          this.handleLinkAuth();
          break;
        case "1-3":
          if (this.$route.path === "/change-pwd") return;
          this.activeMenu = key;
          this.linkPath("/change-pwd");
          break;
        case "1-4":
          await this.getUserInfo();
          this.releaseApply();

          break;
        case "1-5":
          await this.getUserInfo();
          this.$router.push({
            path: "/importMolding",
          });

          break;
        case "2-1":
          if (this.$route.path === "/funding") return;
          this.activeMenu = key;
          this.linkPath("/funding");
          break;
        case "2-2":
          if (this.$route.path === "/funding") return;
          this.activeMenu = "key";
          this.linkPath("/funding");
          break;
        case "3-1":
          if (this.$route.path === "/my-collections") return;
          this.activeMenu = key;
          this.linkPath("/my-collections");
          break;
        case "3-2":
          if (this.$route.path === "/owner") return;
          this.activeMenu = key;
          this.linkPath("/owner");
          break;
        case "3-3":
          if (this.$route.path === "/team") return;
          this.activeMenu = key;
          this.linkPath("/team");
          break;
        case "3-4":
          if (this.$route.path === "/order") return;
          this.activeMenu = key;
          this.linkPath("/order");
          break;
        default:
          return;
      }
    },
    /**
     * 路由跳转
     * @param path - 跳转的路由
     * @param query - 路由query参数
     */
    linkPath(path, query) {
      this.$router.push({
        path,
        query,
      });
    },

    // 查询地址余额
    getUserBalance() {
      web3.eth
        .getBalance(window.localStorage.getItem("walletAddress"))
        .then((result) => {
          var balanceCurr = web3.utils.fromWei(result, "ether");
          console.log("balanceCurr：" + balanceCurr);
          this.balance = parseFloat(balanceCurr).toFixed(2);
        });
    },
    // 查询用户信息
    getUserInfo() {
      API.getUserInfo({
        certificationId: window.localStorage.getItem("loginId"),
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(this, "Data loading failure", 3);
          return;
        }
        // this.balance = result.data.balance;
        this.teamCount = result.data.teamCount;
        this.recommendCode = result.data.myCode;
        this.account = result.data.mobile;
        let userName = result.data.realName;
        this.realName =
          userName == null || userName == "" ? this.account : userName;
        let introduction = result.data.introduction;
        this.introduction =
          introduction == null || introduction == "" ? "No data" : introduction;
        let petName = result.data.nickName;
        this.nickName =
          petName == null || petName == "" ? this.account : petName;
        this.userStatus = result.data.status;
        this.applyStatus = result.data.applyStatus;
        this.updateApplyStatus(result.data.applyStatus);
        let avatarUrl = result.data.avatarUrl;
        this.avatar = avatarUrl
          ? API.getAvatarAccessPrefix() + avatarUrl
          : API.getDefaultAvatarUrl();
        this.userType = result.data.type;
        if (this.userStatus == 1) {
          this.auditRemind = this.userType == 1 ? "Individual" : "Organization";
        }
        if (this.userStatus == 2) {
          this.auditRemind =
            this.userType == 1
              ? "Under personal review"
              : "Organization audit in progress";
        }
        if (this.userStatus == 3) {
          this.auditRemind =
            this.userType == 1
              ? "Personal authentication failed"
              : "Organization authentication failure";
        }
      });
    },
    // 申请成为藏品铸造者
    releaseApply() {
      this.$router.push({
        path: "/casting",
      });
    },
    handleLinkAuth() {
      if (this.userStatus == 4) {
        this.common.notification(this, "Please wait patiently!", 1);
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
@width: 320px;
@bg: rgba(255, 255, 255, 0.06);
@fz18: 18px;
@fz14: 14px;
@ftb0: #b0b0b0;
@ft7f: #7f7f7f;
.personContentBox {
  display: flex;
  justify-content: space-between;
  min-height: 100vh;
  width: 1186px;
  margin: 0 auto;
  padding: 40px 0;
  .userLeft {
    width: @width;
    .userHeadTop {
      width: 100%;
      border-radius: 16px;
      padding: 24px 0;
      text-align: center;
      background: rgba(255, 255, 255, 0.06);
      .userAvatar {
        width: 56px;
        height: 56px;
        border-radius: 100%;
        overflow: hidden;
        margin: 0 auto 15px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .labelAuth {
    font-size: 12px;
    border-radius: 2px;
    padding: 0 5px;
    margin-left: 10px;
    cursor: pointer;
    &.bgYellow {
      background: #ffa220;
    }
    &.bgGray {
      background: #999999;
    }
  }
  .token {
    color: #000000;
    span {
      line-height: 50px;
      height: 50px;
      padding: 0 10px;
      display: inline-block;
      vertical-align: middle;
      color: #505050;
    }
    img {
      vertical-align: middle;
    }
  }
  .num {
    font-size: @fz18;
  }
  .topRtPc {
    color: #505050;
    margin-top: 10px;
  }
}

.personMenu {
  width: @width;
  background: @bg;
  border-radius: 16px;
  margin-top: 25px;
  padding: 10px 0;
  & > ul > li {
    line-height: 48px;
    &:first-child {
    }
  }
}

.personContent {
  /*flex: 1;*/
  width: 800px;
}

.menuHead {
  padding-left: 25px;
  background: #eaedef;
  font-size: @fz18;
}

.subList {
  li {
    color: @ft7f;
    padding-left: 25px;
    cursor: pointer;
    &:hover,
    &.active {
      background: rgba(255, 255, 255, 0.08);
      color: #000000;
    }
    &.active {
      border-left: 4px solid #000000;
    }
  }
}

@media only screen and (min-width: 100px) and (max-width: 800px) {
  @width: 320px;
}
</style>
