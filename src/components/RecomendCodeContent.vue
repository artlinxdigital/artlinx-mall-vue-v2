<template>
  <div class="codeBoxIn">
        <div class="avatarBox">
          <img :src="avatar" alt="">
        </div>
        <span class="userName">{{realName | ellipsisAccount}}</span>
        <div class="codeInfo">
          <div class="myCodeTitle">Referral Code</div>
          <div class="myCode">{{recommendCode}}</div>
          <div class="recodeBox" id="recommendCodeQRCode" ref="recommendCodeQRCode">
            <!-- <img src="" alt=""> -->
            <vue-qr :logo-src="logoSrc"
                :size="150"
                :margin="20"
                :auto-color="true"
                :dot-scale="1"
                :text="wxSrc"
            />
          </div>
          <p class="shareTip">Share links with friends and play NFT together</p>
        </div>
        <div class="btns">
          <button class="btnSave" @click="savePic">Save qr code</button>
          <button class="btnShare" v-clipboard:copy="linkUrl" v-clipboard:success="onShare">Copy Link</button>
        </div>
      </div>
</template>

<script>
import QRCode1 from "qrcodejs2";
import Vue from 'vue';
import { projectUrl } from '@/service/config';
import VueQr from 'vue-qr';


export default {
  components: {
    VueQr
  },
  props: {
    realName: String,
    recommendCode: String,
    avatar: String
  },
  data () {
    return {
      linkUrl: '',
      logoSrc: '',
      wxSrc: ''
    }
  },
  filters: {
    ellipsisAccount(value) {
        if (!value) return "";
        if (value.length > 10) {
            return `${value.substring(0, 3)}****${value.substring(value.length - 4)}`;
        }
        return value;
    }
  },
  mounted() {this.getCurrentUser();
    this.$nextTick(() => {
      this.createRecommendCodeQRCode();
    });
  },
  methods: {
    // 生成推荐码二维码
    createRecommendCodeQRCode() {
      // let dom = document.getElementById("recommendCodeQRCode");
      // document.getElementById("recommendCodeQRCode").innerHTML = "";
      // new QRCode1(dom, {
      //     text: this.recommendCode,
      //     width: 150,
      //     height: 150,
      //     colorDark: "#333333", //二维码颜色
      //     colorLight: "#ffffff", //二维码背景色
      //     correctLevel: QRCode1.CorrectLevel.L //容错率，L/M/H
      // });
      this.wxSrc = `${projectUrl.dev}` + "/register?recommendCode=" + this.recommendCode;
      // 分享链接
      this.shareLink();
    },
    // 保存图片
    savePic() {
      // let canvasDom = document.getElementById('recommendCodeQRCode').getElementsByTagName('canvas');
      var imgSrc = document.getElementById('recommendCodeQRCode').getElementsByTagName('img')[0].src;
      let a = document.createElement('a');
      // a.href = canvasDom[0].toDataURL('image/png');
      a.href = imgSrc;
      a.download = 'Referral Code';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
      // this.common.notification(this, "If the download fails, you are advised to hold down to save the QR code！", 1);
      // this.$message.success({
      //   message: '正在下载保存',
      //   type: 'success'
      // });
      // this.savePicture(canvasDom[0].toDataURL('image/png'));
    },
    shareLink() {
      this.linkUrl = `${projectUrl.dev}` + "/register?recommendCode=" + this.recommendCode;
      console.log("Sharing link Information：" + this.linkUrl);
    },
    onShare () {
      this.common.notification(this, "Copied success！", 1);
    }
  }
}
</script>

<style lang="less" scoped>
.codeBoxIn {
  background: #fff;
  text-align: center;
  @media screen and (max-width: 800px) {
    position: absolute;
    height:5.5rem;
    background: url('../assets/images/code_bg.png') no-repeat center center;
    background-size: contain;
    top: -0.43rem;
    left: 0;
    right: 0;
    z-index: 2;
  }
}
.topDashed {
  position: absolute;
  width: 3.17rem;
  border:1px dashed #000000;
  top: 0.23rem;
  left: 0.15rem;
  right: 0.15rem;
  z-index: 3;
}
.centerDshed {
  position: absolute;
  width: 3.17rem;
  border: 0.01rem dashed #000000;
  top: 1.6rem;
  left: 0.15rem;
  right: 0.15rem;
  z-index: 3;
}
.avatarBox {
  @media screen and (min-width: 800px) {
    display: none;
  }
  @media screen and (max-width: 800px) {
    width: 0.7rem;
    height: 0.7rem;
    margin: 0.43rem auto 0.15rem;
    border-radius: 100%;
    background: #eee;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}
.userName {
  display: none;
  @media screen and (max-width: 800px) {
    display: initial;
    font-size: 0.17rem;
    color: #333;
  }
}
.codeInfo {
  margin-top: 0.16rem;
  @media screen and (max-width: 800px) {
    margin-top: 0.15rem;
  }
  .myCodeTitle {
    margin-bottom: 0.16rem;
    font-size: 0.14rem;
    font-weight: bold;
    color: #333;
    font-weight: 500;
    @media screen and (min-width: 800px) {
      margin-bottom:20px;
      font-size:25px;
    }
  }
  .myCode {
    margin-bottom: 0.09rem;
    font-size: 0.3rem;
    color: #333;
    font-weight: bold;
    @media screen and (min-width: 800px) {
      margin-bottom:12px;
      font-size:30px;
    }
  }
  .recodeBox {
    width:1.65rem;
    height: 1.65rem;
    margin: 0 auto 0.07rem;
    padding: 0.05rem;
    background: #eee;
    text-align: center;
    @media screen and (min-width: 800px) {
      width:150px;
      height:150px;
      padding:5px;
      margin: 0 auto 25px;
    }
    /deep/ img {
      width: 100%;
      height: 100%;
    }
  }
}
.shareTip {
  margin-bottom: 0.3rem;
  font-size: 0.14rem;
  color: #333;
  @media screen and (min-width: 800px) {
    margin-bottom: 24px;
    font-size: 17px;
  }
}
.btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.35rem;
  @media screen and (min-width: 800px) {
    justify-content: center;
  }
}
.btnSave {
  width: 1.3rem;
  height: 0.4rem;
  margin-right: 0.15rem;
  background: #F7C170;
  border-radius: 0.08rem;
  font-size: 0.16rem;
  color: #000000;
  border: 0;
  @media screen and (min-width: 800px) {
    width: 160px;
    height:50px;
    border-radius: 25px;
    font-size:18px;
  }
}
.btnShare {
  width: 1.3rem;
  height: 0.4rem;
  background: #68C6D7;
  border-radius: 0.08rem;
  font-size: 0.16rem;
  color: #000000;
  border: 0;
  @media screen and (min-width: 800px) {
    width: 160px;
    height:50px;
    border-radius: 25px;
    font-size:18px;
  }
}

</style>
