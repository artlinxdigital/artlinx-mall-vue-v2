<template>
  <div class="pageContainer editInfo">
    <MPageHeader title="Edit Profile">
      <!-- <el-button type="text" size="mini" class="btnSave">保存</el-button> -->
    </MPageHeader>
    <div class="headAvatar">
      <div class="avatarBox">
        <el-image
          class="fillImg"
          :src="avatarUrl"
          fit="cover"></el-image>
        <span class="iconEditImg">
          <i class="el-icon-edit"></i>
        </span>
      </div>
    </div>
    <ul class="actionNavs">
      <li class="navItem" @click="$router.push('/edit-nickname')">
        <span class="navItemLt">User name</span>
        <span class="navItemRt">{{nickName}}<i class="el-icon-arrow-right"></i></span>
      </li>
      <!-- <li class="navItem">
        <span class="navItemLt">性别</span>

        <span class="navItemRt">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              {{showName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in dropdownTypes"
                :key="item.type"
                :command="item.type"
                :class="{activeDropMenu: item.type === dropdownType}"
              >{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </li> -->
      <li class="navItem" @click="$router.push('/edit-desc')">
        <span class="navItemLt">My profile</span>
        <span class="navItemRt"><i class="el-icon-arrow-right"></i></span>
      </li>
      <li class="navItem" @click="handleLinkAuth">
        <span class="navItemLt">KYC</span>
        <span class="navItemRt">{{userStatusDesc}}<i class="el-icon-arrow-right"></i></span>
      </li>
      <li class="navItem">
        <span class="navItemLt">My account</span>
        <span class="navItemRt">{{account}}</span>
      </li>
      <li class="navItem">
        <span class="navItemLt">My references</span>
        <span class="navItemRt">{{recommendName}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import MPageHeader from "@/components/MPageHeader";
import API from "@/service";

export default {
  components: {
    MPageHeader
  },
  data () {
    return {
      dropdownTypes: [
        {
          name: "man",
          type: 0,
        },
        {
          name: "woman",
          type: 1,
        },
      ],
      dropdownType: 0,
      showName: 'man',
      account: '',
      realName: '',
      nickName: '',
      userStatus: 1,
      userStatusDesc: '',
      recommendName: '无',
      avatar: API.getDefaultAvatarUrl(),
    }
  },
  mounted() {this.getCurrentUser();
    // 查询用户信息
    this.getUserInfo();
  },
  methods: {
    // 查询用户信息
    getUserInfo() {
        API.getUserInfo({ certificationId: window.localStorage.getItem("loginId") }).then(result => {
            if (result.code !== 200) {
              this.common.notification(this, "Data loading failure", 3);
              return;
            }
            // console.log("用户信息：" + JSON.stringify(result));
            this.account = result.data.mobile;
            let userName = result.data.realName;
            this.realName = (userName == null || userName == '') ? this.account : userName;
            this.introduction = result.data.introduction;
            let petName = result.data.nickName;
            this.nickName = (petName == null || petName == '') ? 'To set up' : petName;
            this.userStatus = result.data.status;
            this.recommendName = result.data.recommendName;
            if (this.userStatus == 1) {
                this.userStatusDesc = "Have real name";
            } else if (this.userStatus == 4) {
                this.userStatusDesc = "Under authentication";
            } else {
                this.userStatusDesc = "Go to the real-name";
            }
            var avatarUrl = result.data.avatarUrl;
					  this.avatar = avatarUrl ? API.getAvatarAccessPrefix() + avatarUrl : API.getDefaultAvatarUrl();
        });
    },
    handleCommand(command) {
      this.dropdownType = command;
      this.showName = this.dropdownTypes.find(item => item.type === command).name;
    },
    handleLinkAuth () {
      if (this.userStatus == 1 || this.userStatus == 2) {
        this.$router.push({
          path: '/realname-info',
        });
        return;
      }
      if (this.userStatus == 4) {
        this.common.notification(this, "Please wait patiently!", 1);
        return;
      }
      this.$router.push({
        path: '/realname',
      });
    }
  }
}
</script>

<style lang="less" scoped>
.editInfo {
  /deep/ .headRight {
    top: 0.2rem;
  }
  .btnSave {
    padding: 0;
    /deep/ span {
      font-size: 0.26rem;
    }
  }
  .headAvatar {
    margin: 0.84rem 0;
    text-align: center;
  }
  .avatarBox {
    position: relative;
    width: 1.2rem;
    height: 1.2rem;
    margin: 0 auto;
    border-radius: 100%;
    .fillImg {
      border-radius: 100%;
    }
    .iconEditImg {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 0.34rem;
      height: 0.34rem;
      right: 0;
      bottom: 0;
      background: #eee;
      border-radius: 100%;
      i {
        font-size: 0.18rem;
        color: #686868;
      }
    }
  }
  .actionNavs {
    padding: 0 0.24rem;
  }
  .navItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.33rem 0;
    border-bottom: 1px solid #eee;
    &:last-child {
      border-bottom: 0;
    }
  }
  .navItemLt {
    font-size: 0.28rem;
    color: #333;
    font-weight: 500;
  }
  .navItemRt {
    font-size: 0.26rem;
    color: #666;
    font-weight: 500;
    i {
      margin-left: 0.22rem;
      color: #787878;
    }
  }
}

</style>
