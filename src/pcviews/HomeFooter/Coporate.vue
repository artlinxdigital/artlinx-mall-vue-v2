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

      - JOIN US AS ONE OF THE LEADERS OF SUSTAINABLE VALUE CREATION IN DIGITAL ART AND ASSET MANAGEMENT
        <br> <br>
        The Founders of Artlinx International all hold a strong believe that corporate social responsibility (CSR) is the right business model that help a company be socially accountable-to itself, its stakeholders, and the public.<br><br>
        Artlinx commits ourselves by practicing corporate social responsibility, and be conscious of the kind of impact Artlinx is having on all aspects of society, including economic, social and environment.<br><br>

        From the second of the founding of Artlinx, we commit so and our first programme is to work with internationally recognised Charitable orgnization to share a slice of our profit.<br><br>

        Details will be updated very soon!
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


</style>
