<template>
  <div class="empty" :style="{marginTop: top}">
<!--    <div class="emptyImg"></div>-->
    <p class="emptyTip"><el-divider><span style="color: #597a6ba5">{{tip}}</span></el-divider></p>
  </div>
</template>

<script>
export default {
  props: {
    tip: {
      type: String,
      require: false,
      default: 'There is a BOTTOM LINE for digital art，Artlinx 2022'
    },
    top: {
      type: [String, Number],
      default: 0
    }
  }
}
</script>

<style lang="less" scoped>
.emptyImg {
  width:412px;
  height:296px;
  margin: 0 auto 35px;
  //background: url('../assets/images/que_shuju@2x.png') no-repeat center;
  background-size: 412px 296px;
  text-align: center;
  @media screen and (max-width: 800px) {
    width:2rem;
    height: 1.5rem;
    margin: 0 auto 0.58rem;
    background-size: 2rem 1.5rem;
  }

}
.emptyTip {
  font-size:14px;
  color: #C8C8C8;
  text-align: center;
  @media screen and (max-width: 800px) {
    font-size:0.14rem;
  }
}
.empty{min-height:1rem ;}
</style>
