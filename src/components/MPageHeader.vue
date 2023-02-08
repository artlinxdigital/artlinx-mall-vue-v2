<template>
  <div class="pcHeader">
    <div class="headContent">
      <div class="headRt" v-if="showRt">
        <i class="el-icon-arrow-left" @click="$router.go(-1)"></i>
        <div class="searchBox">
          <input
            class="searchInput"
            type="search"
            v-model="keyword"
            @keyup.enter="handleSearch"
            placeholder="Search items, collections, and accounts"
          />
          <el-button
            type="primary"
            size="mini"
            class="btnSearch"
            @click="handleSearch"
          >
            <i class="el-icon-search iconSearch"></i
          ></el-button>
        </div>
        <el-button
          class="login"
          v-if="account == ''"
          @click="$router.push('/login')"
        >
          Connect
        </el-button>
        <el-button
          class="Register"
          v-if="account == ''"
          @click="$router.push('/register')"
        >
          Sign up
        </el-button>

        <div class="mPage personalInfor">
          <el-dropdown @command="handleCommand" v-if="account != ''">
            <div
              class="headUserInfo"
              v-if="account != ''"
              @click="$router.push('/personal')"
            >
              <el-image
                class="headAvatar"
                :src="avatar"
                fit="cover"
              ></el-image>
              <span class="nameInfo">{{ account | ellipsisAccount }}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item></el-dropdown-item>
              <el-dropdown-item command="person" icon="el-icon-user"
                >Profile</el-dropdown-item
              >
              <el-dropdown-item command="logout" icon="el-icon-switch-button"
                >Logout</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <div
            class="btnMakeCreate"
            ref="dragRef"
            id="drag"
            draggable="true"
            v-if="account != ''"
            @click.stop.prevent="toCreateCollection"
          >
            Mint
          </div>
          <MTipModal
            :visible.sync="tipVisible"
            title="Tips"
            :content="content"
            cancelTxt="cancel"
            :confirmTxt="confirmTxt"
            @close="tipVisible = false"
            @ok="toConfirm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MTipModal from "@/components/MTipModal";
import MakeCreate from "@/components/MakeCreate";
import API from "@/service/index";
export default {
  props: {
    account: String,
    /** 是否展示右侧（有的页面不需要展示） */
    showRt: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  components: {
    MakeCreate,
    MTipModal,
  },
  data() {
    return {
      keyword: "",
      tipVisible: false,
      content: "",
      confirmTxt: "",
      userStatus: 1,
      applyStatus: -1,
      avatar: API.getDefaultAvatarUrl(),
    };
  },
  mounted() {
    this.getCurrentUser();
    const walletAddress = window.localStorage.getItem("walletAddress");
    if (walletAddress == "") {
      this.$router.push({
        path: "/login",
      });
      return;
    }
    // 获取用户信息
    API.getUserInfo({ certificationId: window.localStorage.getItem("loginId") })
      .then((res) => {
        // this.userStatus = parseInt(res.data.status);
        this.applyStatus = parseInt(res.data.applyStatus);
        var avatarUrl = res.data.avatarUrl;
        this.avatar = avatarUrl
          ? API.getAvatarAccessPrefix() + avatarUrl
          : API.getDefaultAvatarUrl();
      })
      .catch((err) => {
        console.error(err);
      });
  },
  methods: {
    // 搜索框填充内容
    fillSearch(keyword) {
      this.keyword = keyword;
    },
    handleSearch() {
      this.$emit("search", this.keyword);
    },
    handleCommand(command) {
      if (command === "person") {
        this.$router.push("/personal");
      }
      if (command === "logout") {
        this.$confirm("Are you sure logout?", "Tips", {
          confirmButtonText: "confirm",
          cancelButtonText: "cancel",
          type: "warning",
        }).then(() => {
          this.toQuit();
        });
      }
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

      // if(this.applyStatus === -1 || this.applyStatus === 2) {
      // 	this.content = "由于您暂未申请成为铸造者, 还没有铸造权限, 请知晓。";
      // 	this.confirmTxt = "申请成为铸造者";
      // 	this.tipVisible = true;
      // 	return;
      // }
      // if(this.applyStatus === 0) {
      // 	this.common.notification(this, "您的铸造权限申请正在审核中, 请耐心等待!", 2);
      // 	return;
      // }
      this.$router.push({
        path: "/casting",
      });
    },
    // 去实名或者去申请成为铸造者
    toConfirm() {
      if (this.userStatus !== 1) {
        if (this.$route.path === "/realname") {
          this.tipVisible = false;
        } else {
          this.$router.push({
            path: "/realname",
          });
        }
        return;
      }
      // if(this.applyStatus !== 1) {
      // 	this.$router.push({
      // 		path: "/personal",
      // 	});
      // 	return;
      // }
    },
    // 退出登录
    toQuit() {
      // 清除数据
      localStorage.clear();
      sessionStorage.clear();
      // 跳转登录页面
      this.$router.push({
        path: "/login",
      });
    },
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
};
</script>

<style lang="less" scoped>
.flexCenter {
  display: flex;
  align-items: center;
}

.pcHeader {
  color: #000000;
  height: 0.7rem;
}

.el-icon-arrow-left {
  font-size: 0.25rem;
  color: #999999;
  margin-left: 0.1rem;
}

.headContent {
  margin-top: 0.5rem;
  width: 100%;
}

.headRt {
  .flexCenter();
  width: 100%;
  justify-content: space-between;
}

.personalInfor {
  .flexCenter();
}

.Register,
.login {
  height: 32px;
  line-height: 32px;
  color: #ffffff;
  cursor: pointer;
  padding: 0 20px;
  border: none;
  font-weight: 400;
  border-radius: 16px;
}

.login {
  background: #ffffff;
  color: #000000;
  border: 1px solid #000000;
}

.Register {
  background: #000000;
  border-radius: 16px;
  /deep/ span {
    font-size: 14px;
  }
  @media screen and (max-width: 800px) {
    padding: 0 0.16rem;
    height: 0.32rem;
    line-height: 0.32rem;
    margin-left: 0rem;
    margin-right: 0.05rem;
    border-radius: 0.16rem;
    /deep/ span {
      font-size: 0.14rem;
      line-height: 0.32rem;
    }
  }
}

.searchBox {
  flex: 1;
  position: relative;
  .flexCenter();
  width: 2rem;
  height: 0.32rem;
  line-height: 0.32rem;
  margin-left: 0.1rem;
  border-radius: 0.16rem;
  background: rgba(255, 255, 255, 0.1);
  .btnSearch {
    position: absolute;
    border: none;
    background: rgba(255, 255, 255, 0);
    right: 0;
    .iconSearch {
      font-size: 0.1rem;
    }
  }
  input {
    width: 100%;
    height: 100%;
    color: #000000;
    border: 1px solid #505050;
    outline: none;
    background: rgba(255, 255, 255, 0.1);
    padding: 0 0.5rem 0 0.15rem;
    border-radius: 0.16rem;
    font-size: 0.14rem;
  }
}

.headUserInfo {
  display: flex;
  align-items: center;
  cursor: pointer;
  max-width: 2.55rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  .headAvatar {
    width: 0.32rem;
    height: 0.32rem;
    margin: 0;
    border-radius: 100%;
  }
  .nameInfo {
    display: none;
  }
}

.makeCreate {
  display: inline-block;
  margin-left: 20px;
  vertical-align: middle;
}

.searchInput {
  font-size: 0.16rem;
}

.btnMakeCreate {
  color: #ffffff;
  cursor: pointer;
  border: none;
  font-weight: 400;
  background: #2a513f;
  padding: 0 0.16rem;
  height: 0.32rem;
  line-height: 0.32rem;
  margin-right: 0.15rem;
  margin-left: 10px;
  border-radius: 0.16rem;
  font-size: 0.14rem;
}
</style>
