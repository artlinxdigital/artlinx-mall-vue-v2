<template>
  <el-dialog
    title=""
    :visible.sync="visible"
    :width="clientWidth < 800 ? '92%' : '380px'"
    :before-close="handleClose">
    <div class="code-box">
      <img :src="codeUrl" v-if="codeUrl!=''" alt="">
      <vue-qr :logo-src="logoSrc"
          :size="200"
          :margin="20"
          :auto-color="true"
          :dot-scale="1"
          :text="wxSrc"
          v-else
      />
    </div>
    <p class="tip">Please use{{tipTitle}}scan the QR code to complete the payment</p>
  </el-dialog>
</template>

<script>
import VueQr from 'vue-qr';

export default {
  components: {
    VueQr
  },
  props: {
    visible: {
      type: Boolean,
    },
  },
  data() {
    return {
      codeUrl: '',
      tipTitle: 'WeChat',
      timer: null,
      logoSrc: '',
      wxSrc: '',
      clientWidth: 750,
    };
  },
  mounted() {this.getCurrentUser();
    this.$nextTick(() => {
      this.clientWidth = document.documentElement.clientWidth;
    });
  },
  methods: {
    handleClose () {
      this.$emit('update:visible', false);
      if (this.timer) {
        window.clearInterval(this.timer);
      }
      this.codeUrl = '';
    },
    payCodeInfo(payType, codeUrl, timer) {
      console.log("payType：" + payType);
      if (payType === 1) {
        this.tipTitle = 'WeChat';
      }
      if (payType === 2) {
        this.tipTitle = 'Alipay';
      }
      this.timer = timer;
      if (codeUrl.startsWith("weixin://")) {
        this.codeUrl = '';
        this.wxSrc = codeUrl;
      } else {
        this.codeUrl = codeUrl;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.code-box {
  width: 2.2rem;
  height: 2.2rem;
  margin: 0.15rem auto 0.16rem;
  img {
    width: 100%;
    height: 100%;
  }
}
.tip {
  text-align: center;
  font-size: 0.16rem;
  color: #FFFFFF;
}
/deep/.el-dialog__title {
  height: 24px;
  display: inline-block;
}
</style>
