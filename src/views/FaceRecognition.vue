<template>
  <div class="pageContainer">
    <MPageHeader title="Face Recognition" />
    <div class="cardBox">
      <span class="borderSpan"></span>
      <span class="borderSpan"></span>
      <span class="borderSpan"></span>
      <span class="borderSpan"></span>
      <div class="cardInnerImg"></div>
    </div>
    <p class="faceTip">Place your face in the frame and follow the instructions</p>
    <div class="btnRow">
      <el-button type="primary" class="btnConfirm">Begin to identify</el-button>
    </div>
  </div>
</template>

<script>
import MPageHeader from "@/components/MPageHeader";

export default {
  components: {
    MPageHeader
  }
}
</script>

<style lang="less" scoped>
.cardBox {
  position: relative;
  height: 2.77rem;
  margin: 1.1rem 1.86rem 0.76rem;
  .borderSpan:nth-child(1) {
    position: absolute;
    left: -0.02rem;
    top: -0.02rem;
    padding: 0.15rem;
    border-style: solid;
    border-color: #000000;
    border-width: 0.02rem 0 0 0.02rem;
  }
  .borderSpan:nth-child(2) {
    position: absolute;
    right: -0.02rem;
    top: -0.02rem;
    padding: 0.15rem;
    border-style: solid;
    border-color: #000000;
    border-width: 0.02rem 0.02rem 0 0;
  }
  .borderSpan:nth-child(3) {
    position: absolute;
    right: -0.02rem;;
    bottom: -0.02rem;;
    padding: 0.15rem;
    border-style: solid;
    border-color: #000000;
    border-width: 0 0.02rem 0.02rem 0;
  }
  .borderSpan:nth-child(4) {
    position: absolute;
    left: -0.02rem;
    bottom: -0.02rem;
    padding: 0.15rem;
    border-style: solid;
    border-color: #000000;
    border-width: 0 0 0.02rem 0.02rem;
  }
  .cardInnerImg {
    position: absolute;
    left: 0.3rem;
    right: 0.6rem;
    top: 0.3rem;
    bottom: 0.3rem;
    background: url('../assets/images/img_renlian@2x.png') no-repeat center;
    background-size: cover;
  }
}
.faceTip {
  margin: 0.76rem 0.2rem;
  font-size:0.28rem;
  color: #333;
  text-align: center;
}
.btnRow {
  margin: 3.57rem 0.74rem 1rem;
  .btnConfirm {
    width: 100%;
  }
}
</style>
