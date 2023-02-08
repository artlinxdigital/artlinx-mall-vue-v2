<template>
  <div class="pcPersonInfo">
    <ul class="infoList">
      <li class="infoLi">
        <div class="infoLiRt avatarUpload">
          <div class="userAvatar">
            <img :src="avatar" alt="" />
          </div>
          <!-- <el-button type="primary" round>Upload your Avatar</el-button> -->
          <el-upload
            action="#"
            accept="image/*"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <el-button type="primary" round>Upload your Avatar</el-button>
          </el-upload>
          <!-- <el-button type="info" style="margin-left: 10px;" @click="delAvatar" round>删除</el-button> -->
        </div>
      </li>
      <li class="infoLi">
        <div class="infoLiLt">User name</div>
        <div class="infoLiRt">
          <div class="infoLiRtL" @click="editNickName">
            {{ userInfo.nickName ? userInfo.nickName : "Not Set" }}
          </div>
          <div class="tip">
            It must contain 4 to 30 characters, including Digits and Chinese
            characters
          </div>
        </div>
      </li>
      <li class="infoLi">
        <div class="infoLiLt">Email</div>
        <div class="infoLiRt">
          <div class="infoLiRtL" @click="editMobile">
            {{ userInfo.mobile ? userInfo.mobile : "Not Set" }}
          </div>
          <div class="tip">It must be an available mobile number or email</div>
        </div>
      </li>

      <li class="infoLi">
        <div class="infoLiLt">My profile</div>
        <div class="infoLiRt">
          <div class="infoLiRtL introduction" @click="editIntroduction">
            {{ userInfo.introduction || "No data" }}
          </div>
          <div class="tip">1 to 140 characters</div>
        </div>
      </li>
      <!--			<li class="infoLi">-->
      <!--				<div class="infoLiLt">My references</div>-->
      <!--				<div class="infoLiRt">-->
      <!--					<div class="infoLiRtL" v-if="userInfo.recommendName === '无'">{{userInfo.recommendName}}</div>-->
      <!--					<div class="reference" v-else ><img :src="recommendAvatarUrl" alt="头像" />{{userInfo.recommendName}}</div>-->
      <!--				</div>-->
      <!--			</li>-->
      <li class="infoLi">
        <div class="infoLiLt" style="font-weight: bold">
          Your wallet address(you can use in Metamask)
        </div>
        <div class="infoLiRt">
          <div class="infoLiRtL">
            <span class="address">{{ address | ellipsisAddress }}</span>
            <el-button
              type="primary"
              class="btnCopy"
              v-clipboard:copy="address"
              v-clipboard:success="onCopy"
              >copy</el-button
            >
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import API from "@/service/index";
import { checkEmail } from "@/utils/rules";
export default {
  inject: ["reload"],
  data() {
    return {
      isPrivateKey: false,
      address: window.localStorage.getItem("walletAddress"),
      privateKey: this.getPrivateKey(),
      sexRadio: 0,
      userInfo: {
        mobile: "",
        realName: "",
        introduction: "",
        nickName: "",
        status: "",
        recommendName: "",
        userStatus: "",
      },
      avatar: API.getDefaultAvatarUrl(),
      recommendAvatarUrl: API.getDefaultAvatarUrl(),
      web3: null,
    };
  },
  filters: {
    ellipsisAddress(value) {
      if (!value) return "";
      if (value.length > 25) {
        return `${value.substring(0, 12)}......${value.substring(
          value.length - 12
        )}`;
      }
      return value;
    },
    ellipsisPrivateKey(value) {
      if (!value) return "";
      let str = "";
      for (let i = 0; i < value.length - 1; i++) {
        str = str + "*";
      }
      // if(value.length > 30) {
      // 	return `${value.substring(0, 9)}********${value.substring(
      //   value.length - 9
      // )}`;
      // }
      return str.substr(1, 40);
    },
  },
  computed: {
    userStatusDesc() {
      switch (this.userInfo.status) {
        case 1:
          return "Have real name";
        case 4:
          return "Under authentication";
        default:
          return "Go to the real-name";
      }
    },
    userStatusShow() {
      switch (this.userInfo.status) {
        case 1:
          return "Have real name";
        case 4:
          return "Under authentication";
        default:
          return "Go KYC";
      }
    },
  },
  watch: {
    "$store.state.wallet.walletConnected": {
      handler(newName, oldName) {
        // console.log("newName:", newName);
        // console.log("oldName:", oldName);
        if (newName) {
          // 钱包连接成功后刷新数据
          this.web3 = this.$store.getters["wallet/web3"];
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true,
    },
  },
  mounted() {this.getCurrentUser();
    // 查询用户信息
    this.getUserInfo();
  },
  methods: {
    hidePrivateKey() {
      this.isPrivateKey = !this.isPrivateKey;
    },
    handleLinkAuth() {
      if (
        this.userInfo.status == 1 ||
        this.userInfo.status == 2 ||
        this.userInfo.status == 4
      ) {
        return;
      }
      this.$router.push({
        path: "/realname",
      });
    },
    // 查询用户信息
    getUserInfo() {
      this.$API
        .getUserInfo({
          certificationId: window.localStorage.getItem("loginId"),
        })
        .then((result) => {
          if (result.code !== 200) {
            this.common.notification(this, "Data loading failure", 3);
            return;
          }
          this.userInfo = result.data;
          var avatarUrl = result.data.avatarUrl;
          this.avatar = avatarUrl
            ? API.getAvatarAccessPrefix() + avatarUrl
            : API.getDefaultAvatarUrl();
          var recommendAvatarUrl = result.data.recommendAvatarUrl;
          this.recommendAvatarUrl = recommendAvatarUrl
            ? API.getAvatarAccessPrefix() + recommendAvatarUrl
            : API.getDefaultAvatarUrl();
        });
    },
    // 修改昵称
    editNickName() {
      this.$prompt("Nickname", "Change nickname", {
        inputValue: this.userInfo.nickName,
        inputPlaceholder: "Please enter a nickname",
        confirmButtonText: "confirm",
        cancelButtonText: "cancel",
        inputValidator: (val) => !!val,
        inputErrorMessage: "Please enter nickname information",
      }).then(({ value }) => {
        this.updateNickname(value);
      });
    },
    // 修改mobile
    editMobile() {
      this.$prompt("Email", "Change email", {
        inputValue: this.userInfo.mobile,
        inputPlaceholder: "Please enter a email",
        confirmButtonText: "confirm",
        cancelButtonText: "cancel",
        inputValidator: (val) => {
          return checkEmail(val);
        },
        inputErrorMessage: "Please enter the correct email address！",
      }).then(({ value }) => {
        this.updateMobile(value);
      });
    },
    // 修改昵称接口调用
    updateNickname(nickName) {
      this.$API
        .updateNickName({
          certificationId: window.localStorage.getItem("loginId"),
          nickName,
        })
        .then((result) => {
          if (result.code !== 200) {
            this.common.notification(
              this,
              "fail in keeping, Please wait for a moment！",
              3
            );
            return;
          }
          this.userInfo.nickName = nickName;
          this.common.notification(this, "Successful preservation！", 1);
        });
    },
    // 修改昵称接口调用
    updateMobile(mobile) {
      this.$API
        .updateMobile({
          id: window.localStorage.getItem("loginId"),
          mobile: mobile,
        })
        .then((result) => {
          if (result.code !== 200) {
            this.common.notification(
              this,
              "fail in keeping, Please wait for a moment！",
              3
            );
            return;
          }
          this.userInfo.mobile = mobile;
          this.common.notification(this, "Successful preservation！", 1);
        });
    },
    // 编辑introduction
    editIntroduction() {
      this.$prompt("My profile", "Change my profile", {
        inputValue: this.userInfo.introduction,
        inputType: "textarea",
        inputPlaceholder: "It will show me what am I.",
        confirmButtonText: "confirm",
        cancelButtonText: "cancel",
        inputValidator: (val) => 0 < val.length && val.length < 140,
        inputErrorMessage: "Please enter 0-140 characters my profile",
      }).then(({ value }) => {
        this.updateIntroduction(value);
      });
    },
    // 修改introduction接口调用
    // 编辑用户introduction
    updateIntroduction(desc) {
      this.$API
        .updateIntroduction({
          certificationId: window.localStorage.getItem("loginId"),
          desc,
        })
        .then((result) => {
          if (result.code !== 200) {
            this.common.notification(
              this,
              "fail in keeping, Please wait for a moment！",
              3
            );
            return;
          }
          this.userInfo.introduction = desc;
          this.common.notification(this, "Successful preservation！", 1);
        });
    },
    onCopy() {
      this.$notify.success({
        title: "",
        message: "Copied success！",
      });
      // this.isPrivateKey = !this.isPrivateKey
    },
    // 覆盖默认的上传行为
    requestUpload() {},
    // 上传预处理
    beforeUpload(file) {
      if (file.type.indexOf("image/") == -1) {
        this.common.notification(
          this,
          "File format error, please upload the image type, such as: JPG, PNG file suffix.",
          3
        );
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.avatar = reader.result;
          let formData = new FormData();
          formData.append("avatarFile", file);
          formData.append("certificationId", window.localStorage.getItem("loginId"));
          this.$API.updateAvatar(formData).then((result) => {
            console.log("头像上传结果：" + JSON.stringify(result));
            if (result.code !== 200) {
              this.common.notification(
                this,
                "fail to upload, Please wait for a moment！",
                3
              );
              return;
            }
            console.log(API.getAvatarAccessPrefix() + result.data);
            this.avatar = API.getAvatarAccessPrefix() + result.data;
            this.common.notification(this, "successfully upload！", 1);
            this.reload();
          });
        };
      }
    },
    // 删除头像
    delAvatar() {
      let formData = new FormData();
      formData.append("certificationId", window.localStorage.getItem("loginId"));
      this.$API.delAvatar(formData).then((result) => {
        console.log("头像删除结果：" + JSON.stringify(result));
        if (result.code !== 200) {
          this.common.notification(
            this,
            "Delete failed, Please wait for a moment！",
            3
          );
          return;
        }
        this.avatar = API.getDefaultAvatarUrl();
        this.common.notification(this, "deleted successfully！", 1);
        this.reload();
      });
    },
  },
};
</script>

<style lang="less" scoped>
@bg: rgba(255, 255, 255, 0.08);
@fz18: 18px;
@fz14: 14px;
@fz12: 12px;
@radius8: 8px;
@rtWidth: 520px;
.infoLi {
  margin-top: 10px;
  .infoLiLt {
    font-size: @fz14;
    line-height: 40px;
  }
  .infoLiRtL {
    font-size: @fz14;
    width: @rtWidth;
    //background: @bg;
    border: 1px solid #000000;
    padding: 10px;
    border-radius: @radius8;
    position: relative;
    &.introduction {
      line-height: 22px;
      height: 130px;
      overflow-y: auto;
    }
  }
  .tip {
    color: #b0b0b0;
    font-size: @fz12;
    line-height: 40px;
  }
  .btnCopy {
    border: none;
    color: #000000;
    background: none;
    padding: 0;
    width: 60px;
    height: 40px;
    position: absolute;
    top: 0;
    right: 0;
  }
}

.userAvatar {
  width: 96px;
  height: 96px;
  overflow: hidden;
  border-radius: 100%;
  margin-right: 30px;
  img {
    width: 100%;
    height: 100%;
  }
}

.reference {
  background: rgba(255, 255, 255, 0.08);
  padding: 0 20px;
  height: 48px;
  line-height: 48px;
  border-radius: 24px;
  display: -webkit-inline-flex;
  /* Safari */
  display: inline-flex;
  justify-content: flex-start;
  align-content: center;
  img {
    width: 32px;
    height: 32px;
    border-radius: 100%;
    position: relative;
    top: 8px;
    margin-right: 10px;
  }
}

.avatarUpload {
  display: -webkit-flex;
  /* Safari */
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.right40 {
  right: 40px !important;
}
</style>
