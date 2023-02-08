<template>
  <div class="netError">
    <div class="errImg"></div>
      <p class="errTip">Network error, refresh try</p>
      <div class="btnRow">
          <el-button type="primary" class="btnrefresh" @click="$emit('refresh')">Refresh</el-button>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.netError {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 70vh;
}
.errImg {
  width: 2rem;
  height: 1.5rem;
  margin-bottom: 0.3rem;
  background: url('../assets/images/que_wang@2x.png') no-repeat center;
  background-size: contain;
}
.errTip {
  margin-bottom: 0.3rem;
  font-size: 0.14rem;
  color: #C8C8C8;
}
.btnrefresh {
  width: 1rem;
  height: 0.32rem;
  padding: 0;
  line-height: 0.32rem;

  background: linear-gradient(210deg, #8CD2DC 0%, #000000 100%);
  border-radius: 0.16rem;
  border: none;
  span{font-size: 0.3rem;}
}
</style>
