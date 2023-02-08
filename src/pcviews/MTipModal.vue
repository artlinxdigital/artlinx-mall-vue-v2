<template>
  <el-dialog
    :title="title"
    :visible="visible"
    width="30%"
    :before-close="handleClose"
    append-to-body
  >
    <div class="tipContainer">
      <p class="content">{{content}}</p>
    </div>
    <div slot="footer" v-if="showFoot">
      <el-button size="small" @click="$emit('close')">{{cancelTxt}}</el-button>
      <el-button size="small" type="primary" @click="$emit('ok')">{{confirmTxt}}</el-button>
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
.tipContainer {
  background: #fff;
  border-radius: 0.16rem;
  .title {
    font-size: 0.28rem;
    color: #333;
    text-align: center;
  }
  .content {
    margin-bottom: 0.3rem;
    font-size: 0.26rem;
    font-weight: 500;
    line-height: 0.42rem;
    color: #666;
    @media screen and (min-width: 800px) {
      font-size: 16px;
    }
  }
  .footBtns {
    display: flex;
    align-items: center;
    border-top: 1px solid #D9D9D9;
  }
  // .btnCancel {
  //   flex: 1;
  //   border: 0;
  //   font-size: 0.28rem;
  //   color: #999999;
  //   @media screen and (min-width: 800px) {
  //     padding: 15px 0;
  //     font-size: 18px;
  //   }
  // }
  // .btnConfirm {
  //   flex: 1;
  //   margin: 0;
  //   border: 0;
  //   border-left: 1px solid #d9d9d9;
  //   border-bottom-left-radius: 0;
  //   border-top-left-radius: 0;
  //   font-size: 0.28rem;
  //   color: #2FADC3;
  //   @media screen and (min-width: 800px) {
  //     padding: 15px 0;
  //     font-size: 18px;
  //   }
  // }
}
</style>
