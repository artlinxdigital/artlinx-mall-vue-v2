<template>
  <div class="pageContainer authSuccess">
    <PcPageHeader />
    <div class="authFailWrap">
      <div class="successIco"></div>
      <p class="successTxt">KYC successful!</p>
      <div class="subTitle">
        <span> congratulations!</span>
        <p>
          You have completed the real-name authentication. You can go back to
          view it.
        </p>
      </div>
      <div class="fixedBtn">
        <el-button type="primary" class="btnFlex" @click="toPersonalCenter"
          >finish</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import PcPageHeader from "@/components/PcPageHeader";
import API from "@/service/index";
import { faceAuthErrMsg } from "@/utils/rules";

export default {
  components: {
    PcPageHeader,
  },
  data() {
    return {
      errMsssage: "",
      code: -1,
    };
  },
  mounted() {
    this.getCurrentUser();
    this.code = this.$route.query.code;
    console.log("query: " + JSON.stringify(this.$route.query));
    console.log("code: " + this.code);

    //人脸认证成功
    if (this.code) {
      if (this.code == 0 || this.code === "0") {
        //暂不用这些参
        let orderNo = this.$route.query.orderNo;
        this.faceAuthForH5Person(orderNo);
      } else {
        this.errMsssage = faceAuthErrMsg(this.code + "");
        this.errMsssage = this.errMsssage
          ? this.errMsssage
          : "Authentication failure";
        this.common.notification(this, this.errMsssage, 3);
        this.$router.push({
          path: "/auth-fail",
        });
      }
    } else {
      const walletAddress = window.localStorage.getItem("walletAddress");
      if (walletAddress == "") {
        this.$router.push({
          path: "/login",
        });
        return;
      }
      this.$router.push({
        path: "/",
      });
    }
  },
  methods: {
    // 人脸识别回调
    faceAuthForH5Person(orderNo) {
      API.faceAuthenticationForH5Person({
        type: 1,
        orderNo: orderNo,
        isLand: 1,
        invitorAmount: 50,
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(this, result.msg, 3);
          this.$router.push({
            path: "/auth-fail",
          });
        }
      });
    },
    // go backProfile
    toPersonalCenter() {
      const walletAddress = window.localStorage.getItem("walletAddress");
      if (walletAddress == "") {
        this.$router.push({
          path: "/",
        });
        return;
      }
      this.$router.push({
        path: "/personal",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.authFailWrap {
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 0.16rem;
  backdrop-filter: blur(0.18rem);
  @media screen and (max-width: 800px) {
    width: auto;
    margin: 0 0.16rem;
    padding: 0 0.16rem 0.4rem;
  }
}
.authSuccess {
  text-align: center;
}
.successIco {
  width: 2.4rem;
  height: 1.6rem;
  margin: 1.5rem auto 0.6rem;
  background: url("../assets/images/cg@2x.png") no-repeat center;
  background-size: cover;
}
.successTxt {
  margin-bottom: 0.24rem;
  font-size: 0.24rem;
  color: #000000;
  font-weight: 500;
}
.subTitle {
  span,
  p {
    font-size: 0.16rem;
    line-height: 0.32rem;
    color: #000000;
  }
}
.fixedBtn {
  margin: 0.3rem auto 0.8rem;
  .btnFlex {
    // width: 100%;
  }
}
</style>
