<template>
  <div class="pageContainer myRecomend">
    <MPageHeader title="Referral Code" />
    <div class="codeBox">
      <div class="decoration">
        <div class="decorationInner"></div>
      </div>
      <span class="topDashed"></span>
      <span class="centerDshed"></span>
      <RecomendCodeContent :realName="realName" :recommendCode="recommendCode" />
    </div>
  </div>
</template>

<script>
import MPageHeader from "@/components/MPageHeader";
import RecomendCodeContent from "@/components/RecomendCodeContent";

export default {
  components: {
    MPageHeader,
    RecomendCodeContent
  },
  data() {
    return {
      recommendCode: '',
      realName: '',
    };
  },
  mounted() {this.getCurrentUser();
    this.recommendCode = this.$route.query.recommendCode;
    this.realName = this.$route.query.realName;
  }
}
</script>

<style lang="less" scoped>
.myRecomend {
  min-height: 100vh;
  background-color: #79C3D6;
}
.decoration {
  position: relative;
  width: 6.9rem;
  height: 0.3rem;
  background: #47C1D6;
  box-shadow: 0px 0.05rem 0.05rem 0px rgba(38, 114, 128, 0.3);
  border-radius: 0.15rem;
  z-index: 1;
  &Inner {
    position: absolute;
    width: 6.7rem;
    height: 0.1rem;
    margin: auto;
    background: #1C6A78;
    border-radius: 0.05rem;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
}
.codeBox {
  position: relative;
  width: 6.92rem;
  margin: 0.69rem auto;
}
.codeBoxIn {
  position: absolute;
  height: 10.96rem;
  background: url('../assets/images/code_bg.png') no-repeat center center;
  background-size: contain;
  text-align: center;
  top: -0.05rem;
  left: 0;
  right: 0;
  z-index: 2;
}
.topDashed {
  position: absolute;
  width: 6.34rem;
  border: 0.01rem dashed #000000;
  top: 0.47rem;
  left: 0.29rem;
  right: 0.29rem;
  z-index: 3;
}
.centerDshed {
  position: absolute;
  width: 6.34rem;
  border: 0.01rem dashed #000000;
  top: 3.21rem;
  left: 0.29rem;
  right: 0.29rem;
  z-index: 3;
}
.avatarBox {
  width: 1.39rem;
  height: 1.39rem;
  margin: 0.86rem auto 0.31rem;
  border-radius: 100%;
  background: #eee;
  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}
.userName {
  font-size: 0.34rem;
  color: #333;
}
.codeInfo {
  margin-top: 0.95rem;
  .myCodeTitle {
    margin-bottom: 0.32rem;
    font-size: 0.28rem;
    color: #333;
    font-weight: 500;
  }
  .myCode {
    margin-bottom: 0.18rem;
    font-size: 0.7rem;
    color: #333;
    font-weight: bold;
  }
  .recodeBox {
    width: 3.30rem;
    height: 3.30rem;
    margin: 0 auto 0.15rem;
    padding: 0.1rem;
    background: #eee;
    text-align: center;
    /deep/ img {
      margin: auto;
    }
  }
}
.shareTip {
  margin-bottom: 0.6rem;
  font-size: 0.24rem;
  color: #333;
}
.btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.7rem;
}
.btnSave {
  width: 2.6rem;
  height: 0.8rem;
  margin-right: 0.3rem;
  background: #F7C170;
  border-radius: 0.2rem;
  font-size: 0.3rem;
  color: #fff;
  border: 0;
}
.btnShare {
  width: 2.6rem;
  height: 0.8rem;
  background: #68C6D7;
  border-radius: 0.2rem;
  font-size: 0.3rem;
  color: #000000;
  border: 0;
}
</style>
