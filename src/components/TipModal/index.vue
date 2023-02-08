<template>
  <el-dialog
    title=""
    class="emptyDialog"
    :visible="visible"
    :width="clientWidth < 800 ? '85%' : '390px'"
    :before-close="handleClose"
    :show-close="false"
    :center="true"
    append-to-body
  >
    <div class="tipContainer">
      <h4 class="title">{{title}}</h4>
      <p class="content">{{content}}</p>
      <div class="footBtns" v-if="showFoot">
        <el-button class="btnCancel" @click="$emit('close')">{{cancelTxt}}</el-button>
        <el-button class="btnConfirm" @click="$emit('ok')">{{confirmTxt}}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: 'Tips',
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
  padding-top: 0.3rem;
  background: #fff;
  border-radius: 0.04rem;
  @media screen and (max-width: 800px) {
    padding-top: 0.2rem;
  }
  .title {
    margin: 0 0 0.2rem;
    font-size: 0.16rem;
    color: #333;
    text-align: center;
    @media screen and (max-width: 800px) {
      margin-bottom: 0.23rem;
    }
  }
  .content {
    padding: 0 0.3rem 0.3rem;
    font-size: 0.14rem;
    font-weight: 500;
    line-height: 0.21rem;
    color: #666;
    @media screen and (max-width: 800px) {
      padding: 0 0.3rem 0.3rem;
      line-height: 0.21rem;
    }
    @media screen and (min-width: 800px) {
      font-size: 16px;
    }
  }
  .footBtns {
    display: flex;
    align-items: center;
    border-top: 1px solid #D9D9D9;
  }
  .btnCancel {
    flex: 1;
    border: 0;
    font-size: 0.14rem;
    color: #999999;
    @media screen and (min-width: 800px) {
      padding: 15px 0;
      font-size: 18px;
    }
  }
  .btnConfirm {
    flex: 1;
    margin: 0;
    border: 0;
    border-left: 1px solid #d9d9d9;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    font-size: 0.14rem;
    color: #000000;
    @media screen and (min-width: 800px) {
      padding: 15px 0;
      font-size: 18px;
    }
  }
  @media screen and (max-width: 800px) {
    /deep/ .el-button span {
      font-size: 0.14rem;
    }
  }
}
</style>
