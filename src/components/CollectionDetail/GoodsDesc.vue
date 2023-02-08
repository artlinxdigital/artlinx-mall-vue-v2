<template>
  <section class="goodsDescPane">
    <h3 class="panelTitle">Description of Item</h3>
    <p class="goodsDescDetail">{{ desc }}</p>
    <!-- <span class="date">创建日期：{{ date && date.split(" ")[0] }}</span> -->
  </section>
</template>

<script>
export default {
  props: {
    desc: {
      type: String,
    },
    date: String,
  },
};
</script>

<style lang="less" scoped>
.goodsDescPane {
  margin-bottom: 0.65rem;
  @media screen and (max-width: 800px) {
    margin-bottom: 0.48rem;
  }
}
.panelTitle {
  margin-bottom: 0.32rem;
  font-size: 0.24rem;
  font-weight: 500;
  color: #000000;
  line-height: 0.36rem;
  @media screen and (max-width: 800px) {
    margin-bottom: 0.15rem;
    line-height: 0.3rem;
    font-size: 0.2rem;
  }
}
.goodsDescDetail {
  height: 0.89rem;
  overflow-y: auto;
  font-size: 0.14rem;
  font-weight: 400;
  color: #000000;
  line-height: 0.21rem;
  @media screen and (max-width: 800px) {
    height: auto;
    min-height: 0.89rem;
  }
}
.date {
  margin-top: 0.16rem;
  font-size: 0.14rem;
  color: #999999;
  line-height: 0.21rem;
}
</style>
