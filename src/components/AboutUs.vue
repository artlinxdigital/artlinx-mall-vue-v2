<template>
  <el-dialog
    title="About us"
    :visible="visible"
    width="70%"
    :before-close="handleClose"
    fullscreen
  >
    <p> Artlinx started in 2017, with the effort of the founders, it eventually came true in 2021 with the background of global Covid-19.<br><br>

      At Artlinx, we strive to increase the exchange and exchange value of digital art with the support of the technology, with artlinx endorses every piece of high resolution digital artworks with unique, tradable and acceptable by multiple value systems, which significantly make them scarce.<br><br>

      Unlike purely a stream of digital numbers, you can use our digital art marketplace to sell, buy, list and collect digital art pieces freely jus you own a physical painting, and we are more than happy to support the artists and collectors to enhance the value of art pieces in exchange.<br><br>

      We use open protocols Ethereum and interoperable stands will enable vibrant and neutral economies and allow artists and collectors to trade their assets freely and artists to launch new digital works with secure and fully compiled business environments.<br><br>

      Artlinx originated and headquartered in London and with solo business partner Asia biz research Limited  in Hong Kong, we are inviting you to explore the international digital ARTISTIBAMM.<br>
    </p>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    }
  }
}
</script>

<style lang="less" scoped>
h2 {
  margin: 0.2rem 0;
  font-size: 0.18rem;
  font-weight: bold;
}
h3 {
  margin: 0.2rem 0;
  font-size: 0.16rem;
  font-weight: bold;
}
p {
  font-size: 0.14rem;
  line-height: 0.25rem;
  @media screen and (max-width: 800px) {
    line-height: 0.4rem;
  }
}
ul {
  padding-left: 0.2rem;
  @media screen and (max-width: 800px) {
    padding-left: 0.28rem;
  }
  li {
    font-size: 0.14rem;
    line-height: 0.4rem;
  }
}
</style>
