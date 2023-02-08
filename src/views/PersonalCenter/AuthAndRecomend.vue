<template>
  <div class="authAndRecomend">
    <div class="card authCard" @click="handleLinkAuth">
      <div class="cardMain">
        <span class="cardTit">KYC</span>
        <span class="cardSubTit">{{authMsg}}</span>
      </div>
    </div>
    <div class="card recomendcard" @click="handleLToRecomend">
      <div class="cardMain">
        <span class="cardTit">Referral Code</span>
        <span class="cardSubTit">{{recommendCode}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {
      recommendCode: '',
      realName: '',
      userStatus: '',
      authMsg: ''
    };
  },
  mounted() {this.getCurrentUser();

  },
  methods: {
    handleLinkAuth () {
      if (this.userStatus === 1 || this.userStatus === 2 || this.userStatus === 4 ) {
          return;
      }
      this.$router.push({
        path: '/realname',
      });
    },
    handleLToRecomend () {
      this.$router.push({
        path: '/recomend',
        query: {
          recommendCode: this.recommendCode,
          realName: this.realName
        }
      });
    },
    // 显示认证和验证码信息
    showRecommend(recommendCode, realName, userStatus) {
      this.recommendCode = recommendCode;
      this.realName = realName;
      if (this.userStatus === 1 || this.userStatus === 2) {
          this.authMsg = 'Have real name';
      }
      if (this.userStatus === 0 || this.userStatus === 3) {
          this.authMsg = 'Let\'s get an ID';
      }
      if (this.userStatus === 4) {
          this.authMsg = 'Under authentication';
      }
    }
  }
}
</script>

<style lang="less" scoped>
.bg(@file, @width, @height) {
  width: @width;
  height: @height;
  background: url('@{file}') no-repeat;
  background-size: 100% 100%;
}
.authAndRecomend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.24rem;
  .card {
    display: flex;
    align-items: center;
    width: 3.36rem;
    height: 1.65rem;
    //padding: 0.5rem 0.28rem;
    background: #FFFFFF;
    border-radius: 0.2rem;
    border:1px solid #000000;
  }
  .cardTit {
    margin-bottom: 0.2rem;
    font-size: 0.28rem;
    color: #333;
  }
  .cardSubTit {
    font-size: 0.24rem;
    color: #999;
  }
}
.authCard {
  margin-right: 0.29rem;
  &::before {
    content: '';
    margin-right: 0.3rem;
    .bg('../../assets/images/icon_renzheng@2x.png', 0.64rem, 0.64rem);
  }
}
.recomendcard {
  &::before {
    content: '';
    margin-right: 0.3rem;
    .bg('../../assets/images/icon_tuijian@2x.png', 0.64rem, 0.64rem);
  }
}
.cardMain {
  display: flex;
  flex-direction: column;
}
</style>
