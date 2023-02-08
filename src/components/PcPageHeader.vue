<template>
  <div class="pcHeader">
    <div class="headContent">
      <div class="logoSlogan" @click="$router.push('/')">
        <span class="logo"></span>
        <span class="slogan mPage">Global Digital Art Marketplace</span>
      </div>
      <div class="headRt" v-if="showRt">
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
            @click.native="handleSearch"
          >
            <i class="el-icon-search iconSearch"></i
          ></el-button>
        </div>
        <el-button
          class="login"
          v-if="account == ''"
          @click.native="pushUrl('/login')"
        >
          Connect
        </el-button>
        <!-- <el-button
          class="Register"
          v-if="account == ''"
          @click.native="pushUrl('/register')"
        >
          Sign up
        </el-button> -->

        <div class="mPage personalInfor">
          <el-dropdown @command="handleCommand" v-if="account != ''">
            <div class="headUserInfo" v-if="account != ''">
              <el-image class="headAvatar" :src="avatar" fit="cover"></el-image>
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
          <div
            class="btnMakeCreate"
            ref="dragRef"
            id="drag"
            draggable="true"
            v-if="account != ''"
            @click.stop.prevent="toImportCollection"
          >
            Import
          </div>
          <MTipModal
            :visible.sync="tipVisible"
            title="warm prompt"
            :content="content"
            cancelTxt="cancel"
            :confirmTxt="confirmTxt"
            @close="tipVisible = false"
            @ok="toConfirm"
          />
        </div>

        <div class="pcPage personalInfor">
          <el-dropdown @command="handleCommand" v-if="account != ''">
            <div class="headUserInfo">
              <el-image class="headAvatar" :src="avatar" fit="cover"></el-image>
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
          <div class="makeCreate" v-if="account != ''">
            <MakeCreate />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MTipModal from "@/components/MTipModal";
import MakeCreate from "@/components/MakeCreate";
import API from "@/service/index";
import { mapActions } from "vuex";
export default {
  props: {
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
      // account: $store.state.wallet.walletAddress,
      keyword: "",
      tipVisible: false,
      content: "",
      confirmTxt: "",
      avatar: API.getDefaultAvatarUrl(),
      account: "",
    };
  },
  watch: {
    "$store.state.wallet.walletConnected": {
      handler(newName, oldName) {
        // console.log("newName:", newName);
        // console.log("oldName:", oldName);
        if (newName) {
          // 钱包连接成功后刷新数据
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true,
    },
    "$store.state.wallet.walletAddress": {
      handler(newName, oldName) {
        // console.log("newName:", newName);
        // console.log("oldName:", oldName);
        if (newName != "" && newName != undefined) {
          this.account = newName;
        } else {
          this.account = "";
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true,
    },
  },
  mounted() {
    this.getCurrentUser();
    const walletAddress = window.localStorage.getItem("walletAddress");
    if (walletAddress == "") {
      return;
    }
    // 获取用户信息
    API.getUserInfo({
      certificationId: window.localStorage.getItem("loginId"),
    })
      .then((res) => {
        // this.userStatus = parseInt(res.data.status);
        // this.applyStatus = parseInt(res.data.applyStatus);
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
    // ...mapActions("wallet", ["getCurrentUser"]),
    // 搜索框填充内容
    fillSearch(keyword) {
      this.keyword = keyword;
    },
    pushUrl(path) {
      this.$router.push({
        path,
      });
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
        query: { fresh: "1" },
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
  height: 60px;
  @media screen and (max-width: 800px) {
    height: 1.5rem;
  }
}

.headContent {
  height: 60px;
  .flexCenter();
  justify-content: space-between;
  width: 1186px;
  margin: 0 auto;
  @media screen and (max-width: 800px) {
    height: 100%;
    max-width: 100%;
    flex-direction: column;
    align-items: baseline;
  }
}

.headRt {
  .flexCenter();
  @media screen and (max-width: 800px) {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.3rem;
  }
}

.personalInfor {
  .flexCenter();
}

.personalInfor.mPage {
  @media screen and (min-width: 800px) {
    display: none;
  }
}

.personalInfor.pcPage {
  @media screen and (max-width: 800px) {
    display: none;
  }
}

.logoSlogan {
  .flexCenter();
  cursor: pointer;
  @media screen and (max-width: 800px) {
    //padding: 0.4rem 0 0.3rem 0.15rem;
    font-size: 0.16rem;
  }
  .logo {
    .flexCenter();
    &::before {
      content: "";
      background: url("../assets/images/logo_vertical.png") no-repeat left
        center;
      @media screen and (max-width: 800px) {
        margin-right: 0.5rem;
        width: 0.96rem;
        height: 0.96rem;
        margin-right: 0.11rem;
        margin-left: 0.11rem;
        background-size: 0.96rem auto;
      }
      @media screen and (min-width: 800px) {
        width: 160px;
        height: 40px;
        background-size: auto 40px;
      }
    }
  }
  .slogan {
    @media screen and (max-width: 800px) {
      font-size: 0.16rem;
      margin-left: 0;
    }
  }
  i {
    display: none;
    @media screen and (max-width: 800px) {
      display: inline-flex;
      margin-left: 0.17rem;
    }
  }
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
  margin: 0 10px;
  span {
    height: 32px;
    line-height: 32px;
  }
}

.login {
  background: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  @media screen and (max-width: 800px) {
  }
}

.Register {
  background: #000000;
  border-radius: 16px;
  /deep/ span {
    font-size: 14px;
  }
  @media screen and (max-width: 800px) {
    padding: 0 0.18rem;
    height: 0.32rem;
    line-height: 0.32rem;
    margin-left: 0;
    margin-right: 0.05rem;
    border-radius: 0.16rem;
    /deep/ span {
      font-size: 0.14rem;
      height: 0.32rem;
      line-height: 0.32rem;
    }
  }
}

.searchBox {
  position: relative;
  .flexCenter();
  width: 920px;
  height: 32px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  .btnSearch {
    position: absolute;
    border: none;
    background: rgba(255, 255, 255, 0);
    right: 0;
    .iconSearch {
      font-size: 14px;
      @media screen and (max-width: 800px) {
        font-size: 0.12rem;
      }
    }
  }
  input {
    width: 100%;
    height: 100%;
    padding: 0 40px 0 10px;
    border: 1px solid #505050;
    color: #000000;
    outline: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    @media screen and (max-width: 800px) {
      padding: 0 0.5rem 0 0.1rem;
      border-radius: 0.16rem;
      font-size: 0.14rem;
    }
  }
  @media screen and (max-width: 800px) {
    width: 2.64rem;
    height: 0.32rem;
    line-height: 0.32rem;
    border-radius: 0.16rem;
    flex: 1;
    margin-left: 0.15rem;
    background: rgba(255, 255, 255, 0.1);
    input {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.16rem;
    }
  }
}

.headUserInfo {
  display: flex;
  align-items: center;
  margin-right: 0;
  cursor: pointer;
  @media screen and (max-width: 800px) {
    max-width: 2.55rem;
    margin-left: 0.1rem;
    margin-right: 0.1rem;
  }
  .headAvatar {
    width: 36px;
    height: 36px;
    margin-right: 0;
    margin-left: 20px;
    border-radius: 100%;
    @media screen and (max-width: 800px) {
      width: 0.32rem;
      height: 0.32rem;
      margin-left: 0;
    }
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

.btnMakeCreate {
  height: 32px;
  line-height: 32px;
  color: #ffffff;
  cursor: pointer;
  padding: 0 20px;
  border: none;
  font-weight: 400;
  background: #2a513f;
  border-radius: 16px;
  font-size: 14px;
  margin-left: 10px;
  @media screen and (max-width: 800px) {
    padding: 0 0.16rem;
    height: 0.32rem;
    line-height: 0.32rem;
    margin-right: 0.15rem;
    border-radius: 0.16rem;
    font-size: 0.14rem;
  }
}
</style>
