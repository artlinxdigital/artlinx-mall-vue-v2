<template>
  <div class="pageContainer fundRecordContain">
    <MPageHeader title="Money record" />
    <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
      <el-tab-pane label="Recorded" name="charge">
        <ChargeRecord />
      </el-tab-pane>
      <el-tab-pane label="Charge Off" name="withdraw">
        <WithdrawRecord />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MPageHeader from "@/components/MPageHeader";
import ChargeRecord from './ChargeRecord.vue';
import WithdrawRecord from './WithdrawRecord.vue';

export default {
  components: {
    MPageHeader,
    ChargeRecord,
    WithdrawRecord,
  },
  data () {
    return {
      activeName: 'charge',
    }
  },
  mounted () {
    const { type } = this.$route.query;
    if (type) {
      this.activeName = type;
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>

<style lang="less" scoped>
.fundRecordContain {
  /deep/ .el-tabs__header {
    margin-bottom: 0;
  }
  /deep/ .el-tabs__nav-wrap::after {
    background: transparent;
  }
  /deep/ .el-tabs__active-bar {
    display: none;
  }
  /deep/ .el-tabs__item {
    padding: 0;
    // margin-right: 20px;
    &.is-active {
      &::after {
        content: '';
        position: absolute;
        width: 0.58rem;
        height: 0.04rem;
        margin: 0 auto;
        background: #000000;
        border-radius: 0.02rem;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  }
}
</style>
