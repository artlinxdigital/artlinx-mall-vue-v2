<template>
  <el-dialog
      :title="title"
      :visible="visible"
      width="80%"
      :before-close="handleClose"
      append-to-body
      fullscreen
  >
    <div class="dialog-content">
      <p class="content">
        Artlinx started in 2017, with the effort of the founders, it eventually came true in 2021 with the background of global Covid-19.<br><br>

        At Artlinx, we strive to increase the exchange and exchange value of digital art with the support of the technology, with artlinx endorses every piece of high resolution digital artworks with unique, tradable and acceptable by multiple value systems, which significantly make them scarce.<br><br>

        Unlike purely a stream of digital numbers, you can use our digital art marketplace to sell, buy, list and collect digital art pieces freely jus you own a physical painting, and we are more than happy to support the artists and collectors to enhance the value of art pieces in exchange.<br><br>

        We use open protocols Ethereum and interoperable stands will enable vibrant and neutral economies and allow artists and collectors to trade their assets freely and artists to launch new digital works with secure and fully compiled business environments.<br><br>

        Artlinx originated and headquartered in London and with solo business partner Asia biz research Limited  in Hong Kong, we are inviting you to explore the international digital ARTISTIBAMM.<br>
      </p>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: '提示',
    },
    content: {
      type: String,
      default: '',
    },
    cancelTxt: {
      type: String,
      default: 'cancel',
    },
    confirmTxt: {
      type: String,
      default: 'confirm',
    },
    showFoot: {
      type: Boolean,
      default: true,
    }
  },
  data () {
    return {
      clientWidth: 750
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.clientWidth = document.documentElement.clientWidth;
    });
  },
  methods: {
    handleClose () {
      this.$emit('close');
    },
  }
}
</script>

<style lang="less" scoped>

  ///deep/ .el-dialog{
  //  background: #000;
  //  border-radius: 2px;
  //  box-shadow: 0 1px 3px rgb(255 255 255 / 30%);
  //  border: 1px solid rgba(255,255,255,0.1);
  //  color: #fff;
  //}
  ///deep/ .el-dialog__title{
  //  color:#fff;
  //}
  ///deep/ .el-dialog__body{
  //  color:#cccccc;
  //}
  /deep/ .el-dialog__body{
    // max-height:500px;
    overflow: auto;
    color:#494949;
  }
.dialog-content{
  .title {
    font-size: 0.28rem;
    //color: #333;
    text-align: center;
  }
  .content {
    margin-bottom: 0.3rem;
    font-size: 0.26rem;
    font-weight: 500;
    line-height: 0.28rem;
    //color: #666;
    @media screen and (min-width: 800px) {
      font-size: 16px;
    }
  }

}
</style>
