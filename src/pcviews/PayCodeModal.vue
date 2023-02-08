<template>
  <el-dialog
    title=""
    :visible.sync="visible"
    width="4.3rem"
    :before-close="handleClose"
  >
    <div class="code-box">
      <img :src="codeUrl" v-if="codeUrl != ''" alt="" />
      <vue-qr
        :logo-src="logoSrc"
        :size="200"
        :margin="20"
        :auto-color="true"
        :dot-scale="1"
        :text="wxSrc"
        v-else
      />
    </div>
    <p class="tip">
      please use {{ tipTitle }} Scan the QR code to complete the payment</p>
  </el-dialog>
</template>

<script>
import VueQr from "vue-qr";

export default {
  components: {
    VueQr,
  },
  props: {
    visible: {
      type: Boolean,
    },
  },
  data() {
    return {
      codeUrl: "",
      tipTitle: "wechat",
      timer: null,
      logoSrc: "",
      wxSrc: "",
    };
  },
  mounted() {this.getCurrentUser();},
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
      if (this.timer) {
        window.clearInterval(this.timer);
      }
      this.codeUrl = "";
    },
    payCodeInfo(payType, codeUrl, timer) {
      console.log("payType：" + payType);
      if (payType === 1) {
        this.tipTitle = "wechat";
      }
      if (payType === 2) {
        this.tipTitle = "Alipay";
      }
      this.timer = timer;
      if (codeUrl.startsWith("weixin://")) {
        this.codeUrl = "";
        this.wxSrc = codeUrl;
      } else {
        this.codeUrl = codeUrl;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.code-box {
  width: 2.54rem;
  height: 2.54rem;
  margin: 0.15rem auto 0.16rem;
  img {
    width: 100%;
    height: 100%;
  }
  div {
    width: 100%;
    height: 100%;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
  }
}
.tip {
  text-align: center;
  font-size: 0.21rem;
  color: #000000;
}
/deep/.el-dialog__title {
  height: 24px;
  display: inline-block;
}
</style>
